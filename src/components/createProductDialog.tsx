import { api } from "@/app/utils/api";
import { queryClient } from "@/app/utils/query-client";
import { productSchema } from "@/server/api";
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

export default function CreateProductDialog() {
  return (
    <Dialog>
      <DialogTrigger>Создать продукт</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать продукт</DialogTitle>
        </DialogHeader>
        <CreateProduct />
      </DialogContent>
    </Dialog>
  );
}

function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const createProductMutation = useMutation({
    mutationKey: ["create", "products"],
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const { error } = await api.products.post(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      setName("");
      setDescription("");
      setImageUrl("");
    },
    onError: () => {
      alert("не удалось создать товар");
    },
  });

  const handleSubmit = () => {
    if (!name) {
      alert("Введите имя");
      return;
    }
    if (!description) {
      alert("Введите описание");
      return;
    }
    if (!imageUrl) {
      alert("Введите url");
      return;
    }

    const productData = {
      name: name,
      description: description,
      imageUrl: imageUrl,
    };
    //console.log(productData);
    createProductMutation.mutate(productData);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        placeholder="Название товара"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Описание товара"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="ImageUrl"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={createProductMutation.isPending}
      >
        {createProductMutation.isPending ? "Создание..." : "Создать"}
      </Button>
    </div>
  );
}

interface ProductProps {
  product: NonNullable<
    Awaited<ReturnType<typeof api.products.get>>["data"]
  >[number];
}

export function EditProduct({ product }: ProductProps) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl);

  const UpdateProductMutation = useMutation({
    mutationFn: async (data: {
      name?: string;
      description?: string;
      imageUrl?: string;
    }) => {
      const { error } = await api.products({ id: product.id }).put(data);
      if (error) {
        throw new Error(String(error.status));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["product"],
      });
    },
    onError: () => {
      alert("не удалось изменить товар");
    },
  });
  const handleSubmit = () => {
    if (!name) {
      alert("Введите имя");
      return;
    }
    if (!description) {
      alert("Введите описание");
      return;
    }
    if (!imageUrl) {
      alert("Введите url");
      return;
    }
    const productData = {
      name: name,
      description: description,
      imageUrl: imageUrl,
    };
    UpdateProductMutation.mutate(productData);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        placeholder="Название товара"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Описание товара"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="ImageUrl"
        className="p-2 rounded-md bg-white text-black outline-0"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={UpdateProductMutation.isPending}
      >
        {UpdateProductMutation.isPending ? "Создание..." : "Создать"}
      </Button>
    </div>
  );
}
