import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyARguhmziQMnvCDO1NBpUj-0AfTuKTuptY",
  authDomain: "billboredx.firebaseapp.com",
  projectId: "billboredx",
  storageBucket: "billboredx.firebasestorage.app",
  messagingSenderId: "705414041725",
  appId: "1:705414041725:web:a27bbf2646a7c5638ea114",
  measurementId: "G-7272JQYCBX"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
