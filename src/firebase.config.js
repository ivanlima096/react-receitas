
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBx7rBfLwmdOam8OB2vNUfLLBRjDrMenvo",
  authDomain: "react-receitas.firebaseapp.com",
  projectId: "react-receitas",
  storageBucket: "react-receitas.appspot.com",
  messagingSenderId: "432002739344",
  appId: "1:432002739344:web:b103a2bce5e1236df17c15"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }