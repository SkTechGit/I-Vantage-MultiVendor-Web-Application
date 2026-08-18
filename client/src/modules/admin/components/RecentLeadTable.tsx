"use client";

import { useState } from "react";

import { DashboardStats } from "../admin.types";

interface Props {
  leads: DashboardStats["recentLeads"];
}

export default function RecentLeadTable({
  leads,
}: Props) {
  const [expandedServices, setExpandedServices] =
    useState<Record<string, boolean>>({});

  const toggleServices = (leadId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [leadId]: !prev[leadId],
    }));
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <h2 className="text-xl font-bold text-[#0A1F66] sm:text-2xl">
          Recent Leads
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest customer enquiries.
        </p>
      </div>

      {/* Mobile scroll hint */}
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500 sm:hidden">
        ← Swipe horizontally to view all details →
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto overscroll-x-contain">
        <table className="min-w-[720px] w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Name
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Services
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Mobile
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => {
                const isExpanded =
                  expandedServices[lead._id];

                const serviceNames = lead.services.map(
                  (item) => item.name
                );

                const visibleServices = isExpanded
                  ? serviceNames
                  : serviceNames.slice(0, 2);

                const hasMoreServices =
                  serviceNames.length > 2;

                return (
                  <tr
                    key={lead._id}
                    className="
                      border-t
                      border-slate-100
                      transition-colors
                      hover:bg-slate-50
                    "
                  >
                    {/* Name */}
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                      {lead.fullName}
                    </td>

                    {/* Services */}
                    <td className="max-w-[420px] px-5 py-4">
                      <div
                        className={`
                          flex
                          items-center
                          gap-2
                          ${
                            isExpanded
                              ? "flex-wrap"
                              : "flex-nowrap"
                          }
                        `}
                      >
                        <p
                          className={`
                            text-sm
                            text-slate-600
                            ${
                              isExpanded
                                ? ""
                                : "max-w-[300px] truncate"
                            }
                          `}
                          title={
                            !isExpanded
                              ? serviceNames.join(", ")
                              : undefined
                          }
                        >
                          {visibleServices.join(", ")}

                          {!isExpanded &&
                            hasMoreServices &&
                            " ..."}
                        </p>

                        {hasMoreServices && (
                          <button
                            type="button"
                            onClick={() =>
                              toggleServices(
                                lead._id
                              )
                            }
                            className="
                              shrink-0
                              whitespace-nowrap
                              text-xs
                              font-semibold
                              text-[#1E5BFF]
                              transition
                              hover:underline
                            "
                          >
                            {isExpanded
                              ? "See less"
                              : "See more"}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Mobile */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {lead.mobile}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="
                          inline-flex
                          whitespace-nowrap
                          rounded-full
                          bg-blue-100
                          px-3
                          py-1
                          text-xs
                          font-medium
                          text-[#1E5BFF]
                          sm:text-sm
                        "
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  No recent leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}