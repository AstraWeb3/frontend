"use client";

import React from "react";
import { useAuth } from "react-oidc-context";
import sha256 from "crypto-js/sha256";
import { encode } from "utf8";

const LoginPage: React.FC = () => {
  const auth = useAuth();

  const getImageUrl = (
    email: string | null | undefined
  ): string | undefined => {
    if (!email) {
      return undefined;
    }
    return `https://www.gravatar.com/avatar/${computeSha256Hash(
      email
    )}?d=retro`;
  };

  const computeSha256Hash = (rawData: string): string => {
    return sha256(encode(rawData)).toString();
  };

  const handleLogout = (event: React.FormEvent) => {
    event.preventDefault();
    auth.signoutRedirect();
  };

  if (auth.isLoading) {
    return <p>Loading...</p>;
  }

  if (auth.error) {
    return <p>Error: {auth.error.message}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {auth.isAuthenticated ? (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            Welcome, {auth.user?.profile.name || "User"}
          </h2>
          <img
            src={auth.user ? getImageUrl(auth.user.profile.email) : undefined}
            alt="User"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <p className="mb-4">You're logged in!</p>
          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Log out
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-4">Please Sign In</h2>
          <button
            onClick={() => auth.signinRedirect()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign In with OIDC
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
