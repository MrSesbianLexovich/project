import { api } from "@/app/utils/api";
import { queryClient } from "@/app/utils/query-client";
import { userSchema } from "@/server/api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod/v4";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function CreateUserDialog() {
  return (
    <Dialog>
      <DialogTrigger>Создать пользователя</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать пользователя</DialogTitle>
        </DialogHeader>
        <CreateUser />
      </DialogContent>
    </Dialog>
  );
}

function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [dob, setDob] = useState("");

  const createUserMutation = useMutation({
    mutationKey: ["create", "user"],
    mutationFn: async (data: z.infer<typeof userSchema>) => {
      const { error } = await api.users.post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      setName("");
      setEmail("");
      setDob("");
    },
    onError: (e) => {
      alert(e.message);
      alert("не удалось создать пользователя");
    },
  });

  const handleSubmit = () => {
    if (!name) {
      alert("Введите имя");
      return;
    }
    if (!email) {
      alert("Введите почту");
      return;
    }
    if (!dob) {
      alert("Введите дату рождения");
      return;
    }

    const userData = {
      name: name,
      email: email,
      dob: dob,
    };
    console.log(userData);
    createUserMutation.mutate(userData);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        placeholder="Имя"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Почта"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="date"
        placeholder="Дата рождения"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? "Создание..." : "Создать"}
      </Button>
    </div>
  );
}

interface UserProp {
  user: {
    id: string;
    name: string;
    email: string;
    dob: Date;
  };
}

export function EditUser({ user }: UserProp) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dob, setDob] = useState(user.dob.toLocaleDateString());

  const UpdateUserMutation = useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      dob?: string;
    }) => {
      const { error } = await api.users({ id: user.id }).put(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: () => {
      alert("не удалось создать пользователя");
    },
  });

  const handleSubmit = () => {
    if (!name) {
      alert("Введите имя");
      return;
    }
    if (!email) {
      alert("Введите почту");
      return;
    }
    if (!dob) {
      alert("Введите дату рождения");
      return;
    }

    // Create the user object directly here
    const userData = {
      name: name,
      email: email,
      dob: dob,
    };
    UpdateUserMutation.mutate(userData);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        placeholder="Имя"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Почта"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="date"
        placeholder="Дата рождения"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={UpdateUserMutation.isPending}
      >
        {UpdateUserMutation.isPending ? "Изменение..." : "Изменить"}
      </Button>
    </div>
  );
}
