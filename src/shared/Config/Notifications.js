
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export const createNotification = (type, mesage, label, time) => {
  return () => {
    NotificationManager.removeAll();
    switch (type) {
      case 'info':
        NotificationManager.info(mesage);
        break;
      case 'success':
        NotificationManager.success(mesage, label, 1000);
        break;
      case 'warning':
        NotificationManager.warning(mesage, label, 1000);
        break;
      case 'error':
        NotificationManager.error(mesage, label, 1000);
        break;
      default:
        console.log('Invalid notification type');
        break;
    }
  };
};

