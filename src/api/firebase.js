import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA42p9S0KImwKKVMLsW6u60HiDrDoeM_94",
  authDomain: "ece-rest.firebaseapp.com",
  projectId: "ece-rest",
  storageBucket: "ece-rest.appspot.com",
  messagingSenderId: "746517743742",
  appId: "1:746517743742:web:32f717f81cdfe5132eb02f",
  measurementId: "G-4F845P4STT"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const database = getDatabase();
