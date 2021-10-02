import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseConfig = {
    apiKey: "AIzaSyDPd2d6Yclohn7LAPgb976Rm2ZmpdH91OI",
  authDomain: "chat-wa-35830.firebaseapp.com",
  projectId: "chat-wa-35830",
  storageBucket: "chat-wa-35830.appspot.com",
  messagingSenderId: "969804744059",
  appId: "1:969804744059:web:c7e4f88efa0ece065529de"
};

  const fapp = firebase.initializeApp(firebaseConfig);
export {
  fapp
};

export default firebaseConfig