"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import "../NavBar/Navbar.styles.scss";
import { Button } from "../ui/button";
import sha256 from "crypto-js/sha256";
import { encode } from "utf8";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const auth = useAuth();

  const isAdmin =
    Array.isArray(auth.user?.profile?.role) &&
    auth.user?.profile?.role.includes("Admin");

  const handleLogout = () => {
    auth.signoutRedirect();
  };

  const handleLogin = () => {
    auth.signinRedirect();
  };

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
    <nav className="nav">
      <h1 className="logo">
        <Image
          src="https://images.scalebranding.com/circle-a-letter-logo-modern-a-logo-565a8e3b-05a4-4025-b400-ec40a1be79ad.jpg"
          alt="logo"
          width={50}
          height={50}
        />
      </h1>
      <div className="links">
        <Link href="/">Home</Link>
        <Link href="/shop">Marketplace</Link>
        <Link href="/documentation">Documentation</Link>
        {auth.isAuthenticated && isAdmin && (
          <Link href="/catalog">Catalog</Link>
        )}
      </div>
      <div className="auth-actions">
        {auth.isAuthenticated ? (
          <div className="user-info">
            <Avatar>
              <AvatarImage src={getImageUrl(auth?.user?.profile.email) || ""} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            {auth.user?.profile.name || "User"}

            <Button onClick={handleLogout}>Log out</Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>Log in</Button>
        )}
      </div>
    </nav>
  );
}
