"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import "../NavBar/Navbar.styles.scss";

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
    <nav className="nav flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
      <h1 className="logo flex items-center">
        <Image
          src="https://images.scalebranding.com/circle-a-letter-logo-modern-a-logo-565a8e3b-05a4-4025-b400-ec40a1be79ad.jpg"
          alt="logo"
          width={50}
          height={50}
        />
        <span className="ml-2 text-lg font-bold">My Marketplace</span>
      </h1>
      <div className="links flex items-center space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/shop" className="hover:underline">
          Marketplace
        </Link>
        <Link href="/documentation" className="hover:underline">
          Documentation
        </Link>
        {auth.isAuthenticated && isAdmin && (
          <Link href="/catalog" className="hover:underline">
            Catalog
          </Link>
        )}
      </div>

      {/* Authentication Actions */}
      <div className="auth-actions flex items-center space-x-4">
        {auth.isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {auth.user?.profile.name || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
