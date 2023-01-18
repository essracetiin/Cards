import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDIOwLR3tlkvuO8d-BGWFc4cCfk-lxIA5g",
    authDomain: "esracetin-63b1c.firebaseapp.com",
    projectId: "esracetin-63b1c",
    storageBucket: "esracetin-63b1c.appspot.com",
    messagingSenderId: "468710936271",
    appId: "1:468710936271:web:ba768620a02557b2dbb1ba",
    measurementId: "G-VR49GVECF8"
  };

  const app = initializeApp(firebaseConfig)
  export const storage = getStorage(app);
  export const db = getFirestore(app)
