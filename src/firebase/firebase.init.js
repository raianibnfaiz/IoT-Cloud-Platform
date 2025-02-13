// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCcdDC1h6hxpeEQEGTEmLEgfFuqnaRAF2c",
  authDomain: "rif-iot-cloud-platform.firebaseapp.com",
  projectId: "rif-iot-cloud-platform",
  storageBucket: "rif-iot-cloud-platform.firebasestorage.app",
  messagingSenderId: "812000667882",
  appId: "1:812000667882:web:a8b6475d03fbd430fa8f93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;