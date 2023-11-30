This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and deployed on vercel.

## Setup

This application uses TypeScript, Next.js and TailwindCSS
Deployment is easily done through vercel, data is stored in supabase (Postgresql underneath).
Auth is done through supabase as well.

## Supabase setup

#### Auth flow

I have one table to keep track of users' personal information. When a new user gets invited, their email address and a random uuid are inserted into this table. I do this with a trigger on the auth.users table that calls a function to handle the insert:

**DB Trigger:**

```
create trigger on_auth_user_created
after insert on auth.users for each row
execute function handle_new_user ();
```

**handle_new_user() function:**

```
begin
  insert into public.userinfo (id, email)
  values (new.id, new.email);
  return new;
end;
```

#### RLS and Admin users

A separate table is used to keep track of which users get admin access to the app. This is a lightweight solution as I only need to support admin users being able to read data from all registered users. Both normal users and admins can read and update their own personal data. To make this work in combination with RLS policies, I setup a postgres function to check whether a user is in the admins table.

**is_admin() function:**

```
BEGIN
  return (
    select exists(
      select 1 from admins where id = auth.uid()
    )
  );
END;
```

&nbsp;

**RLS Policies**

**Enable users to check whether they're an admin:**

```
CREATE POLICY "Enable SELECT for users based on their id" ON "public"."admins"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = id)
```

**Enable users to read their data and admins to read all data:**

```
CREATE POLICY "Enable SELECT for users (own data) and admins (all data)" ON "public"."userinfo"
AS PERMISSIVE FOR SELECT
TO authenticated
USING ((is_admin() OR (auth.uid() = id)))
```

**Enable users to update their own data**

```
CREATE POLICY "Enable update for users based on their id" ON "public"."userinfo"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id)
```
