"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Service } from "@/modules/service/service.types";
import LeadForm from "./LeadForm";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";

import { Category } from "@/modules/category/category.types";

interface Props {
  categories: Category[];
  services: Service[];
}

export default function ServicesSection({
  categories,
  services,
}: Props) {
  const [search, setSearch] = useState("");

const [selectedServices, setSelectedServices] = useState<Service[]>([]);
const [openCategories, setOpenCategories] = useState<string[]>([]);
const groupedCategories = useMemo(() => {
  return categories.map((category) => ({
    ...category,
    services: services.filter(
      (service) => service.category._id === category._id
    ),
  }));
}, [categories, services]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return groupedCategories;

return groupedCategories
      .map((category) => ({
        ...category,
        services: category.services.filter((service) =>
          service.name
            .toLowerCase()
            .includes(search.toLowerCase())
        ),
      }))
      .filter((category) => category.services.length > 0);
  }, [search, categories]);

  useEffect(() => {
  if (search.trim()) {
    setOpenCategories(
      filteredCategories.map((category) => category._id)
    );
  } else {
    setOpenCategories([]);
  }
}, [search, filteredCategories]);

  const handleSelectService = (service: Service) => {
  const exists = selectedServices.some(
    (item) => item._id === service._id
  );

  if (exists) {
    setSelectedServices((prev) =>
      prev.filter((item) => item._id !== service._id)
    );
  } else {
    setSelectedServices((prev) => [...prev, service]);
  }
};

const isSelected = (id: string) => {
  return selectedServices.some(
    (item) => item._id === id
  );
};

const toggleCategory = (categoryId: string) => {
  setOpenCategories((prev) =>
    prev.includes(categoryId)
      ? prev.filter((id) => id !== categoryId)
      : [...prev, categoryId]
  );
};

  return (
    <section className="py-24 bg-gray-50">

      <Container>

        <SectionHeading
          title="Business Support Services"
          subtitle="Search and select one or more services you need."
        />

        {/* Search */}

        <div className="relative mx-auto mb-12 max-w-2xl">

          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search services..."
            className="h-14 w-full rounded-xl border border-gray-300 bg-white pl-14 pr-5 outline-none transition-all focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
          />

        </div>
{
  selectedServices.length > 0 && (
    <div className="mb-10">

      <h3 className="mb-4 text-xl font-bold">
        Selected Services
      </h3>

      <div className="flex flex-wrap gap-3">

        {selectedServices.map((service) => (
          <button
            key={service._id}
            onClick={() => handleSelectService(service)}
            className="rounded-full bg-[#1E5BFF] px-5 py-2 text-white"
          >
            {service.name} ✕
          </button>
        ))}

      </div>

    </div>
  )
}
        {/* Categories */}

        <div className="grid gap-8 lg:grid-cols-2">

          {filteredCategories.map((category) => (

            <div
  key={category._id}
  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
>

             <button
  type="button"
  onClick={() => toggleCategory(category._id)}
  className="flex w-full items-center justify-between p-6 text-left"
>
  <div>
    <h3 className="text-2xl font-bold text-[#0A1F66]">
      {category.name}
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      {category.description}
    </p>

    <span className="mt-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-[#1E5BFF]">
      {category.services.length} Services
    </span>
  </div>

  {openCategories.includes(category._id) ? (
    <ChevronUp className="text-[#1E5BFF]" size={24} />
  ) : (
    <ChevronDown className="text-[#1E5BFF]" size={24} />
  )}
</button>

              {openCategories.includes(category._id) && (<div className="space-y-4 border-t border-slate-200 p-6">

                {category.services.map((service) => (

                  <label
                    key={service._id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-blue-50"
                  >

                   <input
                        type="checkbox"
                        checked={isSelected(service._id)}
                        onChange={() =>
                          handleSelectService(service)
                        }
                      />

                    <div>

                      <h4 className="font-semibold">
                        {service.name}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {service.shortDescription}
                      </p>

                    </div>

                  </label>

                ))}

              </div>)}

            </div>

          ))}

        </div>
<LeadForm
  services={selectedServices}
  onRemoveService={(serviceId) => {
    setSelectedServices((prev) =>
      prev.filter(
        (service) => service._id !== serviceId
      )
    );
  }}
  onSuccess={() => {
    setSelectedServices([]);
  }}
/>
      </Container>

    </section>
  );
}