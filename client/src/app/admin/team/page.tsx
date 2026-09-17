import TeamManagement from "@/modules/admin/components/TeamManagement";

export const metadata = {
  title: "Team & Access Management | i-VANTAGE Admin",
  description: "Manage administrators, invitations, and access requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <TeamManagement />;
}
