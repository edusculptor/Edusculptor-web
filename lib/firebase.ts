
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED 
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initializing the app
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use initializeFirestore with persistence and connectivity optimizations
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  experimentalForceLongPolling: true
}, (firebaseConfig as any).firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
