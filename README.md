Needs BunJS and a Mysql DB

1 - create a mysql database called daphnis

2 - create a .env file from the example.env

3 - run the below

$ `bun db:init`

What it does:

It will create a empty data base for daphnis and pull your existing artemis one into its own schema via introspection.

`"db:init": "npx prisma migrate dev --name init --schema prisma/schemas daphnis/schema.prisma; npx prisma db pull --schema prisma/schemas/artemis/schema.prisma"`

If you ever end up needing to add custom fields to the database run the below command

$ `bun daphnis:migrate`

---

4 - run the below

$ `bun daphnis:generate`

What it does:

generates the schema output

`"daphnis:generate": "prisma generate  --schema=./prisma/schemas/daphnis/schema.prisma"`

---

5 - run the below

generates the schema output

$ `bun aretmis:generate`

What it does:

`"artemis:generate": "prisma generate  --schema=./prisma/schemas/artemis/schema.prisma"`

---

6 - start daphnis

$ `bun run dev`

What it does:

`"dev": "next dev",`
