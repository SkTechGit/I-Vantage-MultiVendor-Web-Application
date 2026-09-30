import React from "react";
import Button from "@/components/ui/Button";
import { Invitation } from "./team.types";

export interface InvitationsHistoryTableProps {
  invitations: Invitation[];
  onRevoke: (id: string) => void;
}

export default function InvitationsHistoryTable({
  invitations,
  onRevoke,
}: InvitationsHistoryTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-[#0A1F66]">
          Invitation History & Token Status
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Audit log of issued administrative invitation tokens.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 min-w-[200px]">Invited Email</th>
              <th className="px-6 py-3.5 min-w-[120px]">Role</th>
              <th className="px-6 py-3.5 min-w-[120px]">Status</th>
              <th className="px-6 py-3.5 min-w-[120px]">Issued At</th>
              <th className="px-6 py-3.5 min-w-[120px]">Expires At</th>
              <th className="px-6 py-3.5 text-center w-28 min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invitations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No invitations issued yet.
                </td>
              </tr>
            ) : (
              invitations.map((inv) => {
                const isExpired =
                  inv.status === "pending" &&
                  new Date() > new Date(inv.expiresAt);

                return (
                  <tr key={inv._id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {inv.email}
                    </td>

                    <td className="px-6 py-4 text-xs capitalize font-medium text-slate-700">
                      {inv.role}
                    </td>

                    <td className="px-6 py-4">
                      {inv.status === "accepted" ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                          Accepted
                        </span>
                      ) : inv.status === "revoked" ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                          Revoked
                        </span>
                      ) : isExpired ? (
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                          Expired
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                          Active / Pending
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(inv.expiresAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-center w-28 min-w-[100px]">
                      {inv.status === "pending" && !isExpired ? (
                        <div className="flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRevoke(inv._id)}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Revoke
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
