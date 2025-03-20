// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyBvf65hVA8PT5BjnrMwZ0BFcOje_MGk0VQ",
  authDomain: "petverse-cf10b.firebaseapp.com",
  projectId: "petverse-cf10b",
  storageBucket: "petverse-cf10b.firebasestorage.app",
  messagingSenderId: "344670157993",
  appId: "1:344670157993:web:811373dd5eee2c74e2fdb8",
  measurementId: "G-H5P54Z1RNW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app); 
export const db = getFirestore(app);

export { provider,storage };

// import { db } from './firebase';

// Store vaccination reminder in Firestore

   



