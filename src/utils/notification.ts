export const show = (title: string, body: string, image?: string) => {
  if (Notification.permission === 'granted') {
    const notifi = new Notification(title, {
      body,
      icon: image || new URL('/favicon-32x32.png', import.meta.url).href,
    });
    notifi.onclick = () => window.focus();
  }
};
