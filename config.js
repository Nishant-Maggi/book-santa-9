import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDu57_33fEk-mVUPXcdGF5ssMqCC1KMKAA",
  authDomain: "booksanta-e9189.firebaseapp.com",
  projectId: "booksanta-e9189",
  storageBucket: "booksanta-e9189.appspot.com",
  messagingSenderId: "338866961124",
  appId: "1:338866961124:web:cee01635d4bc6a99f40af1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
