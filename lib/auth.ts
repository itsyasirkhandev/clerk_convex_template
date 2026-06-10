// lib/auth.ts — Firebase Auth singleton.
//
// Callers import getFirebaseAuth() from here instead of calling getAuth(app) directly.
// This means:
//   - Firebase app initialization lives in one place (firebaseConfig.ts)
//   - Firebase auth initialization lives in one place (here)
//   - The Firebase SDK stays behind this seam; callers don't depend on firebase/app
//
// Depth: one small interface (getFirebaseAuth) hides the getAuth(app) call and the
// singleton memoization that would otherwise be repeated at every call site.

import { getAuth, type Auth } from "firebase/auth";
import { getFirebaseApp } from "../firebaseConfig";

let _auth: Auth | null = null;

/**
 * Returns the singleton Firebase Auth instance for this app.
 * Safe to call repeatedly — always returns the same object.
 */
export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}
