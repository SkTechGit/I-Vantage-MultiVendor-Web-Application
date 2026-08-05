"use client";

import { useEffect, useState } from "react";

import { getServices } from "@/modules/service/service.api";
import { Service } from "@/modules/service/service.types";

export function useService() {
  const [services, setServices] = useState<Service[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchServices = async () => {
    try {
      const data =
        await getServices();

      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,

    loading,

    refresh: fetchServices,
  };
}