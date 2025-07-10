import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOsfif7F90Ze8VGvr5DZnpMYbzgDMEQLU",
  authDomain: "todo-list-app-7a121.firebaseapp.com",
  databaseURL: "https://todo-list-app-7a121-default-rtdb.firebaseio.com", // ✅ Add this line
  projectId: "todo-list-app-7a121",
  storageBucket: "todo-list-app-7a121.appspot.com", // 🔁 Fixed .app to .com
  messagingSenderId: "597354150103",
  appId: "1:597354150103:web:b7af2ea40d51704b71d892"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
