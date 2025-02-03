"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page after logout
    router.push("/");
  }, [router]);

  return <p>Logging out...</p>;
}
