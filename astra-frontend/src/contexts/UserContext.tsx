"use client"

import { createContext, useContext, useEffect, useState } from 'react';

type UserProviderProps = {
  children: React.ReactNode
}

type BlockchainKey = {
  network: string,
  publicKey: string
}

type User = {
  id: string
  defaultPublicKey: string
  blockchainPublicKeys: BlockchainKey[]
}

type UserContextType = {
  user: User | null,
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>

}

export const UserContext = createContext<UserContextType>({
  user: null,
  setCurrentUser: () => null
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:5156/api/v1/social/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();

        console.log(userData)
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to fetch user info", error);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    if (!currentUser) fetchUserInfo()

    console.log("fetched user info");
  }, []);

  const value = { user: currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext);
