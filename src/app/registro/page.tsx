"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegistroRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/"); }, [router]);
  return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
}
