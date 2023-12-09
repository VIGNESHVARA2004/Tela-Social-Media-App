import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDBD2rN2Q84Bl0yvttqxy4A2BEmqwY0SnI",
    authDomain: "tela-68380.firebaseapp.com",
    projectId: "tela-68380",
    storageBucket: "tela-68380.appspot.com",
    messagingSenderId: "182242987750",
    appId: "1:182242987750:web:24afc4f10e04588588b527",
    measurementId: "G-WW4M9WL8TW"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, auth, storage};