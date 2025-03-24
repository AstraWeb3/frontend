"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserProviderProps = {
  children: React.ReactNode;
};

type BlockchainKey = {
  network: string;
  publicKey: string;
};

type User = {
  id: string;
  defaultPublicKey: string;
  blockchainPublicKeys: BlockchainKey[];
};

type UserContextType = {
  user: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setCurrentUser: () => null,
  isAuthenticated: false,
  setIsAuthenticated: () => false,
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Make a request only if no valid session is stored
        const response = await fetch("http://localhost:5156/api/v1/social/me", {
          method: "GET",
          credentials: "include",
        });

        console.log("response: " + response);

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
          setIsAuthenticated(true);
          console.log("set ok");

          // Store in localStorage to prevent redundant calls
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setIsAuthenticated(false);
          // Clear stored session if unauthorized
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
    };

    // Check localStorage before making an API call
    const storedSession = localStorage.getItem("isAuthenticated");
    console.log("storedSession: " + storedSession);
    console.log("isAuthenticated: " + isAuthenticated);
    console.log(currentUser);

    if (storedSession && !currentUser) {
      checkAuthStatus();
    }
  }, [isAuthenticated, currentUser]);

  const value = {
    user: currentUser,
    setCurrentUser,
    isAuthenticated,
    setIsAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
