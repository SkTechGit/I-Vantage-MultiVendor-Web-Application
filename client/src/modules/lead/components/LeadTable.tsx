"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import Loader from "@/components/common/Loader";
import { useLead } from "@/hooks/useLead";

import {
  LEAD_STATUS,
  STATUS_COLOR,
} from "../lead.constants";

import LeadDrawer from "./LeadDrawer";
import { Lead } from "../lead.types";

export default function LeadTable() {
  const { leads, loading, refresh } = useLead();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        lead.mobile.includes(search);

      const matchesStatus =
        !status || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, status]);

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
          bg-white
          shadow-sm
          sm:rounded-2xl
        "
      >
        {/* ================= HEADER ================= */}
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
            Leads
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage all customer enquiries.
          </p>
        </div>

        {/* ================= FILTERS ================= */}
        <div
          className="
            grid
            grid-cols-1
            gap-3
            border-t
            border-slate-100
            px-4
            py-4
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
              type="search"
              placeholder="Search by name or mobile..."
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
                sm:h-11
                sm:rounded-xl
                sm:pl-11
              "
            />
          </div>

          {/* Status Filter */}
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
              sm:h-11
              sm:rounded-xl
              sm:px-4
            "
          >
            <option value="">
              All Status
            </option>

            {LEAD_STATUS.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* ================= MOBILE SCROLL MESSAGE ================= */}
        <div
          className="
            border-t
            border-slate-100
            bg-slate-50
            px-4
            py-2
            text-xs
            text-slate-500
            md:hidden
          "
        >
          ← Swipe horizontally to view all lead details →
        </div>

        {/* ================= TABLE SCROLL CONTAINER ================= */}
        <div
          className="
            w-full
            overflow-x-auto
            overscroll-x-contain
            border-t
            border-slate-200
            [-webkit-overflow-scrolling:touch]
          "
        >
          <table
            className="
              w-full
              min-w-[900px]
              border-collapse
              text-sm
            "
          >
            {/* ================= TABLE HEAD ================= */}
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
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
                  "
                >
                  Name
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
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
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
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
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
                  "
                >
                  Status
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-left
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
                  "
                >
                  Date
                </th>

                <th
                  className="
                    whitespace-nowrap
                    px-4
                    py-3
                    text-right
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-600
                    sm:px-5
                    sm:py-4
                  "
                >
                  Action
                </th>
              </tr>
            </thead>

            {/* ================= TABLE BODY ================= */}
            <tbody className="bg-white">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const services = lead.services
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
                      {/* Name */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          text-sm
                          font-semibold
                          text-slate-800
                          sm:px-5
                          sm:py-4
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
                          text-sm
                          text-slate-600
                          sm:px-5
                          sm:py-4
                        "
                      >
                        {lead.mobile}
                      </td>

                      {/* Services */}
                      <td
                        className="
                          max-w-[320px]
                          px-4
                          py-3
                          sm:px-5
                          sm:py-4
                        "
                      >
                        <p
                          title={services}
                          className="
                            max-w-[300px]
                            truncate
                            whitespace-nowrap
                            text-sm
                            text-slate-600
                          "
                        >
                          {services || "-"}
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
                          className={`
                            inline-flex
                            whitespace-nowrap
                            rounded-full
                            px-2.5
                            py-1
                            text-[11px]
                            font-medium
                            sm:px-3
                            sm:text-xs
                            ${
                              STATUS_COLOR[
                                lead.status as keyof typeof STATUS_COLOR
                              ] ?? "bg-slate-100 text-slate-700"
                            }
                          `}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {/* Date */}
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
                        {new Date(
                          lead.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td
                        className="
                          whitespace-nowrap
                          px-4
                          py-3
                          text-right
                          sm:px-5
                          sm:py-4
                        "
                      >
                        <button
                          type="button"
                          aria-label={`View ${lead.fullName}`}
                          onClick={() =>
                            setSelectedLead(lead)
                          }
                          className="
                            inline-flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-[#1E5BFF]
                            transition
                            hover:bg-blue-50
                            active:scale-95
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-200
                          "
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty State */
                <tr>
                  <td
                    colSpan={6}
                    className="
                      px-4
                      py-12
                      text-center
                      text-sm
                      text-slate-500
                    "
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= RESULT COUNT ================= */}
        <div
          className="
            border-t
            border-slate-100
            px-4
            py-3
            text-xs
            text-slate-500
            sm:px-5
            lg:px-6
          "
        >
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredLeads.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-700">
            {leads.length}
          </span>{" "}
          leads
        </div>
      </div>

      {/* ================= LEAD DRAWER ================= */}
      <LeadDrawer
        lead={selectedLead}
        onClose={() =>
          setSelectedLead(null)
        }
        refresh={refresh}
      />
    </>
  );
}