import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsFirstLogin(userDoc.data().isFirstLogin);
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setIsFirstLogin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signout = () => {
    signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signout, isFirstLogin, setIsFirstLogin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
