import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration using Environment Variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Firebase config loaded with project ID:", firebaseConfig.projectId);

let app, auth, db;
try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);
    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);
    console.log("Firebase completely initialized successfully");
} catch (error) {
    console.error("FATAL FIREBASE ERROR:", error);
}

export { auth, db };
export default app;
