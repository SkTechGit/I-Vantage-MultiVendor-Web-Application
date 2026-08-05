"use client";

import { useEffect, useState } from "react";

import { Category } from "@/modules/category/category.types";

import { getCategories } from "@/modules/category/category.api";

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,

    loading,

    refresh: fetchCategories,
  };
}