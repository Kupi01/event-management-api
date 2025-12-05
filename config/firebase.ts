import admin from 'firebase-admin';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Initialize Firebase Admin SDK
 * Uses service account credentials from environment variables
 */
const initializeFirebase = (): void => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase already initialized');
      return;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing Firebase configuration in environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      })
    });

    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
};

// Initialize Firebase
initializeFirebase();

/**
 * Get Firestore database instance
 * @returns Firestore database instance
 */
export const getFirestore = (): admin.firestore.Firestore => {
  return admin.firestore();
};

/**
 * Get Firebase Auth instance
 * @returns Firebase Auth instance
 */
export const getAuth = (): admin.auth.Auth => {
  return admin.auth();
};

export default admin;
