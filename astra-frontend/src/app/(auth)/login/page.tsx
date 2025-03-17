"use client";

import React from "react";
import sha256 from "crypto-js/sha256";
import { encode } from "utf8";
import { useUser } from "@/contexts/UserContext";
import { ConnectWallet } from "@/components/ConnectWallet/ConnectWallet";
import "../login/Login.styles.scss";

const LoginPage: React.FC = () => {
  const { user } = useUser();

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

  return (
    <div className="connect-page">
      <div className="connect-container">
        <div className="connect-card">
          <div className="connect-header">
            <h1>Connect Your Wallet</h1>
            <p>Sign in with your Solana wallet to continue</p>
          </div>
          <div className="connect-divider" />
          <div className="connect-wallet-wrapper">
            <ConnectWallet />
          </div>
          <div className="connect-footer">
            <p>
              By connecting your wallet, you agree to our{" "}
              <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
