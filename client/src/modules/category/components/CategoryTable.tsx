"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import Button from "@/components/ui/Button";
import Loader from "@/components/common/Loader";

import { useCategory } from "@/hooks/useCategory";

import CategoryForm from "./CategoryForm";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import { Category } from "../category.types";

export default function CategoryTable() {
  const { categories, loading, refresh } = useCategory();

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [deleteCategory, setDeleteCategory] =
    useState<Category | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [categories, search]);

  if (loading) return <Loader />;

  return (
    <>
      <div className="rounded-2xl bg-white p-6 shadow">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Categories
            </h1>

            <p className="text-slate-500">
              Manage your business categories.
            </p>

          </div>

          <Button
            onClick={() => {
              setSelectedCategory(null);
              setOpenForm(true);
            }}
          >
            <Plus size={18} />

            Add Category
          </Button>

        </div>

        <div className="relative mb-8">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            placeholder="Search category..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="h-12 w-full rounded-xl border pl-11"
          />

        </div>

        <div className="overflow-hidden rounded-xl border">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-5 py-4 text-left">
                  Image
                </th>

                <th className="px-5 py-4 text-left">
                  Name
                </th>

                <th className="px-5 py-4 text-left">
                  Slug
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

              {filteredCategories.map((category) => (

                <tr
                  key={category._id}
                  className="border-t"
                >

                  <td className="px-5 py-4">

                    <Image
                      src={
    category.image?.url ||
    "/images/logo.png"
  }
                      alt={category.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />

                  </td>

                  <td className="px-5 py-4 font-semibold">
                    {category.name}
                  </td>

                  <td className="px-5 py-4">
                    {category.slug}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td className="px-5 py-4">
                    {category.sortOrder}
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-3">

                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenForm(true);
                        }}
                      >
                        <Pencil
                          className="text-blue-600"
                          size={20}
                        />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteCategory(category)
                        }
                      >
                        <Trash2
                          className="text-red-600"
                          size={20}
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

      <CategoryForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        category={selectedCategory}
        refresh={refresh}
      />

      <DeleteCategoryDialog
        category={deleteCategory}
        onClose={() =>
          setDeleteCategory(null)
        }
        refresh={refresh}
      />
    </>
  );
}