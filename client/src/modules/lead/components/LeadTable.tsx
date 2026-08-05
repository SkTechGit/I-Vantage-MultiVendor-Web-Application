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
      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Leads
          </h1>

          <p className="text-slate-500">
            Manage all customer enquiries.
          </p>

        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="h-12 w-full rounded-xl border pl-11"
            />

          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="h-12 rounded-xl border px-4"
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

        <div className="overflow-x-auto rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-5 py-4 text-left">
                  Name
                </th>

                <th className="px-5 py-4 text-left">
                  Mobile
                </th>

                <th className="px-5 py-4 text-left">
                  Services
                </th>

                <th className="px-5 py-4 text-left">
                  Status
                </th>

                <th className="px-5 py-4 text-left">
                  Date
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLeads.map((lead) => (

                <tr
                  key={lead._id}
                  className="border-t"
                >

                  <td className="px-5 py-4 font-semibold">
                    {lead.fullName}
                  </td>

                  <td className="px-5 py-4">
                    {lead.mobile}
                  </td>

                  <td className="px-5 py-4">
                    {lead.services
                      .map((item) => item.name)
                      .join(", ")}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        STATUS_COLOR[
                          lead.status as keyof typeof STATUS_COLOR
                        ]
                      }`}
                    >
                      {lead.status}
                    </span>

                  </td>

                  <td className="px-5 py-4">
                    {new Date(
                      lead.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end">

                      <button
                        onClick={() =>
                          setSelectedLead(
                            lead
                          )
                        }
                      >
                        <Eye
                          size={20}
                          className="text-[#1E5BFF]"
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

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