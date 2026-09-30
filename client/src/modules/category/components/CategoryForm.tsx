"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Modal from "@/components/ui/Modal";

import {
  categorySchema,
  CategoryFormData,
} from "../category.schema";

import {
  createCategory,
  updateCategory,
} from "../category.api";

import { Category } from "../category.types";

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  refresh: () => void;
}

export default function CategoryForm({
  open,
  onClose,
  category,
  refresh,
}: Props) {
  const [preview, setPreview] = useState("");

  const [file, setFile] = useState<File | null>(null);

  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
      setValue("description", category.description);
      setValue("sortOrder", category.sortOrder);
      setValue("isActive", category.isActive);

      const timer = setTimeout(() => {
        setPreview(category.image?.url || "");
      }, 0);
      return () => clearTimeout(timer);
    } else {
      reset();

      const timer = setTimeout(() => {
        setPreview("");
        setFile(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [category, reset, setValue]);

  const onSubmit = (
    values: CategoryFormData
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append(
          "name",
          values.name
        );

        formData.append(
          "description",
          values.description
        );

        formData.append(
          "sortOrder",
          values.sortOrder.toString()
        );

        formData.append(
          "isActive",
          String(values.isActive)
        );

        if (file) {
          formData.append("image", file);
        }

        if (category) {
          await updateCategory(
            category._id,
            formData
          );

          toast.success(
            "Category updated."
          );
        } else {
          await createCategory(formData);

          toast.success(
            "Category created."
          );
        }

        refresh();

        onClose();

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
    <Modal
      open={open}
      onClose={onClose}
      title={
        category
          ? "Edit Category"
          : "Add Category"
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div>

          <label className="mb-2 block font-medium">
            Category Image
          </label>

          {preview && (
            <img
              src={preview}
              className="mb-3 h-28 w-28 rounded-xl object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selected =
                e.target.files?.[0];

              if (!selected) return;

              setFile(selected);

              setPreview(
                URL.createObjectURL(
                  selected
                )
              );
            }}
          />

        </div>

        <Input
          label="Category Name"
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          label="Description"
          {...register("description")}
          error={
            errors.description?.message
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

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : category
            ? "Update Category"
            : "Create Category"}
        </Button>
      </form>
    </Modal>
  );
}