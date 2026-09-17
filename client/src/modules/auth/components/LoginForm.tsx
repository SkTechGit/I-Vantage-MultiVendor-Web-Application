"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import {
  loginSchema,
  LoginFormData,
} from "../auth.schema";

import { login } from "../auth.api";

export default function LoginForm() {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (
    values: LoginFormData
  ) => {
    startTransition(async () => {
      try {
       await login(values);

        toast.success("Login successful.");

        router.refresh();

        router.push("/admin/dashboard");

      } catch (error: unknown) {

        toast.error(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
            "Invalid credentials."
        );

      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow"
      >

        <h1 className="mb-8 text-center text-3xl font-bold text-[#0A1F66]">
          Admin Login
        </h1>

        <div className="space-y-5">

          <Input
            label="Email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            type="password"
            label="Password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending
              ? "Logging in..."
              : "Login"}
          </Button>

          <div className="pt-2 text-center text-xs sm:text-sm text-slate-500">
            Have an admin invitation or need access?{" "}
            <a
              href="/admin/signup"
              className="font-semibold text-[#1E5BFF] hover:underline"
            >
              Sign Up / Request Access
            </a>
          </div>

        </div>

      </form>

    </div>
  );
}