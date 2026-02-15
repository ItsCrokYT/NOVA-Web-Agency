import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification // <--- 1. IMPORTANTE: Nueva importación
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Login con Email
  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 1.1 Registro con Email + Envío de Verificación
  const signupWithEmail = async (email, password) => {
    // A. Crear el usuario
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // B. Enviar el correo de verificación inmediatamente
    try {
      await sendEmailVerification(userCredential.user);
      console.log("✅ Correo de verificación enviado a:", email);
    } catch (error) {
      console.error("❌ Error enviando correo:", error);
    }
    
    return userCredential;
  };

  // 2. Login con Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // 3. Configurar Recaptcha
  const setupRecaptcha = (elementId) => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
    return window.recaptchaVerifier;
  };

  // 4. Login con Teléfono
  const loginWithPhone = async (phoneNumber, appVerifier) => {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  // Cerrar Sesión
  const logout = () => {
    setUserRole(null);
    return signOut(auth);
  };

  // Helper para reenviar verificación manualmente (Usado en VerifyEmail.jsx)
  const resendVerification = () => {
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);
          user.role = userData.role; 
        } else {
          const newUserData = {
            email: user.email,
            role: 'client',
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, newUserData);
          setUserRole('client');
          user.role = 'client';
        }
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loginWithEmail,
    signupWithEmail, // Usamos la nueva versión
    loginWithGoogle,
    loginWithPhone,
    setupRecaptcha,
    logout,
    resendVerification // <--- Exportamos la función
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;