// src/components/Navbar.tsx
import Link from "next/link";
import "../NavBar/Navbar.styles.scss";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="nav flex">
      <h1 className="logo">
        <Image
          src="https://images.scalebranding.com/circle-a-letter-logo-modern-a-logo-565a8e3b-05a4-4025-b400-ec40a1be79ad.jpg"
          alt="logo"
          width={50}
          height={50}
        />
      </h1>
      <div className="links flex">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/shop" className="hover:underline">
          Marketplace
        </Link>
        <Link href="/documentation" className="hover:underline">
          Documentation
        </Link>
      </div>
    </nav>
  );
}
