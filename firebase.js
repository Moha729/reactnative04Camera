// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQVGVT6XDclkJVnkgCp_Me81pFow5nHFU",
    authDomain: "notesandcamera.firebaseapp.com",
    projectId: "notesandcamera",
    storageBucket: "notesandcamera.appspot.com",
    messagingSenderId: "1039059816697",
    appId: "1:1039059816697:web:2a6fa70d49aa19cd8f1228"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
export {app, database}