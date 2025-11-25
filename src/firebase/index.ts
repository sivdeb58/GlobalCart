'use client';
// This file is the single entrypoint for all Firebase-related functionality.
// It exports a set of hooks and providers that can be used to interact with
// Firebase services.

import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

/**
 * A container for the initialized Firebase services.
 */
type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

// A private variable to hold the initialized Firebase services.
let firebaseServices: FirebaseServices | null = null;

/**
 * Initializes the Firebase app and returns the services.
 * This function is idempotent, meaning it will only initialize the app once.
 * @returns An object containing the initialized Firebase services.
 */
export function initializeFirebase(): FirebaseServices {
  if (firebaseServices) {
    return firebaseServices;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  firebaseServices = { app, auth, firestore };
  return firebaseServices;
}

// Re-export the core hooks and providers from the other Firebase modules.
// This makes it easy to import all Firebase functionality from a single file.
// export { useUser } from './auth/use-user';
// export { useDoc } from './firestore/use-doc';
// export { useCollection } from './firestore/use-collection';

// Note: The FirebaseProvider and related hooks are commented out because
// they are not yet fully implemented in the provided scaffolding.
/*
export {
  FirebaseProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
} from './provider';
*/
