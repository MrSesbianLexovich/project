"use client";

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "../app/utils/api";

export default function Users() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["get", "users"],
    queryFn: async () => {
      const { data, error } = await api.users.get();

      if (error) {
        throw new Error("error");
      }

      return data;
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
          <Button>Создать пользователя</Button>
        </div>
        {/* <Table name="Пользователи" /> */}
        <div className="border rounded-2xl">
          {(isLoading || isFetching) && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data && (
            <div className="space-y-2">
              {data.map((user) => (
                <div key={user.id}>
                  <p>
                    #{user.id} - {user.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// function CreateUser() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const createUserMutation = useMutation({
//     mutationKey: ["create", "user"],
//     mutationFn: async (data: { name: string; email: string }) => {
//       const res = await api.users.post(data);
//       if (res.error) {
//         throw new Error("error");
//       }
//       return res.data;
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ["get", "users"],
//       });
//     },
//     onError: () => {
//       alert("не удалось создать пользователя");
//     },
//   });

//   return (
//     <div className="p-4 border flex gap-1">
//       <input
//         className="p-2 rounded bg-white text-black"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <input
//         className="p-2 rounded bg-white text-black"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <button
//         onClick={() => {
//           if (!name) {
//             alert("Введите имя");
//             return;
//           }
//           if (!email) {
//             alert("Введите email");
//             return;
//           }

//           createUserMutation.mutate({ name, email });
//         }}
//         disabled={createUserMutation.isPending}
//         type="button"
//         className="p-2 bg-white text-black rounded"
//       >
//         {createUserMutation.isPending ? "Создание..." : "Создать"}
//       </button>
//     </div>
//   );
// }
