"use client";

import { useMemo, useState } from "react";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import Loader from "@/components/common/Loader";
import Button from "@/components/ui/Button";

import { useService } from "@/hooks/useService";

import { Service } from "../service.types";

import ServiceForm from "./ServiceForm";
import DeleteServiceDialog from "./DeleteServiceDialog";

export default function ServiceTable() {
  const { services, loading, refresh } =
    useService();

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] =
    useState(false);

  const [selectedService, setSelectedService] =
    useState<Service | null>(null);

  const [deleteService, setDeleteService] =
    useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [services, search]);

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
        <div
          className="
            flex
            flex-col
            gap-4
            p-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:p-5
            lg:p-6
          "
        >
          <div className="min-w-0">
            <h1
              className="
                text-xl
                font-bold
                text-[#0A1F66]
                sm:text-2xl
                lg:text-3xl
              "
            >
              Services
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage business services.
            </p>
          </div>

          {/* Add Service */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={() => {
                setSelectedService(null);
                setOpenForm(true);
              }}
              className="
                flex
                h-10
                w-full
                items-center
                justify-center
                gap-2
                text-sm
                sm:h-11
                sm:w-auto
              "
            >
              <Plus size={17} />

              <span>Add Service</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="border-t border-slate-100 px-4 py-4 sm:px-5 lg:px-6">
          <div className="relative">
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
              placeholder="Search service..."
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
          ← Swipe horizontally to view all service details →
        </div>

        {/* Table */}
        <div
          className="
            w-full
            max-w-full
            overflow-x-auto
            overscroll-x-contain
            [-webkit-overflow-scrolling:touch]
          "
        >
          <table className="w-full min-w-[700px] border-collapse">
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
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Category
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
                    text-left
                    text-xs
                    font-semibold
                    text-slate-700
                    sm:px-5
                    sm:py-4
                    sm:text-sm
                  "
                >
                  Order
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
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr
                    key={service._id}
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
                        max-w-[250px]
                        px-4
                        py-3
                        sm:px-5
                        sm:py-4
                      "
                    >
                      <p
                        title={service.name}
                        className="
                          max-w-[220px]
                          truncate
                          whitespace-nowrap
                          text-xs
                          font-semibold
                          text-slate-800
                          sm:text-sm
                        "
                      >
                        {service.name}
                      </p>
                    </td>

                    {/* Category */}
                    <td
                      className="
                        max-w-[220px]
                        px-4
                        py-3
                        sm:px-5
                        sm:py-4
                      "
                    >
                      <p
                        title={service.category.name}
                        className="
                          max-w-[200px]
                          truncate
                          whitespace-nowrap
                          text-xs
                          text-slate-600
                          sm:text-sm
                        "
                      >
                        {service.category.name}
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
                          rounded-full
                          px-2.5
                          py-1
                          text-[10px]
                          font-medium
                          sm:px-3
                          sm:text-xs
                          ${
                            service.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                      >
                        {service.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Order */}
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
                      {service.sortOrder}
                    </td>

                    {/* Actions */}
                    <td
                      className="
                        whitespace-nowrap
                        px-4
                        py-3
                        sm:px-5
                        sm:py-4
                      "
                    >
                      <div className="flex justify-end gap-2 sm:gap-3">
                        {/* Edit */}
                        <button
                          type="button"
                          aria-label={`Edit ${service.name}`}
                          onClick={() => {
                            setSelectedService(
                              service
                            );

                            setOpenForm(true);
                          }}
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-blue-600
                            transition
                            hover:bg-blue-50
                            active:scale-95
                            sm:h-10
                            sm:w-10
                          "
                        >
                          <Pencil
                            size={17}
                            className="sm:h-5 sm:w-5"
                          />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          aria-label={`Delete ${service.name}`}
                          onClick={() =>
                            setDeleteService(
                              service
                            )
                          }
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-red-600
                            transition
                            hover:bg-red-50
                            active:scale-95
                            sm:h-10
                            sm:w-10
                          "
                        >
                          <Trash2
                            size={17}
                            className="sm:h-5 sm:w-5"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
                    {search
                      ? "No services found matching your search."
                      : "No services available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Bottom Hint */}
        {filteredServices.length > 0 && (
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

      {/* Service Form */}
      <ServiceForm
        open={openForm}
        onClose={() =>
          setOpenForm(false)
        }
        service={selectedService}
        refresh={refresh}
      />

      {/* Delete Confirmation */}
      <DeleteServiceDialog
        service={deleteService}
        onClose={() =>
          setDeleteService(null)
        }
        refresh={refresh}
      />
    </>
  );
}