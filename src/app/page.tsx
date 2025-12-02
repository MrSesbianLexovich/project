"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "./utils/api";

export default function Home() {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await api.me.get();
      if (res.error) {
        throw new Error(String(res.error.status));
      }
      return res.data;
    },
  });

  return JSON.stringify({ session });

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-fit flex flex-row p-4 gap-4 border rounded-2xl">
        <Link href={"/users"}>Пользователи</Link>
        <Link href={"/products"}>Товары</Link>
      </div>
    </div>
  );
}

// export default function Home() {
//   const { data, error, isLoading, isFetching } = useQuery({
//     queryKey: ["get", "users"],
//     queryFn: async () => {
//       const { data, error } = await api.users.get();

//       if (error) {
//         throw new Error(error.value);
//       }

//       return data;
//     },
//   });

//   return (
//     <div>
//       <CreateUser />
//       {(isLoading || isFetching) && <p>Loading...</p>}
//       {error && <p>Error: {error.message}</p>}
//       {data && (
//         <div className="space-y-2">
//           {data.map((user) => (
//             <div key={user.id}>
//               <p>
//                 {user.id} - {user.name}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function CreateUser() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");

//   const createUserMutation = useMutation({
//     mutationKey: ["create", "user"],
//     mutationFn: async (data: { name: string; email: string }) => {
//       const res = await api.users.post(data);
//       if (res.error) {
//         throw new Error(res.error.value);
//       }
//       return res.data;
//     },
//     onSuccess: async () => {
//       await queryClient.invalidateQueries({
//         queryKey: ["users"],
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
//             alert("Введите почта");
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

// export default function Home() {
//   const { data, error, isLoading, isFetching } = useQuery({
//     queryKey: ["get", "data"],
//     queryFn: async () => {
//       const res = await fetch("/api");
//       if (!res.ok) {
//         throw new Error(res.statusText);
//       }
//       return (await res.json()) as { message: string; date: string };
//     },
//   });
//
//   return (
//     <>
//       <div>
//         {(isLoading || isFetching) && <p>Loading...</p>}
//         {error && <p>Error: {error.message}</p>}
//         {data && <p>Data: {JSON.stringify(data)}</p>}
//       </div>
//       <AnotherComponent />
//       <AnotherButton />
//     </>
//   );
// }

// function AnotherComponent() {
//   const { data, error, isLoading, isFetching } = useQuery({
//     queryKey: ["get", "data"],
//     queryFn: async () => {
//       const res = await fetch("/api");
//       if (!res.ok) {
//         throw new Error(res.statusText);
//       }
//       return (await res.json()) as { message: string };
//     },
//   });
//
//   return (
//     <div className="m-4 p-4 bg-red-500">
//       {(isLoading || isFetching) && <p>Loading...</p>}
//       {error && <p>Error: {error.message}</p>}
//       {data && <p>Data: {JSON.stringify(data)}</p>}
//     </div>
//   );
// }

// function AnotherButton() {
//   return (
//     <button
//       className="p-4 bg-white text-black rounded"
//       onClick={() => {
//         queryClient.invalidateQueries({
//           queryKey: ["get", "data"],
//         });
//       }}
//     >
//       Обновить данные
//     </button>
//   );
// }

// export default function Home() {
//   const [data, setData] = useState<{ message: string } | undefined>(undefined);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | undefined>(undefined);
//
//   async function getData() {
//     const res = await fetch("/api");
//     if (!res.ok) {
//       setError(new Error(res.statusText));
//       setLoading(false);
//       return;
//     }
//     const data = await res.json();
//     setData(data);
//     setLoading(false);
//   }
//
//   useEffect(() => {
//     getData();
//   }, []);
//
//   return (
//     <div>
//       {loading && <p>Loading...</p>}
//       {error && <p>Error: {error.message}</p>}
//       {data && <p>Data: {data.message}</p>}
//     </div>
//   );
// }
