import { initializeApp, getApps } from "firebase/app";
import { clientConfig } from "./lib/services/Config";

export function getFirebaseApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  const firebaseConfig = {
    apiKey: clientConfig.firebaseApiKey,
    authDomain: clientConfig.firebaseAuthDomain,
    projectId: clientConfig.firebaseProjectId,
    storageBucket: clientConfig.firebaseStorageBucket,
    messagingSenderId: clientConfig.firebaseMessagingSenderId,
    appId: clientConfig.firebaseAppId,
  };

  return initializeApp(firebaseConfig);
}
