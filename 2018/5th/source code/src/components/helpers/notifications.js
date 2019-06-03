import { Notifications } from 'expo';


// Sets a notification `time` (in seconds) in the future and displays
// `text` with it.

const setNotification = (time, text) => {
  let t = new Date();
  let s = t.getSeconds() + time;
  t.setSeconds(s);

  const schedulingOptions = {
    time: t,
  };

  const localNotification = {
    title: text,
    // body: '', // (string) — body text of the notification.
    ios: {
      sound: true
    },
    android:
    {
      sound: true,
    }
  };

  Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);

  return t;
};

export {
  setNotification,
};
