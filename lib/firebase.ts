import { initializeApp} from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDZ36BAV3WwwAECvOSWEfmdc3KnkLSzj8",
  authDomain: "facetag-real.firebaseapp.com",
  projectId: "facetag-real",
  storageBucket: "facetag-real.appspot.com",
  messagingSenderId: "284389183358",
  appId: "1:284389183358:web:88eb6af8cc80d83ac3ad2f",
  measurementId: "G-7BGP29JBWP"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };