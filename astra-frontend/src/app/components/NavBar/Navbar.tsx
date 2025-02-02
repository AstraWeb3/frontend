// src/components/Navbar.tsx
import Link from "next/link";
import "../NavBar/Navbar.styles.scss";

export default function Navbar() {
  return (
    <nav className="nav flex">
      <h1 className="logo">Astra</h1>
      <div className="links flex">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/shop" className="hover:underline">
          Marketplace
        </Link>
      </div>
    </nav>
  );
}
