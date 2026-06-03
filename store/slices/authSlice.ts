import { StateCreator } from 'zustand';
import { Effect, Schema } from 'effect';
import type { StoreState } from '../index';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import app from '../../firebaseConfig';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 1. Data Models
export const UserSchema = Schema.Struct({
  uid: Schema.String,
  email: Schema.String,
  displayName: Schema.NullOr(Schema.String),
  photoURL: Schema.NullOr(Schema.String),
});
export type User = typeof UserSchema.Type;

// 2. Domain Errors (Effect v4 TaggedErrorClass)
export class AuthError extends Schema.TaggedErrorClass<AuthError>()("AuthError", {
  message: Schema.String,
}) {}

// 3. The Effect Workflow for Google Login
export const googleLoginEffect = Effect.fn("googleLogin")(function* () {
  const userCredential = yield* Effect.tryPromise({
    try: () => signInWithPopup(auth, googleProvider),
    catch: (e: any) => new AuthError({ message: e?.message || "Failed to sign in with Google." })
  });

  const fbUser = userCredential.user;
  
  return {
    uid: fbUser.uid,
    email: fbUser.email || "",
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
  } as User;
});

export const logoutEffect = Effect.fn("logout")(function* () {
  yield* Effect.tryPromise({
    try: () => firebaseSignOut(auth),
    catch: (e: any) => new AuthError({ message: e?.message || "Failed to sign out." })
  });
});

// 4. Zustand Slice
export interface AuthSlice {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const createAuthSlice: StateCreator<
  StoreState,
  [['zustand/immer', never], ['zustand/persist', unknown]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  loginWithGoogle: async () => {
    set((state) => {
      state.isLoading = true;
      state.error = null;
    });

    const safeProgram = googleLoginEffect().pipe(
      Effect.match({
        onFailure: (error) => ({ success: false as const, error }),
        onSuccess: (user) => ({ success: true as const, user }),
      })
    );

    const result = await Effect.runPromise(safeProgram);

    set((state) => {
      if (result.success) {
        state.user = result.user;
        state.error = null;
      } else {
        state.error = result.error.message;
      }
      state.isLoading = false;
    });
  },
  
  logout: async () => {
     set((state) => { state.isLoading = true; });
     
     const safeLogout = logoutEffect().pipe(
       Effect.match({
         onFailure: () => {},
         onSuccess: () => {}
       })
     );
     
     await Effect.runPromise(safeLogout);
     
     set((state) => {
       state.user = null;
       state.error = null;
       state.isLoading = false;
     });
  },
});
