"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import {getCRMLead ,updateCRMLead} from "../crm.api";

import { CRMLead } from "../crm.types";
import { CRM_STATUS } from "../crm.constants";

interface Props {
  lead: CRMLead | null;
  onClose: () => void;
  refresh: () => void;
}

export default function CRMDrawer({
  lead,
  onClose,
  refresh,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [isPending, startTransition] =
    useTransition();

  const [crmLead, setCRMLead] =
    useState<CRMLead | null>(null);

  const [status, setStatus] =
    useState("");

  useEffect(() => {
    if (!lead) return;

    fetchCRMLead();
  }, [lead]);

  const fetchCRMLead = async () => {
    try {
      setLoading(true);

      const data = await getCRMLead(
        lead!._id
      );

      setCRMLead(data);

      setStatus(data.status);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    if (!crmLead) return;

    startTransition(async () => {
      try {
        await updateCRMLead(
          crmLead._id,
          {
            status,
          }
        );

        toast.success(
          "CRM updated successfully."
        );

        refresh();

        onClose();
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
      open={!!lead}
      onClose={onClose}
      title="CRM Details"
    >
      {loading || !crmLead ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-8">

          {/* Customer */}

          <div>

            <h3 className="mb-4 text-xl font-bold">
              Customer Details
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="font-semibold">
                  {crmLead.fullName}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Mobile
                </p>

                <p className="font-semibold">
                  {crmLead.mobile}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Email
                </p>

                <p className="font-semibold">
                  {crmLead.email}
                </p>

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Company
                </p>

                <p className="font-semibold">
                  {crmLead.companyName || "-"}
                </p>

              </div>

            </div>

          </div>

          {/* Services */}

          <div>

            <h3 className="mb-4 text-xl font-bold">
              Services
            </h3>

            <div className="flex flex-wrap gap-2">

              {crmLead.services.map(
                (service) => (
                  <span
                    key={service._id}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700"
                  >
                    {service.name}
                  </span>
                )
              )}

            </div>

          </div>

          {/* Message */}

          <div>

            <h3 className="mb-3 text-xl font-bold">
              Message
            </h3>

            <div className="rounded-xl bg-slate-50 p-4">
              {crmLead.message}
            </div>

          </div>

          {/* Notes */}

          <div>

            <h3 className="mb-3 text-xl font-bold">
              Notes
            </h3>

            <div className="space-y-3">

              {crmLead.notes.length === 0 && (
                <p className="text-slate-500">
                  No Notes
                </p>
              )}

              {crmLead.notes.map(
                (note, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4"
                  >
                    <p>{note.note}</p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(
                        note.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>
                )
              )}

            </div>

          </div>

          {/* Follow Ups */}

          <div>

            <h3 className="mb-3 text-xl font-bold">
              Follow Ups
            </h3>

            <div className="space-y-3">

              {crmLead.followUps.length ===
                0 && (
                <p className="text-slate-500">
                  No Follow Ups
                </p>
              )}

              {crmLead.followUps.map(
                (followUp, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4"
                  >
                    <p>
                      {followUp.remark}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      {new Date(
                        followUp.followUpDate
                      ).toLocaleDateString()}
                    </p>

                    <span
                      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${
                        followUp.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {followUp.completed
                        ? "Completed"
                        : "Pending"}
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

          {/* Status */}

          <div>

            <label className="mb-2 block font-medium">
              CRM Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="h-12 w-full rounded-xl border px-4"
            >
              {CRM_STATUS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          <Button
            onClick={handleUpdate}
            disabled={isPending}
            className="w-full"
          >
            {isPending
              ? "Updating..."
              : "Update CRM"}
          </Button>

        </div>
      )}
    </Modal>
  );
}