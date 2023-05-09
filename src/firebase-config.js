import { initializeApp} from "firebase/app";
import 'firebase/database';
import {getFirestore} from "@firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA6FsVh376FKyF77ER3p3-qw-l1AmvJFR4",
  authDomain: "monitoringapi-f8032.firebaseapp.com",
  databaseURL: "https://monitoringapi-f8032-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "monitoringapi-f8032",
  storageBucket: "monitoringapi-f8032.appspot.com",
  messagingSenderId: "327803581857",
  appId: "1:327803581857:web:026c9b9a540fc2131d87e0",
  measurementId: "G-H5NZGGFH3L"
};

const app = initializeApp(firebaseConfig);

//firestore
export const db =getFirestore(app);
//real time db
export const rtdb = getDatabase(app);

