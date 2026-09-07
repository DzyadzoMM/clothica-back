import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const sendPushNotification = async (pushToken, title, body, data = {}) => {
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Токен ${pushToken} не є валідним Expo Push Token`);
    return;
  }

  const message = {
    to: pushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data, 
  };

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync([message]);
    console.log('Push notification sent successfully:', ticketChunk);
  } catch (error) {
    console.error('Помилка при відправці пуш-сповіщення:', error);
  }
};