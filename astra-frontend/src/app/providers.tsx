"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { oidcConfig } from "@/config/authConfig";
import { UserProvider } from "@/contexts/UserContext";
import { MultiChainAuthProvider } from "@/providers/MultiChainAuthProvider";
import { AuthProvider } from "react-oidc-context";

type ChildrenProp = {
  children: React.ReactNode;
};

/**
 * In Next.js, React Server Components don't support creating or consuming context directly.
 * If you try to create a context in a Server Component, it will result in an error.
 * Similarly, rendering a third-party context provider that doesn't have the "use client"
 * directive will also cause an error in Server Components.
 * @param children - The child components to be wrapped by the providers.
 * @returns The wrapped components with the necessary context providers.
 */
export function Providers({ children }: ChildrenProp) {
  return (
    <ThemeProvider defaultTheme="dark">
      <UserProvider>
        <MultiChainAuthProvider>{children}</MultiChainAuthProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
