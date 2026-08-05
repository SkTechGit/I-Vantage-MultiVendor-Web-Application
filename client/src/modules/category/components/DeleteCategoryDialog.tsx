"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { deleteCategory } from "../category.api";
import { Category } from "../category.types";

interface Props {
  category: Category | null;
  onClose: () => void;
  refresh: () => void;
}

export default function DeleteCategoryDialog({
  category,
  onClose,
  refresh,
}: Props) {
  const [isPending, startTransition] =
    useTransition();

  const handleDelete = () => {
    if (!category) return;

    startTransition(async () => {
      try {
        await deleteCategory(category._id);

        toast.success(
          "Category deleted successfully."
        );

        refresh();

        onClose();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ??
            "Failed to delete category."
        );
      }
    });
  };

  return (
    <Modal
      open={!!category}
      onClose={onClose}
      title="Delete Category"
    >
      <div className="space-y-6">

        <p className="text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {category?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">

          <Button
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending
              ? "Deleting..."
              : "Delete"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}