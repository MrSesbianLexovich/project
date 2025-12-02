import { eq } from "drizzle-orm";
import Elysia from "elysia";
import z from "zod/v4";
import { db } from "../lib/db";
import { products, users } from "../lib/db/schema/schema";
import { auth } from "../lib/auth";

export const userSchema = z.object({
  name: z
    .string({
      message: "Введите имя",
    })
    .min(3, "Имя должно быть длинее 3 символов"),
  email: z.email({
    message: "Неверный формат почты",
  }),
  dob: z.string(),
});

export const productSchema = z.object({
  name: z.string({ message: "Введите название" }),
  description: z.string({ message: "Введите название" }),
  imageUrl: z.string({ message: "Введите Url" }),
});

export const userService = new Elysia({
  name: "user-service",
})
  .derive({ as: "global" }, async ({ request: { headers } }) => {
    const session = await auth.api.getSession({ headers });
    return {
      session,
    };
  })
  .macro({
    auth: {
      async resolve({ status, session }) {
        if (!session) return status(401);

        return {
          session: session!,
        };
      },
    },
    admin: {
      async resolve({ status, session }) {
        if (session?.user.role !== "admin") {
          return status(401);
        }
        return {
          session: session!,
        };
      },
    },
  });

export const app = new Elysia({
  prefix: "/api",
})
  .mount(auth.handler)
  .use(userService)

  .get("/me", ({ session }) => session)

  .get(
    "/users",
    async () => {
      const res = await db.query.users.findMany({
        orderBy: (users, { desc }) => [desc(users.dob)],
      });
      return res;
    },
    {
      admin: true,
    },
  )
  .post(
    "/users",
    async ({ body }) => {
      await db.insert(users).values({
        name: body.name,
        email: body.email,
        dob: new Date(body.dob),
      });
    },
    {
      body: userSchema,
    },
  )
  .put(
    "/users/:id",
    async ({ params, body }) => {
      const dob = body.dob ? new Date(body.dob) : undefined;
      await db
        .update(users)
        .set({ name: body.name, email: body.email, dob: dob })
        .where(eq(users.id, params.id));
    },
    {
      body: userSchema.partial(),
    },
  )
  .delete("/users/:id", async ({ params }) => {
    await db.delete(users).where(eq(users.id, params.id));
  })

  .get("/products", async () => {
    const res = await db.query.products.findMany({});
    return res;
  })
  .post(
    "/products",
    async ({ body }) => {
      await db.insert(products).values(body);
    },
    { body: productSchema },
  )
  .put(
    "/products/:id",
    async ({ params, body }) => {
      await db.update(products).set(body).where(eq(products.id, params.id));
    },
    { body: productSchema.partial() },
  )
  .delete("/products/:id", async ({ params }) => {
    await db.delete(products).where(eq(products.id, params.id));
  });

export type App = typeof app;
