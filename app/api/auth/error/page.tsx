"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home when component is mounted
    router.push("/");
  }, [router]); // Ensure useEffect runs only once

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between sm:p-6 p-4 pt-8 bg-gray-900 text-white">
      {/* You can add an error message or a loading spinner here if needed */}
      <p>Redirecting...</p>
    </main>
  );
}
