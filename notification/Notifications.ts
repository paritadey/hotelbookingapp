import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
class Notifications {
  constructor() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        // console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      popInitialNotification: true,
      requestPermissions: true,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
    });

    PushNotification.createChannel(
      {
        channelId: 'reminders', // (required)
        channelName: 'Task reminder notifications', // (required)
        channelDescription: 'Reminder for any tasks',
      },
      () => {},
    );

    PushNotification.getScheduledLocalNotifications(rn => {
      console.log('SN --- ', rn);
    });
  }

  scheduleNotification(date:Date, checkIn:string, checkOut:string, bookingId:string, hotelName:string) {
    console.log("Inside schedule notification");
    PushNotification.localNotificationSchedule({
      channelId: 'reminders',
      title: '🔔 Your booking with '+ hotelName+ ' is confirmed from '+checkIn+' to '+checkOut,
      message: 'Enjoy your stay! Have a lovely time.',
      date,
      repeatTime:4,
    });
  }
}

export default new Notifications();