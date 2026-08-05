"use client";

import { useEffect, useState } from "react";

import { getLeads } from "@/modules/lead/lead.api";

import { Lead } from "@/modules/lead/lead.types";

export function useLead() {
  const [loading, setLoading] =
    useState(true);

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const fetchLeads = async () => {
    try {
      const data = await getLeads();

      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,

    loading,

    refresh: fetchLeads,
  };
}