"use client";

import { api } from "@/app/utils/api";
import { queryClient } from "@/app/utils/query-client";
import CreateUserDialog, { EditUser } from "@/components/createUserDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userSchema } from "@/server/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod/v4";

export default function Users() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await api.users.get();

      if (error) {
        throw new Error(error.value);
      }

      return data;
    },
  });
  const DeleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.users({ id }).delete();
      if (error) {
        throw new Error("error");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
  });
  return (
    <div className="flex flex-row gap-4 p-4">
      <div className="flex flex-col gap-2 p-4 rounded-2xl border">
        <Button>Пользователи</Button>
        <Link href={"/products"}>
          <Button className="w-full">Товары</Button>
        </Link>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row p-4 rounded-2xl border">
          {/* <Button>Создать пользователя</Button> */}
          <CreateUserDialog />
        </div>
        {/* <Table name="Пользователи" /> */}
        <div className="p-4 border rounded-2xl">
          {(isLoading || isFetching) && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <div className="w-full grid grid-cols-4">
              <table className="text-nowrap">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Почта</th>
                    <th>Дата рождения</th>
                  </tr>
                </thead>
                <tbody className="w-40">
                  {data.map((user) => (
                    <tr key={user.id}>
                      <td className="text-nowrap p-4">{user.id}</td>
                      <td className="text-nowrap p-4">{user.name}</td>
                      <td className="text-nowrap p-4">{user.email}</td>
                      <td className="flex text-nowrap p-4 pr-0 justify-end">
                        {user.dob.toLocaleDateString()}
                      </td>
                      <td>
                        <Dialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="outline-0 ml-4">
                              <EllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DialogTrigger className="">
                                <DropdownMenuItem>Изменить</DropdownMenuItem>
                              </DialogTrigger>

                              <DropdownMenuItem
                                onClick={() => {
                                  DeleteUserMutation.mutate(user.id);
                                }}
                              >
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Изменить пользователя</DialogTitle>
                            </DialogHeader>
                            <EditUser user={user} />
                            <DialogDescription></DialogDescription>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
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
    console.log(userData);
    createUserMutation.mutate(userData);
  };

  return (
    <div className="p-4 border flex flex-row gap-1">
      <input
        className="p-2 rounded bg-white text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="p-2 rounded bg-white text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="date"
        className="p-2 rounded bg-white text-black"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={createUserMutation.isPending}
        type="button"
        className="p-2 bg-white text-black rounded"
      >
        {createUserMutation.isPending ? "Создание..." : "Создать"}
      </button>
    </div>
  );
}
