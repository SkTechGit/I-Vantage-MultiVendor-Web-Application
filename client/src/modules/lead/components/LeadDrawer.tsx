"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import {
  getLeadById,
  updateLead,
} from "../lead.api";

import { Lead } from "../lead.types";

import {
  LEAD_STATUS,
} from "../lead.constants";

interface Props {
  lead: Lead | null;
  onClose: () => void;
  refresh: () => void;
}

export default function LeadDrawer({
  lead,
  onClose,
  refresh,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [isPending, startTransition] =
    useTransition();

  const [leadData, setLeadData] =
    useState<Lead | null>(null);

  const [status, setStatus] =
    useState("");

  useEffect(() => {
    if (!lead) return;

    fetchLead();
  }, [lead]);

  const fetchLead = async () => {
    try {
      setLoading(true);

      const data = await getLeadById(
        lead!._id
      );

      setLeadData(data);

      setStatus(data.status);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (!leadData) return;

    startTransition(async () => {
      try {
        await updateLead(
          leadData._id,
          {
            status,
          }
        );

        toast.success(
          "Lead updated successfully."
        );

        refresh();

        onClose();

      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ??
            "Failed to update lead."
        );
      }
    });
  };

  return (
    <Modal
      open={!!lead}
      onClose={onClose}
      title="Lead Details"
    >
      {loading || !leadData ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-8">

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Customer Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="font-semibold">
                  {leadData.fullName}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Mobile
                </p>

                <p className="font-semibold">
                  {leadData.mobile}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-semibold">
                  {leadData.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Company
                </p>

                <p className="font-semibold">
                  {leadData.companyName ||
                    "-"}

                </p>

              </div>

            </div>

          </div>

          <div>

            <h3 className="mb-3 text-xl font-semibold">
              Services
            </h3>

            <div className="flex flex-wrap gap-2">

              {leadData.services.map(
                (service) => (
                  <span
                    key={service._id}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm text-[#1E5BFF]"
                  >
                    {service.name}
                  </span>
                )
              )}

            </div>

          </div>

          <div>

            <h3 className="mb-3 text-xl font-semibold">
              Message
            </h3>

            <p className="rounded-xl bg-slate-50 p-4">
              {leadData.message}
            </p>

          </div>

          <div>

            <label className="mb-2 block font-medium">
              Lead Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-12 w-full rounded-xl border px-4"
            >
              {LEAD_STATUS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>

          <Button
            onClick={handleUpdate}
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? "Updating..."
              : "Update Lead"}
          </Button>

        </div>
      )}
    </Modal>
  );
}