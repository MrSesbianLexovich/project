"use client";

import { authClient } from "@/app/utils/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut().then(() => {
      router.push("/");
    });
  }, []);

  return null;
}
