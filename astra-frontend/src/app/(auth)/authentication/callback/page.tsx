"use client";

import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";

const AuthenticationCallbackPage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect to the homepage
    if (!auth.isLoading && !auth.error && auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isLoading, auth.error, auth.isAuthenticated, router, auth]);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  return null;
};

export default AuthenticationCallbackPage;
