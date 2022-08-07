import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {Context} from "react";

// init firebase
const firebaseConfig = {
    apiKey: "AIzaSyDj_7o_J9i4FAoKI_EttrcqifTTuAonJ-A",
    authDomain: "chess-tree.firebaseapp.com",
    projectId: "chess-tree",
    storageBucket: "chess-tree.appspot.com",
    messagingSenderId: "540242200369",
    appId: "1:540242200369:web:e855be0fe2128d00305210"
};

const app = initializeApp(firebaseConfig);

// init firebase auth
const auth = getAuth(app);

