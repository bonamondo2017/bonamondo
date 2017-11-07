import { initializeApp } from 'firebase';

const authConfig =  {
    apiKey: "AIzaSyCBuu09R6VTRxQuh4woMkeLK_cbR6HnRnc",
    authDomain: "bonamondo-72513.firebaseapp.com",
    databaseURL: "https://bonamondo-72513.firebaseio.com",
    projectId: "bonamondo-72513",
    storageBucket: "bonamondo-72513.appspot.com",
    messagingSenderId: "773377265934"
}

export const fbAuth = initializeApp(authConfig, 'auth').auth();