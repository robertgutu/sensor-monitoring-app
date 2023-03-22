import { initializeApp } from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6FsVh376FKyF77ER3p3-qw-l1AmvJFR4",
  authDomain: "monitoringapi-f8032.firebaseapp.com",
  projectId: "monitoringapi-f8032",
  storageBucket: "monitoringapi-f8032.appspot.com",
  messagingSenderId: "327803581857",
  appId: "1:327803581857:web:026c9b9a540fc2131d87e0",
  measurementId: "G-H5NZGGFH3L"
};

const app = initializeApp(firebaseConfig);

export const db =getFirestore(app);
