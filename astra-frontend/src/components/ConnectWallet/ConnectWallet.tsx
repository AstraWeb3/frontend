"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import bs58 from "bs58";
import { useUser } from "@/contexts/UserContext";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import "../ConnectWallet/ConnectWallet.styles.scss";

/**
 * ConnectWallet Component
 *
 * This component handles authentication via Solana wallets using
 * the `@solana/wallet-adapter-react` package. It allows users to:
 * - Connect their Solana wallet (e.g., Phantom)
 * - Sign a message to authenticate with the backend
 * - Store authentication state in cookies (JWT-based auth)
 * - Retrieve and store user info in global React Context (`UserContext`)
 * - Display authentication status and allow logout
 *
 */

export const ConnectWallet = () => {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    connect,
    disconnect,
    signMessage,
    select,
    wallets,
  } = useWallet();
  const { user, setCurrentUser } = useUser(); // Get user state from context
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, no need to prompt them again
    if (user) {
      console.log("User already authenticated:", user);
    }
  }, [user]);

  const handleConnect = async () => {
    if (wallets.length === 0) {
      alert("No wallets detected! Ensure Phantom is installed.");
      return;
    }

    try {
      setIsLoading(true);
      select(wallets[0].adapter.name);
      await connect();
      setIsLoading(false);
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect wallet.");
      setIsLoading(false);
    }
  };

  const handleSignMessage = async () => {
    if (!connected) {
      alert("Please connect a wallet first!");
      await connect();
      return;
    }

    if (!publicKey || !signMessage) {
      alert("Wallet is not fully initialized!");
      return;
    }

    try {
      setIsLoading(true);
      const message = `Authenticate at ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);
      const signatureBase58 = bs58.encode(signedMessage);

      setSignature(signatureBase58);

      const response = await fetch(
        "http://localhost:5156/api/v1/social/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensure cookies are sent
          body: JSON.stringify({
            defaultPublicKey: publicKey.toBase58(),
            message,
            signature: signatureBase58,
            network: "SOL",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signature verification failed!");
      }

      // Fetch authenticated user info after login
      await fetchUserInfo();
      alert("Authentication successful!");
    } catch (error) {
      console.error("Message signing failed", error);
      alert("Failed to sign the message. Check the console for more details.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("http://localhost:5156/api/v1/social/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);

        // Store in localStorage to prevent redundant calls
        localStorage.setItem("isAuthenticated", "true");

      }
    } catch (error) {
      localStorage.removeItem("isAuthenticated"); // Clear stored session if unauthorized

      console.error("Error fetching user info", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5156/api/v1/social/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });

      setIsLoading(true);
      await disconnect();
      setCurrentUser(null);
      // You might want to call a logout endpoint here if needed
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wallet-component">
      {user ? (
        <>
          <div className="user-info">
            <div className="user-address">
              <span className="label">Connected as</span>
              <span className="value">
                {user.defaultPublicKey.slice(0, 6)}...
                {user.defaultPublicKey.slice(-4)}
              </span>
            </div>
            <div className="status-indicator"></div>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoading}
            className={`disconnect ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="spinner" /> Disconnecting
              </>
            ) : (
              "Disconnect Wallet"
            )}
          </Button>
        </>
      ) : connected ? (
        <Button
          variant="default"
          onClick={handleSignMessage}
          disabled={isLoading}
          className={`sign ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" /> Authenticating
            </>
          ) : (
            "Sign Message to Authenticate"
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={handleConnect}
          disabled={isLoading}
          className={`connect ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" /> Connecting
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}
    </div>
  );
};
