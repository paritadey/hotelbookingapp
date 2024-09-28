import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import {MEASUREMENT_ID, APPID, MESSAGING_SENDER_ID, STORAGE_BUCKET, PROJECT_ID, AUTH_DOMAIN, FIREBASE_API_KEY} from './utils/GoogleKey';
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APPID,
    measurementId: MEASUREMENT_ID
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  
  export { database };
  