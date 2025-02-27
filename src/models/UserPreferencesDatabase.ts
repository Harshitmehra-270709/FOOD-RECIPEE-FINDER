export class UserPreferencesDatabase {
  private dietaryPreferences: Map<string, Map<string, string>> = new Map();
  private userRatings: Map<string, Map<string, string>> = new Map();

  getPreferences(userId: string): Map<string, string> {
    return this.dietaryPreferences.get(userId) || new Map();
  }

  savePreferences(userId: string, preferences: Map<string, string>): void {
    this.dietaryPreferences.set(userId, preferences);
  }
} 