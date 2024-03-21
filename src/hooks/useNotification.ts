import { useEffect } from "react";

const useNotification = () => {
  useEffect(() => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);
}

export default useNotification;
