import { Config, Context, Effect, Layer } from "effect";

export class ClientConfig extends Context.Service<
  ClientConfig,
  {
    readonly convexUrl: string;
    readonly firebaseApiKey: string;
    readonly firebaseAuthDomain: string;
    readonly firebaseProjectId: string;
    readonly firebaseStorageBucket: string;
    readonly firebaseMessagingSenderId: string;
    readonly firebaseAppId: string;
  }
>()("@app/ClientConfig") {
  static readonly layer = Layer.effect(
    ClientConfig,
    Effect.gen(function* () {
      const convexUrl = yield* Config.string("NEXT_PUBLIC_CONVEX_URL");
      const firebaseApiKey = yield* Config.string("NEXT_PUBLIC_FIREBASE_API_KEY");
      const firebaseAuthDomain = yield* Config.string("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
      const firebaseProjectId = yield* Config.string("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
      const firebaseStorageBucket = yield* Config.string("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
      const firebaseMessagingSenderId = yield* Config.string(
        "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
      );
      const firebaseAppId = yield* Config.string("NEXT_PUBLIC_FIREBASE_APP_ID");

      return {
        convexUrl,
        firebaseApiKey,
        firebaseAuthDomain,
        firebaseProjectId,
        firebaseStorageBucket,
        firebaseMessagingSenderId,
        firebaseAppId,
      };
    })
  );
}

// Helper to run the config service effect on-demand
const getConfig = () =>
  Effect.runSync(ClientConfig.pipe(Effect.provide(ClientConfig.layer)));

export const clientConfig = {
  get convexUrl() {
    return getConfig().convexUrl;
  },
  get firebaseApiKey() {
    return getConfig().firebaseApiKey;
  },
  get firebaseAuthDomain() {
    return getConfig().firebaseAuthDomain;
  },
  get firebaseProjectId() {
    return getConfig().firebaseProjectId;
  },
  get firebaseStorageBucket() {
    return getConfig().firebaseStorageBucket;
  },
  get firebaseMessagingSenderId() {
    return getConfig().firebaseMessagingSenderId;
  },
  get firebaseAppId() {
    return getConfig().firebaseAppId;
  },
};
