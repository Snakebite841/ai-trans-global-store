import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register New User
    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Create user document in Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                id: userCredential.user.uid,
                name,
                email,
                isAdmin: false, // Default is false, change manually in Firestore to grant admin
                createdAt: new Date().toISOString()
            });
            return userCredential;
        } catch (error) {
            throw error;
        }
    };

    // Login Existing User
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout
    const logout = () => {
        return signOut(auth);
    };

    // Fetch extra user info (like isAdmin) from Firestore
    const fetchUserData = async (uid) => {
        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await fetchUserData(user.uid);
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userData,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
