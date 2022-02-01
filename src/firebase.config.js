// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM3HYf0ZmxVU8QlVMGg8j74_E_4RsxMWk",
  authDomain: "react-recipe-app-b223d.firebaseapp.com",
  projectId: "react-recipe-app-b223d",
  storageBucket: "react-recipe-app-b223d.appspot.com",
  messagingSenderId: "135469382177",
  appId: "1:135469382177:web:77e626d4e25605d3bc8160",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {db}
