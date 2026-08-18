"use client";

import { useEffect, useState } from "react";

import {
  FolderOpen,
  Briefcase,
  Users,
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
      <div className="rounded-xl bg-white p-6 text-center text-sm shadow sm:rounded-2xl sm:p-10 sm:text-base">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Page Heading */}
      <div>
        <h1
          className="
            text-2xl
            font-bold
            leading-tight
            text-[#0A1F66]
            sm:text-3xl
          "
        >
          Dashboard
        </h1>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
            sm:mt-2
            sm:text-sm
          "
        >
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Statistics */}
      <div
        className="
          grid
          grid-cols-1
          gap-3
          sm:grid-cols-2
          sm:gap-4
          xl:grid-cols-4
          xl:gap-6
        "
      >
        <StatCard
          title="Categories"
          value={dashboard.totalCategories}
          icon={
            <FolderOpen
              size={22}
              className="sm:h-7 sm:w-7"
            />
          }
        />

        <StatCard
          title="Services"
          value={dashboard.totalServices}
          icon={
            <Briefcase
              size={22}
              className="sm:h-7 sm:w-7"
            />
          }
        />

        <StatCard
          title="Leads"
          value={dashboard.totalLeads}
          icon={
            <Users
              size={22}
              className="sm:h-7 sm:w-7"
            />
          }
        />
      </div>

      {/* Recent Leads */}
      <div className="min-w-0">
        <RecentLeadTable
          leads={dashboard.recentLeads}
        />
      </div>
    </div>
  );
}