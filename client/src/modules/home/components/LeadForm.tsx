"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import {
  leadSchema,
  LeadFormData,
} from "@/modules/lead/lead.schema";

import { createLead } from "@/modules/lead/lead.api";

import { Service } from "@/modules/service/service.types";

interface Props {
  services: Service[];
  onSuccess: () => void;
}

export default function LeadForm({
  services,
  onSuccess,
}: Props)  {
  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = (
    values: LeadFormData
  ) => {
    if (!services.length) {
      toast.error(
        "Please select at least one service."
      );

      return;
    }

    startTransition(async () => {
      try {
        await createLead({
          ...values,

          services: services.map(
            (service) => service._id
          ),
        });

        toast.success(
          "Enquiry submitted successfully."
        );

        reset();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong."
        );
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-16 rounded-3xl border bg-white p-8 shadow-sm"
    >
      <h2 className="mb-8 text-3xl font-bold">
        Tell us your Requirement
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <Input
          label="Full Name"
          {...register("fullName")}
          error={errors.fullName?.message}
        />

        <Input
          label="Email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Mobile"
          {...register("mobile")}
          error={errors.mobile?.message}
        />

        <Input
          label="Company"
          {...register("companyName")}
          error={errors.companyName?.message}
        />

      </div>

      <div className="mt-6">

        <Textarea
          label="Requirement"
          {...register("message")}
          error={errors.message?.message}
        />

      </div>

      <div className="mt-8">

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Submitting..."
            : "Submit Enquiry"}
        </Button>

      </div>
    </form>
  );
}