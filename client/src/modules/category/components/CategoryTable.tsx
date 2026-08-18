"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Loader from "@/components/common/Loader";

import { useCategory } from "@/hooks/useCategory";

import CategoryForm from "./CategoryForm";
import DeleteCategoryDialog from "./DeleteCategoryDialog";

import { Category } from "../category.types";

export default function CategoryTable() {
  const { categories, loading, refresh } =
    useCategory();

  const [search, setSearch] = useState("");

  const [openForm, setOpenForm] =
    useState(false);

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
              Categories
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage your business categories.
            </p>
          </div>

          {/* Add Category */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={() => {
                setSelectedCategory(null);
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

              <span>Add Category</span>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div
          className="
            border-t
            border-slate-100
            px-4
            py-4
            sm:px-5
            lg:px-6
          "
        >
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
              placeholder="Search category..."
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
          ← Swipe horizontally to view all category details →
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
          <table className="w-full min-w-[780px] border-collapse">
            <thead className="bg-slate-100">
              <tr>
                {/* Image */}
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
                  Image
                </th>

                {/* Name */}
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

                {/* Slug */}
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
                  Slug
                </th>

                {/* Status */}
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

                {/* Order */}
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

                {/* Actions */}
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
              {filteredCategories.length > 0 ? (
                filteredCategories.map(
                  (category) => (
                    <tr
                      key={category._id}
                      className="
                        border-t
                        border-slate-100
                        transition-colors
                        hover:bg-slate-50
                      "
                    >
                      {/* Image */}
                      <td className="px-4 py-3 sm:px-5 sm:py-4">
                        <Image
                          src={
                            category.image?.url ||
                            "/images/logo.png"
                          }
                          alt={category.name}
                          width={50}
                          height={50}
                          className="
                            h-10
                            w-10
                            rounded-lg
                            object-cover
                            sm:h-[50px]
                            sm:w-[50px]
                          "
                        />
                      </td>

                      {/* Name */}
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
                          title={category.name}
                          className="
                            max-w-[200px]
                            truncate
                            whitespace-nowrap
                            text-xs
                            font-semibold
                            text-slate-800
                            sm:text-sm
                          "
                        >
                          {category.name}
                        </p>
                      </td>

                      {/* Slug */}
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
                          title={category.slug}
                          className="
                            max-w-[200px]
                            truncate
                            whitespace-nowrap
                            text-xs
                            text-slate-600
                            sm:text-sm
                          "
                        >
                          {category.slug}
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
                              category.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                        >
                          {category.isActive
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
                        {category.sortOrder}
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
                            aria-label={`Edit ${category.name}`}
                            onClick={() => {
                              setSelectedCategory(
                                category
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
                            aria-label={`Delete ${category.name}`}
                            onClick={() =>
                              setDeleteCategory(
                                category
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
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
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
                      ? "No categories found matching your search."
                      : "No categories available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Bottom Hint */}
        {filteredCategories.length > 0 && (
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

      {/* Category Form */}
      <CategoryForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        category={selectedCategory}
        refresh={refresh}
      />

      {/* Delete Confirmation */}
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