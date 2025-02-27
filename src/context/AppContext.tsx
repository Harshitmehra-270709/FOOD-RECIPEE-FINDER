import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import NetInfo from '@react-native-community/netinfo';
import { Platform, Dimensions } from 'react-native';
import { AppContextType, PushNotificationSettings, DeviceInfo, OfflineAction } from '../types/app';

const AppContext = createContext<AppContextType | undefined>(undefined);

const OFFLINE_ACTIONS_KEY = 'offlineActions';
const FAVORITES_KEY = 'favorites';
const PUSH_SETTINGS_KEY = 'pushSettings';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [pushNotificationSettings, setPushNotificationSettings] = useState<PushNotificationSettings>({
    newRecipes: true,
    cookingTimers: true,
    favoriteUpdates: true,
  });
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: Platform.OS as 'ios' | 'android',
    orientation: 'portrait',
    screenSize: Dimensions.get('window'),
  });

  useEffect(() => {
    let authSubscription: { unsubscribe: () => void } | null = null;
    let networkSubscription: ReturnType<typeof NetInfo.addEventListener> | null = null;
    let dimensionsSubscription: { remove: () => void } | null = null;

    const initialize = async () => {
      try {
        // Check auth session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        // Load favorites
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }

        // Load push settings
        const storedSettings = await AsyncStorage.getItem(PUSH_SETTINGS_KEY);
        if (storedSettings) {
          setPushNotificationSettings(JSON.parse(storedSettings));
        }

        // Setup auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });
        authSubscription = subscription;

        // Setup network listener
        networkSubscription = NetInfo.addEventListener(state => {
          const wasOffline = isOffline;
          const isNowOffline = !state.isConnected;
          setIsOffline(isNowOffline);

          if (wasOffline && !isNowOffline) {
            syncOfflineActions();
          }
        });

        // Setup dimensions listener
        dimensionsSubscription = Dimensions.addEventListener('change', ({ window }) => {
          const { width, height } = window;
          setDeviceInfo(prev => ({
            ...prev,
            orientation: width > height ? 'landscape' : 'portrait',
            screenSize: { width, height },
          }));
        });
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initialize();

    return () => {
      authSubscription?.unsubscribe();
      networkSubscription?.();
      dimensionsSubscription?.remove();
      
      // Save state before cleanup
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
      AsyncStorage.setItem(PUSH_SETTINGS_KEY, JSON.stringify(pushNotificationSettings));
    };
  }, []);

  const toggleFavorite = async (recipeId: string) => {
    try {
      const newFavorites = favorites.includes(recipeId)
        ? favorites.filter(id => id !== recipeId)
        : [...favorites, recipeId];

      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

      if (isOffline) {
        await saveOfflineAction({
          type: 'toggleFavorite',
          recipeId,
          timestamp: new Date().toISOString(),
        });
      } else if (user) {
        await syncFavoriteWithServer(recipeId, newFavorites.includes(recipeId));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const saveOfflineAction = async (action: OfflineAction) => {
    try {
      const actionsStr = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
      const actions: OfflineAction[] = actionsStr ? JSON.parse(actionsStr) : [];
      actions.push(action);
      await AsyncStorage.setItem(OFFLINE_ACTIONS_KEY, JSON.stringify(actions));
    } catch (error) {
      console.error('Error saving offline action:', error);
    }
  };

  const syncOfflineActions = async () => {
    if (!user) return;

    try {
      const actionsStr = await AsyncStorage.getItem(OFFLINE_ACTIONS_KEY);
      if (!actionsStr) return;

      const actions: OfflineAction[] = JSON.parse(actionsStr);
      for (const action of actions) {
        if (action.type === 'toggleFavorite') {
          await syncFavoriteWithServer(action.recipeId, favorites.includes(action.recipeId));
        }
      }

      await AsyncStorage.removeItem(OFFLINE_ACTIONS_KEY);
    } catch (error) {
      console.error('Error syncing offline actions:', error);
    }
  };

  const syncFavoriteWithServer = async (recipeId: string, isFavorited: boolean) => {
    if (!user) return;

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .upsert({ user_id: user.id, recipe_id: recipeId });
      } else {
        await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, recipe_id: recipeId });
      }
    } catch (error) {
      console.error('Error syncing favorite with server:', error);
    }
  };

  const updatePushNotificationSettings = async (settings: Partial<PushNotificationSettings>) => {
    if (!user) return;

    try {
      const newSettings = { ...pushNotificationSettings, ...settings };
      setPushNotificationSettings(newSettings);
      await AsyncStorage.setItem(PUSH_SETTINGS_KEY, JSON.stringify(newSettings));

      if (!isOffline) {
        await supabase
          .from('user_settings')
          .upsert({
            user_id: user.id,
            push_notifications: newSettings,
          });
      }
    } catch (error) {
      console.error('Error updating push settings:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'kitchenchef://auth/callback',
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear local state
      setFavorites([]);
      await AsyncStorage.multiRemove([FAVORITES_KEY, OFFLINE_ACTIONS_KEY, PUSH_SETTINGS_KEY]);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        favorites,
        toggleFavorite,
        isFavorite: (recipeId: string) => favorites.includes(recipeId),
        signIn,
        signUp,
        signOut,
        isOffline,
        pushNotificationSettings,
        updatePushNotificationSettings,
        deviceInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 