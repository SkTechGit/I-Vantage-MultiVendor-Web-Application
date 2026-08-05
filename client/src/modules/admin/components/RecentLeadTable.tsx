import { DashboardStats } from "../admin.types";

interface Props {
  leads: DashboardStats["recentLeads"];
}

export default function RecentLeadTable({
  leads,
}: Props) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border border-slate-200">

      <div className="border-b p-6">

        <h2 className="text-2xl font-bold text-[#0A1F66]">
          Recent Leads
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Name
              </th>

              <th className="px-6 py-4 text-left">
                Service
              </th>

              <th className="px-6 py-4 text-left">
                Mobile
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {leads.map((lead) => (

              <tr
                key={lead._id}
                className="border-t"
              >

                <td className="px-6 py-4 font-medium">
                  {lead.fullName}
                </td>

                <td className="px-6 py-4">

                  {lead.services
                    .map((item) => item.name)
                    .join(", ")}

                </td>

                <td className="px-6 py-4">
                  {lead.mobile}
                </td>

                <td className="px-6 py-4">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-[#1E5BFF]">

                    {lead.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}