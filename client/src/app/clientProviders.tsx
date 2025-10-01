"use client";

import { SessionProvider } from "next-auth/react";
import StoreProvider from "./redux";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  );
}
