import * as Notifications from 'expo-notifications';
import { Marker } from '../types';

export interface ActiveNotification {
  markerId: number;
  notificationId: string;
  timestamp: number;
}

export class NotificationManager {
  private activeNotifications = new Map<number, ActiveNotification>();

  async requestNotificationPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  async showNotification(marker: Marker): Promise<void> {
    if (this.activeNotifications.has(marker.id)) return;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Вы рядом с меткой!',
        body: `Вы находитесь рядом с сохранённой точкой.`,
      },
      trigger: null,
    });

    console.log(notificationId);
    const all = await Notifications.getAllScheduledNotificationsAsync();
    console.log(all.length);
    this.activeNotifications.set(marker.id, {
      markerId: marker.id,
      notificationId,
      timestamp: Date.now(),
    });
  }

  async removeNotification(markerId: number): Promise<void> {
    const notification = this.activeNotifications.get(markerId);
    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
      this.activeNotifications.delete(markerId);
    }
  }
}
