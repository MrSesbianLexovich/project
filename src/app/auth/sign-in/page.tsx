"use client";

import { authClient } from "@/app/utils/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    await authClient.signIn.email({
      email,
      password,
    });
    router.push("/");
  }

  return (
    <div className="">
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <Button onClick={() => signUp()}>Войти</Button>
    </div>
  );
}
