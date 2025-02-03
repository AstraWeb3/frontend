"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import "../NavBar/Navbar.styles.scss";
import { Button } from "../ui/button";

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
          <div className="flex items-center space-x-2">
            <span className="user-info">
              {auth.user?.profile.name || "User"}
            </span>
            <Button onClick={handleLogout}>Log out</Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>Log in</Button>
        )}
      </div>
    </nav>
  );
}
