import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnvLAi4N25DgIULsBM7HQOWWIcGRih8u8",
  authDomain: "ecerest-2b7fc.firebaseapp.com",
  projectId: "ecerest-2b7fc",
  storageBucket: "ecerest-2b7fc.appspot.com",
  messagingSenderId: "192692457825",
  appId: "1:192692457825:web:29f262488ded232433f520",
  measurementId: "G-FNMQXYEJN5"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
