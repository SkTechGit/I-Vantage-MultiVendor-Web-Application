"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getLeads } from "@/modules/lead/lead.api";
import { Lead } from "@/modules/lead/lead.types";
import { useRealtimeEvent } from "@/context/RealtimeContext";

export function useLead() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Debounced silent refetch for real-time events
  const refetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  useRealtimeEvent("leads", () => {
    if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);
    refetchTimerRef.current = setTimeout(() => {
      fetchLeads();
    }, 300);
  });

  return {
    leads,
    loading,
    refresh: fetchLeads,
  };
}