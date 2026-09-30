"use client";

import {
  useEffect,
  useState,
  useTransition,
  useCallback,
} from "react";

import { toast } from "sonner";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

import {
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  addFollowUp,
  completeFollowUp,
   deleteLead,
} from "../lead.api";

import {
  Lead,
} from "../lead.types";

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

  const [note, setNote] =
    useState("");

  const [followUpDate, setFollowUpDate] =
    useState("");

  const [followUpRemark, setFollowUpRemark] =
    useState("");

    const [showDeleteConfirm, setShowDeleteConfirm] =
  useState(false);
  /*
  |--------------------------------------------------------------------------
  | Fetch Lead
  |--------------------------------------------------------------------------
  */

  const fetchLead = useCallback(async (silent = false) => {
    if (!lead) return;

    try {
      if (!silent) setLoading(true);

      const data = await getLeadById(lead._id);

      setLeadData(data);
      setStatus(data.status);
    } catch (error) {
      console.error("FETCH LEAD ERROR:", error);
      toast.error("Failed to load lead.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [lead]);

  useEffect(() => {
    if (!lead) return;

    let active = true;
    getLeadById(lead._id)
      .then((data) => {
        if (active) {
          setLeadData(data);
          setStatus(data.status);
        }
      })
      .catch((error) => {
        console.error("FETCH LEAD ERROR:", error);
        toast.error("Failed to load lead.");
      });

    return () => {
      active = false;
    };
  }, [lead]);

  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  const handleUpdateStatus = () => {
    if (!leadData) return;

    if (status === leadData.status) {
      return;
    }

    startTransition(async () => {
      try {
        await updateLeadStatus(
          leadData._id,
          status
        );

        toast.success(
          "Lead status updated successfully."
        );

        await fetchLead();

        refresh();
      } catch (error: any) {
        console.error(
          "UPDATE STATUS ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to update status."
        );
      }
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Add Note
  |--------------------------------------------------------------------------
  */

  const handleAddNote = () => {
    if (!leadData) return;

    const trimmedNote =
      note.trim();

    if (!trimmedNote) {
      toast.error(
        "Please enter a note."
      );

      return;
    }

    startTransition(async () => {
      try {
        await addLeadNote(
          leadData._id,
          trimmedNote
        );

        setNote("");

        toast.success(
          "Note added successfully."
        );

        await fetchLead();

        refresh();
      } catch (error: any) {
        console.error(
          "ADD NOTE ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to add note."
        );
      }
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Add Follow Up
  |--------------------------------------------------------------------------
  */

  const handleAddFollowUp = () => {
    if (!leadData) return;

    if (!followUpDate) {
      toast.error(
        "Please select a follow-up date."
      );

      return;
    }

    const trimmedRemark =
      followUpRemark.trim();

    if (!trimmedRemark) {
      toast.error(
        "Please enter a follow-up remark."
      );

      return;
    }

    startTransition(async () => {
      try {
        await addFollowUp(
          leadData._id,
          followUpDate,
          trimmedRemark
        );

        setFollowUpDate("");
        setFollowUpRemark("");

        toast.success(
          "Follow-up added successfully."
        );

        await fetchLead();

        refresh();
      } catch (error: any) {
        console.error(
          "ADD FOLLOW UP ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to add follow-up."
        );
      }
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Complete Follow Up
  |--------------------------------------------------------------------------
  */

  const handleCompleteFollowUp = (
    followUpId?: string
  ) => {
    if (!leadData || !followUpId) {
      return;
    }

    startTransition(async () => {
      try {
        await completeFollowUp(
          leadData._id,
          followUpId
        );

        toast.success(
          "Follow-up completed."
        );

        await fetchLead();

        refresh();
      } catch (error: any) {
        console.error(
          "COMPLETE FOLLOW UP ERROR:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to complete follow-up."
        );
      }
    });
  };

  // Delete Lead

  const handleDeleteLead = () => {
  setShowDeleteConfirm(true);
};

const confirmDeleteLead = () => {
  if (!leadData) return;

  startTransition(async () => {
    try {
      await deleteLead(leadData._id);

      toast.success(
        "Lead deleted successfully."
      );

      setShowDeleteConfirm(false);

      refresh();
      onClose();
    } catch (error: any) {
      console.error(
        "DELETE LEAD ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete lead."
      );
    }
  });
};

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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

          {/* ------------------------------------------------
              Customer Details
          ------------------------------------------------ */}

          <div>
  <h3 className="mb-4 text-xl font-semibold">
    Customer Details
  </h3>

  <div className="grid gap-4 md:grid-cols-2">

    {/* Name */}
    <div>
      <p className="text-sm text-slate-500">
        Name
      </p>

      <p className="font-semibold">
        {leadData.fullName}
      </p>
    </div>

    {/* Mobile */}
    <div>
      <p className="text-sm text-slate-500">
        Mobile
      </p>

      <p className="font-semibold">
        {leadData.mobile}
      </p>
    </div>

    {/* Email */}
    <div>
      <p className="text-sm text-slate-500">
        Email
      </p>

      <p className="font-semibold break-words">
        {leadData.email}
      </p>
    </div>

    {/* Company */}
    <div>
      <p className="text-sm text-slate-500">
        Company
      </p>

      <p className="font-semibold">
        {leadData.companyName || "-"}
      </p>
    </div>

    {/* Company Website */}
    <div>
      <p className="text-sm text-slate-500">
        Company Website
      </p>

      {leadData.companyWebsite ? (
        <a
          href={leadData.companyWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold break-all text-[#1E5BFF] hover:underline"
        >
          {leadData.companyWebsite}
        </a>
      ) : (
        <p className="font-semibold">-</p>
      )}
    </div>

    {/* Role */}
    <div>
      <p className="text-sm text-slate-500">
        Your Role
      </p>

      <p className="font-semibold">
        {leadData.role || "-"}
      </p>
    </div>

    {/* Industry */}
    <div>
      <p className="text-sm text-slate-500">
        Business / Industry
      </p>

      <p className="font-semibold">
        {leadData.industry || "-"}
      </p>
    </div>

    {/* Business Size */}
    <div>
      <p className="text-sm text-slate-500">
        Business Size
      </p>

      <p className="font-semibold">
        {leadData.businessSize || "-"}
      </p>
    </div>

    {/* Location */}
    <div>
      <p className="text-sm text-slate-500">
        Business Location
      </p>

      <p className="font-semibold">
        {leadData.location || "-"}
      </p>
    </div>

    {/* How did you hear */}
    <div>
      <p className="text-sm text-slate-500">
        How did you hear about i-VANTAGE?
      </p>

      <p className="font-semibold">
        {leadData.hearAboutUs || "-"}
      </p>
    </div>

    {/* Source */}
    <div>
      <p className="text-sm text-slate-500">
        Source
      </p>

      <p className="font-semibold">
        {leadData.source || "-"}
      </p>
    </div>

  </div>
</div>

          {/* ------------------------------------------------
              Services
          ------------------------------------------------ */}

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

          {/* ------------------------------------------------
              Message
          ------------------------------------------------ */}

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Message
            </h3>

            <p className="rounded-xl bg-slate-50 p-4">
              {leadData.message ||
                "-"}
            </p>
          </div>

          {/* ------------------------------------------------
              Status
          ------------------------------------------------ */}

          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Lead Status
            </h3>

            <div className="flex gap-3">

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                disabled={isPending}
                className="h-12 flex-1 rounded-xl border px-4 outline-none focus:border-[#1E5BFF]"
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

              <Button
                onClick={
                  handleUpdateStatus
                }
                disabled={
                  isPending ||
                  status ===
                    leadData.status
                }
              >
                {isPending
                  ? "Updating..."
                  : "Update"}
              </Button>

            </div>
          </div>

          {/* ------------------------------------------------
              Notes
          ------------------------------------------------ */}

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Notes
            </h3>

            <div className="space-y-4">

              <textarea
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                placeholder="Write a note..."
                rows={3}
                disabled={isPending}
                className="w-full resize-none rounded-xl border p-4 outline-none focus:border-[#1E5BFF]"
              />

              <Button
                onClick={handleAddNote}
                disabled={
                  isPending ||
                  !note.trim()
                }
                className="w-full"
              >
                Add Note
              </Button>

            </div>

            {/* Existing Notes */}

            <div className="mt-6 space-y-3">

              {leadData.notes.length ===
                0 ? (
                <p className="text-sm text-slate-500">
                  No notes added yet.
                </p>
              ) : (
                leadData.notes
                  .slice()
                  .reverse()
                  .map(
                    (item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border bg-slate-50 p-4"
                      >

                        <p className="text-sm">
                          {item.note}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(
                            item.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>
                    )
                  )
              )}

            </div>
          </div>

          {/* ------------------------------------------------
              Follow Ups
          ------------------------------------------------ */}

          <div>
            <h3 className="mb-4 text-xl font-semibold">
              Follow Ups
            </h3>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  value={
                    followUpDate
                  }
                  onChange={(e) =>
                    setFollowUpDate(
                      e.target.value
                    )
                  }
                  disabled={isPending}
                  className="h-12 w-full rounded-xl border px-4 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Remark
                </label>

                <textarea
                  value={
                    followUpRemark
                  }
                  onChange={(e) =>
                    setFollowUpRemark(
                      e.target.value
                    )
                  }
                  placeholder="What should you follow up about?"
                  rows={3}
                  disabled={isPending}
                  className="w-full resize-none rounded-xl border p-4 outline-none focus:border-[#1E5BFF]"
                />
              </div>

              <Button
                onClick={
                  handleAddFollowUp
                }
                disabled={
                  isPending ||
                  !followUpDate ||
                  !followUpRemark.trim()
                }
                className="w-full"
              >
                Add Follow-up
              </Button>

            </div>

            {/* Existing Follow Ups */}

            <div className="mt-6 space-y-3">

              {leadData.followUps
                .length === 0 ? (
                <p className="text-sm text-slate-500">
                  No follow-ups scheduled.
                </p>
              ) : (
                leadData.followUps
                  .slice()
                  .reverse()
                  .map(
                    (item) => (
                      <div
                        key={item._id}
                        className="rounded-xl border p-4"
                      >

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <p className="font-medium">
                              {item.remark}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {new Date(
                                item.followUpDate
                              ).toLocaleDateString()}
                            </p>

                          </div>

                          {item.completed ? (
                            <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Completed
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={
                                isPending
                              }
                              onClick={() =>
                                handleCompleteFollowUp(
                                  item._id
                                )
                              }
                              className="w-fit rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                            >
                              Mark Complete
                            </button>
                          )}

                        </div>

                        {item.completed &&
                          item.completedAt && (
                            <p className="mt-2 text-xs text-slate-400">
                              Completed on{" "}
                              {new Date(
                                item.completedAt
                              ).toLocaleString()}
                            </p>
                          )}

                      </div>
                    )
                  )
              )}

            </div>
          </div>
{/* ------------------------------------------------
    Delete Lead
------------------------------------------------ */}

<div className="border-t pt-6">

  <button
    type="button"
    onClick={handleDeleteLead}
    disabled={isPending}
    className="w-full rounded-xl border cursor-pointer border-red-200 bg-red-50 px-4 py-3 font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {isPending
      ? "Deleting..."
      : "Delete Lead"}
  </button>
<Modal
  open={showDeleteConfirm}
  onClose={() =>
    setShowDeleteConfirm(false)
  }
  title="Delete Lead"
>
  <div className="space-y-6">

    <div>
      <p className="text-slate-600">
        Are you sure you want to delete this lead?
      </p>

      <p className="mt-2 font-semibold text-slate-900">
        {leadData?.fullName}
      </p>

      <p className="mt-1 text-sm text-red-500">
        This action cannot be undone.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

      <button
        type="button"
        onClick={() =>
          setShowDeleteConfirm(false)
        }
        disabled={isPending}
        className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={confirmDeleteLead}
        disabled={isPending}
        className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {isPending
          ? "Deleting..."
          : "Yes, Delete Lead"}
      </button>

    </div>

  </div>
</Modal>
</div>
        </div>
      )}
    </Modal>
    
  );
}