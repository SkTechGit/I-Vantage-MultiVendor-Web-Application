import React from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { AccessRequest } from "./team.types";

export interface AccessRequestsTableProps {
  requests: AccessRequest[];
  selectedRoles: { [key: string]: string };
  onRoleSelectChange: (id: string, role: string) => void;
  approvingId: string | null;
  rejectingId: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function AccessRequestsTable({
  requests,
  selectedRoles,
  onRoleSelectChange,
  approvingId,
  rejectingId,
  onApprove,
  onReject,
}: AccessRequestsTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-[#0A1F66]">
          Pending Administrator Access Requests
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Users who registered via public access request and require
          administrative authorization before login is enabled.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 min-w-[200px]">Applicant</th>
              <th className="px-6 py-3.5 min-w-[160px]">Requested Date</th>
              <th className="px-6 py-3.5 min-w-[150px]">Assign Role</th>
              <th className="px-6 py-3.5 text-center min-w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                  <CheckCircle2
                    size={32}
                    className="mx-auto mb-2 text-emerald-500"
                  />
                  No pending requests. All access applications have been reviewed.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50/70">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {req.fullName}
                    </div>
                    <div className="text-xs text-slate-400">{req.email}</div>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={selectedRoles[req._id] || "vendor"}
                      onChange={(e) => onRoleSelectChange(req._id, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#1E5BFF]"
                    >
                      <option value="vendor">Vendor (Partner)</option>
                      <option value="user">User</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-center min-w-[180px]">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        loading={approvingId === req._id}
                        disabled={
                          approvingId === req._id || rejectingId === req._id
                        }
                        onClick={() => onApprove(req._id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        loading={rejectingId === req._id}
                        disabled={
                          approvingId === req._id || rejectingId === req._id
                        }
                        onClick={() => onReject(req._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
