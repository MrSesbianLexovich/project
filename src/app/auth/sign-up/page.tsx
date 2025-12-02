"use client";

import { authClient } from "@/app/utils/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    if (!name) {
      alert("Введите имя");
      return;
    }

    await authClient.signUp.email({
      email,
      password,
      name,
    });
    router.push("/");
  }

  return (
    <div className="">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
      />
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
      <Button onClick={() => signUp()}>Зарегистрироваться</Button>
    </div>
  );
}
