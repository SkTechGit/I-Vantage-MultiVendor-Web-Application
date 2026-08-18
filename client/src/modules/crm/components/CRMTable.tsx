"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import Loader from "@/components/common/Loader";

import { useCRM } from "@/hooks/useCRM";

import CRMDrawer from "./CRMDrawer";

import { CRMLead } from "../crm.types";
import { CRM_STATUS } from "../crm.constants";

export default function CRMTable() {
  const { crmLeads, loading, refresh } = useCRM();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedLead, setSelectedLead] =
    useState<CRMLead | null>(null);

  const filteredLeads = useMemo(() => {
    return crmLeads.filter((lead) => {
      const matchSearch =
        lead.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.mobile.includes(search);

      const matchStatus =
        !status || lead.status === status;

      return matchSearch && matchStatus;
    });
  }, [crmLeads, search, status]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-xl
          border
          border-slate-200
          bg-white
          shadow-sm
          sm:rounded-2xl
        "
      >
        {/* Header */}
        <div className="p-4 sm:p-5 lg:p-6">
          <h1
            className="
              text-xl
              font-bold
              text-[#0A1F66]
              sm:text-2xl
              lg:text-3xl
            "
          >
            CRM
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Qualified & Converted Customers
          </p>
        </div>

        {/* Search & Filter */}
        <div
          className="
            grid
            gap-3
            border-t
            border-slate-100
            px-4
            py-4
            sm:gap-4
            sm:px-5
            md:grid-cols-2
            lg:px-6
          "
        >
          {/* Search */}
          <div className="relative min-w-0">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
                sm:left-4
              "
            />

            <input
              type="text"
              placeholder="Search name or mobile..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                h-10
                w-full
                rounded-lg
                border
                border-slate-200
                bg-white
                pl-10
                pr-3
                text-sm
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-[#1E5BFF]
                focus:ring-2
                focus:ring-blue-100
                sm:h-12
                sm:rounded-xl
                sm:pl-11
              "
            />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="
              h-10
              w-full
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
              outline-none
              transition
              focus:border-[#1E5BFF]
              focus:ring-2
              focus:ring-blue-100
              sm:h-12
              sm:rounded-xl
              sm:px-4
            "
          >
            <option value="">
              All Status
            </option>

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

        {/* Mobile Scroll Hint */}
        <div
          className="
            border-y
            border-slate-100
            bg-slate-50
            px-4
            py-2
            text-[11px]
            text-slate-500
            sm:hidden
          "
        >
          ← Swipe horizontally to view all customer details →
        </div>

        {/* Responsive Table */}
        <div
          className="
            w-full
            max-w-full
            overflow-x-auto
            overscroll-x-contain
            [-webkit-overflow-scrolling:touch]
          "
        >
          <table className="w-full min-w-[750px] border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Customer
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Mobile
                </th>

                <th
                  className="
                    min-w-[260px]
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Services
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Status
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-right
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const serviceNames =
                    lead.services
                      .map((item) => item.name)
                      .join(", ");

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
                      {/* Customer */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          text-xs
                          font-semibold
                          text-slate-800
                          sm:px-5
                          sm:py-4
                          sm:text-sm
                        "
                      >
                        {lead.fullName}
                      </td>

                      {/* Mobile */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          text-xs
                          text-slate-600
                          sm:px-5
                          sm:py-4
                          sm:text-sm
                        "
                      >
                        {lead.mobile}
                      </td>

                      {/* Services */}
                      <td
                        className="
                          max-w-[300px]
                          px-4
                          py-3
                          sm:px-5
                          sm:py-4
                        "
                      >
                        <p
                          title={serviceNames}
                          className="
                            max-w-[280px]
                            truncate
                            whitespace-nowrap
                            text-xs
                            text-slate-600
                            sm:text-sm
                          "
                        >
                          {serviceNames || "-"}
                        </p>
                      </td>

                      {/* Status */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          sm:px-5
                          sm:py-4
                        "
                      >
                        <span
                          className="
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            bg-blue-100
                            px-2.5
                            py-1
                            text-[10px]
                            font-medium
                            text-blue-700
                            sm:px-3
                            sm:text-xs
                          "
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          sm:px-5
                          sm:py-4
                        "
                      >
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedLead(
                                lead
                              )
                            }
                            aria-label={`View ${lead.fullName}`}
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              text-[#1E5BFF]
                              transition
                              hover:bg-blue-50
                              active:scale-95
                              sm:h-9
                              sm:w-9
                            "
                          >
                            <Eye
                              size={18}
                              className="sm:h-5 sm:w-5"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="
                      px-6
                      py-12
                      text-center
                      text-xs
                      text-slate-500
                      sm:text-sm
                    "
                  >
                    No CRM customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Bottom Hint */}
        {filteredLeads.length > 0 && (
          <div
            className="
              border-t
              border-slate-100
              px-4
              py-2
              text-center
              text-[10px]
              text-slate-400
              sm:hidden
            "
          >
            Swipe left or right to view the complete table
          </div>
        )}
      </div>

      {/* CRM Details */}
      <CRMDrawer
        lead={selectedLead}
        onClose={() =>
          setSelectedLead(null)
        }
        refresh={refresh}
      />
    </>
  );
}