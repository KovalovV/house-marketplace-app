// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAIPYvJq1UOxgGOPIQ5hWQGG20W81Ypb8",
  authDomain: "house-marketplace-app-84804.firebaseapp.com",
  projectId: "house-marketplace-app-84804",
  storageBucket: "house-marketplace-app-84804.appspot.com",
  messagingSenderId: "771177210932",
  appId: "1:771177210932:web:b519e566e4f9d51045d661"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();