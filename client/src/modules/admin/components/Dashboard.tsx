"use client";

import { useEffect, useState } from "react";

import {
  FolderOpen,
  Briefcase,
  Users,
  ClipboardList,
} from "lucide-react";

import Loader from "@/components/common/Loader";

import StatCard from "./StatCard";
import RecentLeadTable from "./RecentLeadTable";

import { getDashboard } from "../admin.api";
import { DashboardStats } from "../admin.types";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] =
    useState<DashboardStats | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>

        <h1 className="text-3xl font-bold text-[#0A1F66]">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back, Admin 👋
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Categories"
          value={dashboard.totalCategories}
          icon={<FolderOpen size={28} />}
        />

        <StatCard
          title="Services"
          value={dashboard.totalServices}
          icon={<Briefcase size={28} />}
        />

        <StatCard
          title="Leads"
          value={dashboard.totalLeads}
          icon={<Users size={28} />}
        />

       
      </div>

      <RecentLeadTable
        leads={dashboard.recentLeads}
      />

    </div>
  );
}