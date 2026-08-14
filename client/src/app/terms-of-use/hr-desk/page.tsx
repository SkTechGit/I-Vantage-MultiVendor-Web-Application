import Container from "@/components/common/Container";
import TermsCard from "@/components/terms/TermsCard";

export default function HumanResourcesTermsPage() {
  return (
    <main className="bg-slate-50">
      {/* Page Header */}
      <section className="border-b bg-white">
        <Container>
          <div className="py-14 sm:py-16 lg:py-20">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#1E5BFF]">
              i-VANTAGE Business Hub
            </p>

            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#0A1F66] sm:text-4xl lg:text-5xl">
              Terms of Use – Human Resources (HR) Desk
            </h1>

            <p className="mt-6 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              The following Terms of Use govern all services offered under
              the <strong>Human Resources (HR) Desk</strong> at i-VANTAGE
              Business Hub. By availing any HR Desk service, the member agrees
              to the terms mentioned below.
            </p>
          </div>
        </Container>
      </section>

      {/* Terms Content */}
      <section>
        <Container>
          <div className="mx-auto max-w-5xl space-y-6 py-10 sm:py-14 lg:py-20">

            {/* 1 */}
            <TermsCard title="1. Scope of Services">
              <p>
                The Human Resources Desk provides professional assistance
                for:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Recruitment Assistance</li>
                <li>Resume Screening</li>
                <li>Interview Coordination</li>
                <li>Job Description (JD) Preparation</li>
                <li>Employee Onboarding</li>
                <li>Offer Letter Preparation</li>
                <li>Employment Agreement Assistance</li>
                <li>Employee Documentation</li>
                <li>Attendance Management</li>
                <li>Leave Management</li>
                <li>Payroll Coordination</li>
                <li>HR Compliance Support</li>
                <li>HR Policy Guidance</li>
                <li>Performance Management Support</li>
                <li>Employee Engagement Guidance</li>
                <li>Exit Management</li>
              </ol>

              <p className="mt-5">
                The scope of services includes professional consultation, HR
                administration, documentation, coordination, compliance
                support, and guidance for routine HR operations.
              </p>
            </TermsCard>

            {/* 2 */}
            <TermsCard title="2. Professional Services vs. Third-Party Costs">
              <p>
                Membership covers only the professional services specifically
                included under the applicable membership plan.
              </p>

              <p className="mt-5">
                The following costs are <strong>not included</strong> and
                shall be payable separately by the member wherever applicable:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Job Portal Subscriptions (Naukri, LinkedIn, Indeed, etc.)</li>
                <li>Background Verification (BGV) Charges</li>
                <li>Psychometric Assessment Charges</li>
                <li>Payroll Software Subscription Fees</li>
                <li>HRMS Software Licenses</li>
                <li>EPF Contributions</li>
                <li>ESI Contributions</li>
                <li>Professional Tax</li>
                <li>Labour Welfare Fund Contributions</li>
                <li>Employee Insurance Premiums</li>
                <li>Third-party Recruitment Agency Fees</li>
                <li>External Trainer Fees</li>
                <li>Government Fees</li>
                <li>Any statutory payments payable by the employer</li>
              </ol>
            </TermsCard>

            {/* 3 */}
            <TermsCard title="3. Recruitment Assistance">
              <p>Recruitment Assistance includes:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Understanding hiring requirements</li>
                <li>Drafting job descriptions</li>
                <li>Posting vacancies (where applicable)</li>
                <li>Resume screening</li>
                <li>Candidate shortlisting</li>
                <li>Interview scheduling</li>
                <li>Candidate coordination</li>
              </ol>

              <p className="mt-5">
                i-VANTAGE does <strong>not</strong> guarantee:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Candidate availability</li>
                <li>Candidate acceptance</li>
                <li>Joining of selected candidates</li>
                <li>Employee retention</li>
                <li>Hiring within a specific timeline</li>
              </ol>

              <p className="mt-5">
                Final hiring decisions remain solely with the member.
              </p>
            </TermsCard>

            {/* 4 */}
            <TermsCard title="4. Fair Usage Policy">
              <p>
                HR services are intended for routine business requirements.
              </p>

              <p className="mt-5">
                Membership benefits are subject to reasonable usage limits.
              </p>

              <p className="mt-5">Examples include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Number of active job openings</li>
                <li>Number of candidate screenings</li>
                <li>Number of interview schedules</li>
                <li>HR consultation hours</li>
                <li>Payroll employee count</li>
                <li>Documentation requests</li>
              </ol>

              <p className="mt-5">
                Businesses with large-scale hiring, executive recruitment,
                campus hiring, or bulk workforce requirements may require a
                customized HR engagement.
              </p>
            </TermsCard>

            {/* 5 */}
            <TermsCard title="5. Payroll Processing Timeline">
              <p>
                Payroll processing is based on information submitted by the
                member.
              </p>

              <p className="mt-5">The member must provide complete:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Attendance records</li>
                <li>Leave records</li>
                <li>Salary revisions</li>
                <li>Incentives</li>
                <li>Deductions</li>
                <li>New joining details</li>
                <li>Exit details</li>
              </ol>

              <p className="mt-5">
                within the prescribed timeline.
              </p>

              <p className="mt-5">
                Delayed submission may result in delayed payroll processing.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be responsible for delays caused by
                incomplete or late information.
              </p>
            </TermsCard>

            {/* 6 */}
            <TermsCard title="6. HR Documentation">
              <p>
                Standard HR documentation includes preparation of:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Offer Letters</li>
                <li>Appointment Letters</li>
                <li>Employment Agreements</li>
                <li>Standard HR Policies</li>
                <li>Employee Forms</li>
                <li>Exit Documents</li>
              </ol>

              <p className="mt-5">
                Customized HR manuals, Employee Handbooks, POSH Manuals,
                Performance Management Systems, Organization Structures,
                Compensation Frameworks, and HR Transformation Projects are
                outside the standard membership scope unless specifically
                agreed in writing.
              </p>
            </TermsCard>

            {/* 7 */}
            <TermsCard title="7. HR Compliance">
              <p>
                HR Compliance support includes guidance and coordination
                relating to applicable labour compliances.
              </p>

              <p className="mt-5">
                The member remains solely responsible for:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Statutory compliance</li>
                <li>Employment decisions</li>
                <li>Labour law compliance</li>
                <li>Employee records</li>
                <li>Salary payments</li>
                <li>Government inspections</li>
                <li>Employment contracts</li>
              </ol>
            </TermsCard>

            {/* 8 */}
            <TermsCard title="8. Employment Relationship">
              <p>
                i-VANTAGE acts solely as an HR support and administrative
                service provider.
              </p>

              <p className="mt-5">
                The employment relationship exists exclusively between the
                member and their employees.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be considered:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Employer</li>
                <li>Co-employer</li>
                <li>Principal Employer</li>
                <li>Payroll Employer</li>
                <li>Labour Contractor</li>
                <li>Staffing Agency</li>
              </ol>

              <p className="mt-5">
                The member retains full responsibility for all
                employment-related decisions and liabilities.
              </p>
            </TermsCard>

            {/* 9 */}
            <TermsCard title="9. Employee Termination & Disputes">
              <p>
                Exit Management includes administrative assistance and
                documentation support.
              </p>

              <p className="mt-5">Membership does not include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Employee disciplinary proceedings</li>
                <li>Domestic enquiries</li>
                <li>Labour Court representation</li>
                <li>Employment litigation</li>
                <li>Wrongful termination disputes</li>
                <li>Settlement negotiations</li>
                <li>Legal representation</li>
              </ol>

              <p className="mt-5">
                Any employment dispute shall remain solely between the
                employer and the employee.
              </p>
            </TermsCard>

            {/* 10 */}
            <TermsCard title="10. Background Verification">
              <p>
                Background Verification services are coordinated through
                third-party verification agencies wherever applicable.
              </p>

              <p className="mt-5">
                Verification charges are payable separately.
              </p>

              <p className="mt-5">
                i-VANTAGE does not guarantee the accuracy of third-party
                verification reports.
              </p>
            </TermsCard>

            {/* 11 */}
            <TermsCard title="11. Candidate Availability">
              <p>Recruitment timelines depend upon:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Market conditions</li>
                <li>Candidate availability</li>
                <li>Notice periods</li>
                <li>Salary expectations</li>
                <li>Skill availability</li>
                <li>Interview schedules</li>
                <li>Candidate acceptance</li>
              </ol>

              <p className="mt-5">
                Priority Membership provides faster internal coordination
                only.
              </p>

              <p className="mt-5">
                It does not guarantee immediate hiring.
              </p>
            </TermsCard>

            {/* 12 */}
            <TermsCard title="12. Data Accuracy">
              <p>
                The member is responsible for ensuring that all employee
                information submitted is accurate and complete.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be responsible for errors arising from
                incorrect attendance, salary data, leave records, employee
                details, or statutory information provided by the member.
              </p>
            </TermsCard>

            {/* 13 */}
            <TermsCard title="13. Service Limitations">
              <p>
                Membership includes only the services specifically covered
                under the applicable membership plan.
              </p>

              <p className="mt-5">
                The following may attract additional professional fees:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Bulk recruitment</li>
                <li>Executive search assignments</li>
                <li>Campus hiring</li>
                <li>HR audits</li>
                <li>HR transformation projects</li>
                <li>Custom HR policy drafting</li>
                <li>Organization restructuring</li>
                <li>Compensation benchmarking</li>
                <li>HR consulting projects</li>
                <li>Employee training programs</li>
                <li>Additional documentation requests</li>
              </ol>
            </TermsCard>

            {/* 14 */}
            <TermsCard title="14. Third-Party Services">
              <p>
                Certain HR services may be performed through empanelled
                recruitment agencies, payroll partners, background
                verification agencies, HR consultants, trainers, software
                providers, and statutory professionals.
              </p>

              <p className="mt-5">
                i-VANTAGE acts only as a coordinator and facilitator for such
                services.
              </p>
            </TermsCard>

            {/* 15 */}
            <TermsCard title="15. No Guarantee of Hiring Outcomes">
              <p>
                i-VANTAGE provides professional HR support and coordination
                only.
              </p>

              <p className="mt-5">
                No guarantee is provided regarding:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Candidate selection</li>
                <li>Candidate joining</li>
                <li>Employee retention</li>
                <li>Employee performance</li>
                <li>Recruitment timelines</li>
                <li>
                  Payroll accuracy where incorrect data is provided
                </li>
                <li>Compliance inspections</li>
                <li>Labour disputes</li>
                <li>Employee productivity</li>
                <li>Background verification outcomes</li>
              </ol>
            </TermsCard>

            {/* 16 */}
            <TermsCard title="16. Modification of Services">
              <p>
                i-VANTAGE reserves the right to modify, update, suspend, or
                discontinue any HR Desk service, operational process, partner
                engagement, software platform, or membership benefit without
                prior notice, subject to applicable law.
              </p>
            </TermsCard>

            {/* 17 */}
            <TermsCard title="17. Acceptance of Terms">
              <p>
                By availing any Human Resources Desk service, the member
                confirms that they have read, understood, and agreed to these
                Terms of Use. The member further acknowledges that i-VANTAGE
                provides professional HR administration, coordination, and
                advisory services only. All employment relationships, hiring
                decisions, salary payments, statutory obligations, labour law
                compliance, employee disputes, and employer liabilities
                remain solely the responsibility of the member.
              </p>
            </TermsCard>

          </div>
        </Container>
      </section>
    </main>
  );
}