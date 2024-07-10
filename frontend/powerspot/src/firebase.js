// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwrQ5bff9xVDMLf0nvW6GYn2byJfuculQ",
  authDomain: "powerspot-e37aa.firebaseapp.com",
  projectId: "powerspot-e37aa",
  storageBucket: "powerspot-e37aa.appspot.com",
  messagingSenderId: "1035054270336",
  appId: "1:1035054270336:web:7f98a34b3f195a23eae365"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);


export { auth };