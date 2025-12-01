import Elysia from "elysia"
import z from "zod/v4"
import { db } from '../lib/db'
import { users } from '../lib/db/schema/schema'


const userSchema = z.object({
  name: z
    .string({
      message: "Введите имя",
    })
    .min(3, "Имя должно быть длинее 3 символов"),
  email: z.email({
    message: "Неверный формат почты",
  })
  
});



export const app = new Elysia({
  prefix:"/api"
})

  .get("/users", async () => {
    const res = await db.query.users.findMany()
    return res;
  })
  .post(
    "/users",
    async ({ body }) => {
      await db.insert(users).values(body)
    },
    {
      body: userSchema
    },
  );

export type App = typeof app;
