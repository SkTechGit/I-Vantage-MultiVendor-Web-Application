"use client";

import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

import Loader from "@/components/common/Loader";

import { useCRM } from "@/hooks/useCRM";

import CRMDrawer from "./CRMDrawer";

import { CRMLead } from "../crm.types";
import { CRM_STATUS } from "../crm.constants";

export default function CRMTable() {
  const { crmLeads, loading, refresh } =
    useCRM();

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
      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            CRM
          </h1>

          <p className="text-slate-500">
            Qualified & Converted Customers
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

        <div className="overflow-x-auto rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-5 py-4 text-left">
                  Customer
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
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {lead.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end">

                      <button
                        onClick={() =>
                          setSelectedLead(lead)
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