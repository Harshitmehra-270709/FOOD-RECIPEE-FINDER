import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { notificationService } from '@/services/notificationService'
import Icon from '@/components/Icon'

interface Props {
  recipeName: string
  defaultMinutes?: number
}

export default function CookingTimer({ recipeName, defaultMinutes = 30 }: Props) {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60)
  const [notificationId, setNotificationId] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = async () => {
    const id = await notificationService.scheduleCookingTimer(recipeName, defaultMinutes)
    setNotificationId(id)
    setIsRunning(true)
  }

  const handleStop = async () => {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId)
      setNotificationId(null)
    }
    setIsRunning(false)
    setTimeLeft(defaultMinutes * 60)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Icon name="play" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Timer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={handleStop}>
            <Icon name="stop" size={24} color="#fff" />
            <Text style={styles.buttonText}>Stop Timer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 16
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    fontVariant: ['tabular-nums']
  },
  buttonContainer: {
    marginTop: 16
  },
  button: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8
  },
  stopButton: {
    backgroundColor: '#FF6B6B'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  }
}) 