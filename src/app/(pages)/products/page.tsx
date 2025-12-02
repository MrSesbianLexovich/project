"use client";

import { api } from "@/app/utils/api";
import { queryClient } from "@/app/utils/query-client";
import CreateProductDialog, {
  EditProduct,
} from "@/components/createProductDialog";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";

export default function Product() {
  const { data, error, isLoading, isFetching } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await api.products.get();

      if (error) {
        throw new Error(String(error.value));
      }

      return data;
    },
  });
  const DeleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await api.products({ id }).delete();
      if (error) {
        throw new Error("error");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return (
    <div className="flex flex-row gap-4 p-4">
      <div className="flex flex-col gap-2 p-4 rounded-2xl border">
        <Link href={"/users"}>
          <Button className="w-full">Пользователи</Button>
        </Link>
        <Button>Товары</Button>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-row p-4 rounded-2xl border">
          <CreateProductDialog />
        </div>

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
                    <th>Описание</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody className="w-40">
                  {data.map((product) => (
                    <tr key={product.id}>
                      <td className="text-nowrap p-4">{product.id}</td>
                      <td className="text-nowrap p-4">{product.name}</td>
                      <td className="text-nowrap p-4">{product.description}</td>
                      <td className="flex text-nowrap p-4 pr-0 justify-end">
                        {product.imageUrl}
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
                                  DeleteProductMutation.mutate(product.id);
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
                            <EditProduct product={product} />
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
