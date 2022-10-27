import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
    apiKey: "AIzaSyD2UNwxKJ_DxP4TDesXhpUtu-fs0lnU_og",
    authDomain: "miniblog-503df.firebaseapp.com",
    projectId: "miniblog-503df",
    storageBucket: "miniblog-503df.appspot.com",
    messagingSenderId: "749329146864",
    appId: "1:749329146864:web:4a43d28d64e2554e847335"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const storage = getStorage(app)

export {db, storage}