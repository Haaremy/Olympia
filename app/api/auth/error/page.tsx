"use client";

import router from "next/router";
import { useEffect } from "react";



export default function Page() {
 
  useEffect(() => {

      router.push("/");
 
  });

 

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-between sm:p-6 p-4 pt-8 bg-gray-900 text-white">
      
    </main>
  );
}
