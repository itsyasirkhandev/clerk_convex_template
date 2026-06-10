"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConvexProviderWithAuth, ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import useFirebaseAuth from "@/hooks/useFirebaseAuth";
import { api } from "@/convex/_generated/api";

import { clientConfig } from "@/lib/services/Config";

function UserSyncTrigger() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const syncUser = useMutation(api.authed.users.getOrCreateUser);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      void syncUser().catch((err) => {
        console.error("Failed to sync user to Convex:", err);
      });
    }
  }, [isAuthenticated, isLoading, syncUser]);

  return null;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convex] = useState(() => new ConvexReactClient(clientConfig.convexUrl));

  return (
    <ConvexProviderWithAuth client={convex} useAuth={useFirebaseAuth}>
      <UserSyncTrigger />
      {children}
    </ConvexProviderWithAuth>
  );
}

