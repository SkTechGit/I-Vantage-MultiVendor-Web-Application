"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

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
      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Services
            </h1>

            <p className="text-slate-500">
              Manage business services.
            </p>

          </div>

          <Button
            onClick={() => {
              setSelectedService(null);
              setOpenForm(true);
            }}
          >
            <Plus size={18} />

            Add Service
          </Button>

        </div>

        <div className="relative mb-8">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search service..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 w-full rounded-xl border pl-11"
          />

        </div>

        <div className="overflow-x-auto rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-5 py-4 text-left">
                  Name
                </th>

                <th className="px-5 py-4 text-left">
                  Category
                </th>

                <th className="px-5 py-4 text-left">
                  Status
                </th>

                <th className="px-5 py-4 text-left">
                  Order
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredServices.map((service) => (

                <tr
                  key={service._id}
                  className="border-t"
                >

                  <td className="px-5 py-4 font-semibold">
                    {service.name}
                  </td>

                  <td className="px-5 py-4">
                    {service.category.name}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        service.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {service.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td className="px-5 py-4">
                    {service.sortOrder}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => {
                          setSelectedService(
                            service
                          );

                          setOpenForm(true);
                        }}
                      >
                        <Pencil
                          size={20}
                          className="text-blue-600"
                        />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteService(
                            service
                          )
                        }
                      >
                        <Trash2
                          size={20}
                          className="text-red-600"
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

      <ServiceForm
        open={openForm}
        onClose={() =>
          setOpenForm(false)
        }
        service={selectedService}
        refresh={refresh}
      />

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