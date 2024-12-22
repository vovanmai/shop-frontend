'use client'
import firebaseApp from './../../libs/firebase';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { notification, Typography } from 'antd';
const { Paragraph, Text } = Typography;
import { SmileOutlined } from '@ant-design/icons';

import {useEffect, useState} from "react";

export default function Home() {
  const [api, contextHolder] = notification.useNotification();
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    const requestPermission = async () => {
      try {
        // if ('serviceWorker' in navigator) {
        //   // Đăng ký Service Worker
        //   navigator.serviceWorker.register('/firebase-messaging-sw.js')
        //     .then(async (registration) => {
        //       console.log('Service Worker registered with scope:', registration.scope);
    
        //       const permission = await Notification.requestPermission();
        //       if (permission === 'granted') {
        //         const messaging = getMessaging(firebaseApp);
        //         const currentToken = await getToken(messaging, {
        //           vapidKey: "BGBGjC-y5XgZjyiBi3n2GK8npQuG74yNfd9bWs4s2t1V2QullBCY7x3Kge31LCWZ49l9TlDZsdLQK_VNv7775u4",
        //         });
        //         console.log(currentToken);
        //       } else {
        //         console.log('Not granted');
        //       }
        //     }).catch((err) => {
        //       console.log('Service Worker registration failed: ', err);
        //     });
        // } else {
        //   console.log("Service Worker is not supported in this browser.");
        // }





        // const messagingSupported = await isSupported();
        // const permission = await Notification.requestPermission();
        // if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        //   if (permission === 'granted') {
            
        //     const messaging = getMessaging(firebaseApp);
        //     const currentToken = await getToken(messaging, {
        //       vapidKey: "BGBGjC-y5XgZjyiBi3n2GK8npQuG74yNfd9bWs4s2t1V2QullBCY7x3Kge31LCWZ49l9TlDZsdLQK_VNv7775u4",
        //     });
        //     console.log(currentToken);
        //   } else {
        //     console.log('Not granted');
        //   }
        // }
      } catch (error) {
        console.error('Error getting permission or token:', error);
      }
    };
    // requestPermission()

    // const messaging = getMessaging(firebaseApp);
    // onMessage(messaging, (payload) => {
    //     api.open({
    //       message: payload?.notification?.title,
    //       description: payload?.notification?.body,
    //       icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    //     });
    // });
  }, [])


  useEffect(() => {
    const getDeviceToken = async () => {
        const permission = await Notification.requestPermission();
        console.log(permission)
        if (permission !== 'granted') {
            console.log('Notification permission not granted.');
            return;
        }


        const existingToken = localStorage.getItem("fcmToken");
        if (existingToken) {
            setToken(existingToken)
            console.log("FCM Token from storage:", existingToken);
            return existingToken;
        }

        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
            await navigator.serviceWorker.ready;
            console.log('Active', registration)

            const messaging = getMessaging(firebaseApp);
            const token = await getToken(messaging, {
                vapidKey: 'BGBGjC-y5XgZjyiBi3n2GK8npQuG74yNfd9bWs4s2t1V2QullBCY7x3Kge31LCWZ49l9TlDZsdLQK_VNv7775u4',
                serviceWorkerRegistration: registration
            })
            localStorage.setItem("fcmToken", token);
            console.log('Get token success: ' + token)
            setToken(token)
            return token
        } else {
            console.log("Service Workers are not supported in this browser.");
        }
    }

    getDeviceToken()

    // const messaging = getMessaging(firebaseApp);
    // onMessage(messaging, (payload) => {
    //     console.log(payload)
    //   api.open({
    //     message: payload?.notification?.title,
    //     description: payload?.notification?.body,
    //     icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    //   });
    // });
  }, []);

  return (
    <div>
      {contextHolder}
      This is dashboard page
        <Paragraph copyable>{token}</Paragraph>
    </div>
  );
}
