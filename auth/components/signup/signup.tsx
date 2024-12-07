"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { signUp } from "./action";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    accessCode: z
      .string()
      .regex(/^\d{20}$/, "Access Code must be exactly 20 numeric characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // Convert FieldValues to FormData
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    const { error } = await signUp(formData);
    if (error) {
      toast({
        title: "Error",
        description: error,
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>
          Enter your info below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              {...register("username")}
              type="text"
              placeholder="username"
              required
            />
            {errors.username?.message &&
              typeof errors.username.message === "string" && (
                <p className="text-red-600">{errors.username.message}</p>
              )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="mail@mail.com"
              required
            />
            {errors.email?.message &&
              typeof errors.email.message === "string" && (
                <p className="text-red-600">{errors.email.message}</p>
              )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              {...register("accessCode")}
              type="text"
              placeholder="*******************"
              required
            />
            {errors.accessCode?.message &&
              typeof errors.accessCode.message === "string" && (
                <p className="text-red-600">{errors.accessCode.message}</p>
              )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="********"
              required
            />
            {errors.password?.message &&
              typeof errors.password.message === "string" && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              placeholder="********"
              required
            />
            {errors.confirmPassword?.message &&
              typeof errors.confirmPassword.message === "string" && (
                <p className="text-red-600">{errors.confirmPassword.message}</p>
              )}
          </div>

          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export { SignUpForm };
