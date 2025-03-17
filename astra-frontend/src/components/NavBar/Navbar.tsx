"use client";

import Link from "next/link";
import Image from "next/image";
import "../NavBar/Navbar.styles.scss";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "../ThemeToggle/theme-toggle";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
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
        <Link href="/social">Social</Link>
        <Link href="/shop">Marketplace</Link>
        <Link href="/documentation">Documentation</Link>
      </div>
      <div className="auth-actions">
        <div className="user-info">
          {user && <div>{user.defaultPublicKey}</div>}
          {/* <Avatar>
            <AvatarImage src={getImageUrl(auth?.user?.profile.email) || ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}

          {/* <Button onClick={handleLogout}>Log out</Button> */}
        </div>
        {user ? (
          <Button variant="outline">
            <Link href="login">Profile</Link>
          </Button>
        ) : (
          <Button variant="outline">
            <Link href="/login">Log in </Link>
          </Button>
        )}
      </div>
      <ThemeToggle />
    </nav>
  );
}
