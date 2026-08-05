"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { useCategory } from "@/hooks/useCategory";

import {
  createService,
  updateService,
} from "../service.api";

import {
  serviceSchema,
  ServiceFormData,
} from "../service.schema";

import { Service } from "../service.types";

interface Props {
  open: boolean;
  onClose: () => void;
  service: Service | null;
  refresh: () => void;
}

export default function ServiceForm({
  open,
  onClose,
  service,
  refresh,
}: Props) {
  const { categories } = useCategory();

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      category: "",
      name: "",
      shortDescription: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (service) {
      setValue("category", service.category._id);
      setValue("name", service.name);
      setValue(
        "shortDescription",
        service.shortDescription
      );
      setValue("sortOrder", service.sortOrder);
      setValue("isActive", service.isActive);
    } else {
      reset();
    }
  }, [service, setValue, reset]);

  const onSubmit = (
    values: ServiceFormData
  ) => {
    startTransition(async () => {
      try {
        if (service) {
          await updateService(
            service._id,
            values
          );

          toast.success(
            "Service updated successfully."
          );
        } else {
          await createService(values);

          toast.success(
            "Service created successfully."
          );
        }

        refresh();

        onClose();

        reset();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ??
            "Something went wrong."
        );
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        service
          ? "Edit Service"
          : "Add Service"
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>

          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            {...register("category")}
            className="h-12 w-full rounded-xl border px-4"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}

        </div>

        <Input
          label="Service Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          label="Short Description"
          {...register(
            "shortDescription"
          )}
          error={
            errors.shortDescription?.message
          }
        />

        <Input
          type="number"
          label="Sort Order"
          {...register("sortOrder", {
            valueAsNumber: true,
          })}
          error={
            errors.sortOrder?.message
          }
        />

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            {...register("isActive")}
          />

          Active

        </label>

        <div className="sticky bottom-0 bg-white pt-4">

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending
              ? "Saving..."
              : service
              ? "Update Service"
              : "Create Service"}
          </Button>

        </div>

      </form>
    </Modal>
  );
}