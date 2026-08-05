"use client";

import { useEffect, useState } from "react";

import { getCRMLeads } from "@/modules/crm/crm.api";

import { CRMLead } from "@/modules/crm/crm.types";

export function useCRM() {
  const [loading, setLoading] =
    useState(true);

  const [crmLeads, setCRMLeads] =
    useState<CRMLead[]>([]);

  const fetchCRM = async () => {
    try {
      const data =
        await getCRMLeads();

      setCRMLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCRM();
  }, []);

  return {
    crmLeads,

    loading,

    refresh: fetchCRM,
  };
}