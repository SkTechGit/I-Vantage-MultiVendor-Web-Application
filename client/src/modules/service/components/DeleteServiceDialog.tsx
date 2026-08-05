"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import { deleteService } from "../service.api";
import { Service } from "../service.types";

interface Props {
  service: Service | null;
  onClose: () => void;
  refresh: () => void;
}

export default function DeleteServiceDialog({
  service,
  onClose,
  refresh,
}: Props) {
  const [isPending, startTransition] =
    useTransition();

  const handleDelete = () => {
    if (!service) return;

    startTransition(async () => {
      try {
        await deleteService(service._id);

        toast.success(
          "Service deleted successfully."
        );

        refresh();

        onClose();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ??
            "Failed to delete service."
        );
      }
    });
  };

  return (
    <Modal
      open={!!service}
      onClose={onClose}
      title="Delete Service"
    >
      <div className="space-y-6">

        <p className="text-slate-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {service?.name}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
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