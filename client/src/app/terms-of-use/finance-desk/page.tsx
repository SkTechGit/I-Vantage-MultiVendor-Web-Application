import Container from "@/components/common/Container";
import TermsCard from "@/components/terms/TermsCard";

export default function FinanceTermsPage() {
  return (
    <main className="bg-slate-50">
      {/* Page Header */}
      <section className="border-b bg-white">
        <Container>
          <div className="py-14 sm:py-16 lg:py-20">
            <p className="mb-3 text-sm font-semibold tracking-wider text-[#1E5BFF]">
              i-VANTAGE Business Hub
            </p>

            <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#0A1F66] sm:text-4xl lg:text-5xl">
              Terms of Use – Finance Desk
            </h1>

            <p className="mt-6 max-w-4xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              The following Terms of Use govern all services offered under
              the <strong>Finance Desk</strong> at i-VANTAGE Business Hub.
              By availing any Finance Desk service, the member agrees to the
              terms mentioned below.
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
                The Finance Desk provides professional assistance for:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Bookkeeping</li>
                <li>Accounting</li>
                <li>GST Return Filing</li>
                <li>Income Tax Return Filing</li>
                <li>TDS Compliance</li>
                <li>ROC Annual Compliance</li>
                <li>Payroll Processing</li>
                <li>EPF &amp; ESI Compliance</li>
                <li>Financial Statements</li>
                <li>MIS Reports</li>
                <li>Cash Flow Management</li>
                <li>Accounts Receivable Management</li>
                <li>Accounts Payable Management</li>
                <li>Expense Management</li>
                <li>Audit Support</li>
                <li>Virtual CFO Advisory</li>
              </ol>

              <p className="mt-5">
                The scope of services includes professional consultation,
                accounting support, statutory filing, financial reporting,
                and coordination with the relevant authorities and
                professionals.
              </p>
            </TermsCard>

            {/* 2 */}
            <TermsCard title="2. Professional Services vs. Statutory Payments">
              <p>
                Membership covers only the professional services specifically
                included under the applicable membership plan.
              </p>

              <p className="mt-5">
                The following are <strong>not included</strong> and shall be
                payable separately by the member:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>GST Liability</li>
                <li>Income Tax Liability</li>
                <li>TDS Payments</li>
                <li>EPF Contributions</li>
                <li>ESI Contributions</li>
                <li>Professional Tax</li>
                <li>Interest on delayed payments</li>
                <li>Government penalties</li>
                <li>Late filing fees</li>
                <li>Audit Certification Fees</li>
                <li>Independent Chartered Accountant Fees</li>
                <li>Government challans</li>
                <li>Bank charges</li>
                <li>Third-party software subscriptions</li>
                <li>
                  Any statutory payment payable to Government authorities
                </li>
              </ol>
            </TermsCard>

            {/* 3 */}
            <TermsCard title="3. Current Financial Period Only">
              <p>
                Finance Desk services apply only to transactions occurring
                after the commencement of the membership.
              </p>

              <p className="mt-5">
                Historical bookkeeping, pending compliances, old GST returns,
                previous financial years, tax notices, reconciliations,
                litigation support, assessments, and legacy accounting are
                outside the scope of membership and shall be treated as
                separate professional assignments.
              </p>
            </TermsCard>

            {/* 4 */}
            <TermsCard title="4. Fair Usage Policy">
              <p>
                Routine accounting services are intended for normal business
                operations.
              </p>

              <p className="mt-5">
                Businesses having unusually high transaction volumes,
                including but not limited to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>E-commerce businesses</li>
                <li>Marketplace sellers</li>
                <li>Retail chains</li>
                <li>High-volume distributors</li>
                <li>Multi-location businesses</li>
              </ol>

              <p className="mt-5">
                may require a customized engagement plan.
              </p>

              <p className="mt-5">
                i-VANTAGE reserves the right to recommend a higher service
                plan or separate quotation where transaction volumes exceed
                standard operational limits.
              </p>
            </TermsCard>

            {/* 5 */}
            <TermsCard title="5. Document Submission Timeline">
              <p>
                Members must submit complete accounting records within the
                prescribed timelines.
              </p>

              <p className="mt-5">This includes:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Sales invoices</li>
                <li>Purchase invoices</li>
                <li>Bank statements</li>
                <li>Expense bills</li>
                <li>Credit card statements</li>
                <li>Payroll information</li>
                <li>Investment details</li>
                <li>Other supporting documents</li>
              </ol>

              <p className="mt-5">
                Late submission of documents may result in delayed filings.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be responsible for penalties, interest,
                or late fees arising due to delayed or incomplete document
                submission by the member.
              </p>
            </TermsCard>

            {/* 6 */}
            <TermsCard title="6. Accuracy of Records">
              <p>
                The member is responsible for ensuring that all accounting
                records, invoices, bills, vouchers, and financial information
                submitted are accurate and complete.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be liable for errors arising from
                incorrect, incomplete, manipulated, or fraudulent information
                provided by the member.
              </p>
            </TermsCard>

            {/* 7 */}
            <TermsCard title="7. GST Compliance">
              <p>
                GST filing services include preparation and submission of GST
                returns based on the information and documents provided by
                the member.
              </p>

              <p className="mt-5">
                Approval of Input Tax Credit (ITC), GST refunds, departmental
                notices, or assessments depends entirely upon Government
                regulations and vendor compliance.
              </p>

              <p className="mt-5">
                i-VANTAGE does not guarantee GST refunds, ITC eligibility, or
                acceptance of returns without departmental queries.
              </p>
            </TermsCard>

            {/* 8 */}
            <TermsCard title="8. Income Tax Services">
              <p>
                Income Tax Return filing is based on the financial information
                and records made available by the member.
              </p>

              <p className="mt-5">
                Tax refunds, tax savings, assessments, notices, and scrutiny
                proceedings remain subject to the Income Tax Act and the
                discretion of the Income Tax Department.
              </p>

              <p className="mt-5">
                i-VANTAGE does not guarantee tax refunds, reduction of tax
                liability, or exemption eligibility.
              </p>
            </TermsCard>

            {/* 9 */}
            <TermsCard title="9. Payroll Services">
              <p>
                Payroll services include salary computation, statutory
                deductions, payslip generation, and payroll reporting.
              </p>

              <p className="mt-5">Membership does not include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Salary disbursement</li>
                <li>Bank transfer execution</li>
                <li>Employee payment approvals</li>
                <li>OTP management</li>
                <li>Cash handling</li>
                <li>Daily reimbursement processing</li>
                <li>Expense approvals</li>
              </ol>

              <p className="mt-5">
                These services may be offered separately under customized
                engagements.
              </p>
            </TermsCard>

            {/* 10 */}
            <TermsCard title="10. Audit Support">
              <p>
                Audit Support refers to coordination, documentation
                assistance, financial statement preparation, and audit
                facilitation.
              </p>

              <p className="mt-5">Membership does not include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Statutory Audit Fees</li>
                <li>Tax Audit Fees</li>
                <li>Independent Chartered Accountant Certification</li>
                <li>Government certification charges</li>
                <li>Special audits</li>
                <li>Investigation audits</li>
              </ol>

              <p className="mt-5">
                These shall be charged separately wherever applicable.
              </p>
            </TermsCard>

            {/* 11 */}
            <TermsCard title="11. Virtual CFO Services">
              <p>
                Virtual CFO services are strategic advisory services and may
                include:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Financial planning</li>
                <li>Budgeting</li>
                <li>Business performance review</li>
                <li>MIS analysis</li>
                <li>Cash flow planning</li>
                <li>Financial strategy</li>
                <li>Business advisory</li>
              </ol>

              <p className="mt-5">
                Virtual CFO services do not include:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Daily bookkeeping</li>
                <li>Bank operations</li>
                <li>Vendor payment approvals</li>
                <li>Cash collection</li>
                <li>Loan negotiations</li>
                <li>Investor fundraising</li>
                <li>Statutory compliance execution</li>
                <li>Operational finance management</li>
              </ol>

              <p className="mt-5">
                Unless specifically agreed under a separate engagement.
              </p>
            </TermsCard>

            {/* 12 */}
            <TermsCard title="12. Government Notices">
              <p>
                Any notice, assessment, scrutiny, investigation, or demand
                issued for periods prior to commencement of membership shall
                be treated as a separate assignment.
              </p>

              <p className="mt-5">
                Representation before Government authorities, drafting
                replies, appeals, and litigation support are not included in
                the membership.
              </p>
            </TermsCard>

            {/* 13 */}
            <TermsCard title="13. Processing Timelines">
              <p>Professional services commence after:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Receipt of complete documentation</li>
                <li>Verification of records</li>
                <li>Payment of applicable charges</li>
                <li>Completion of onboarding requirements</li>
              </ol>

              <p className="mt-5">
                Government processing timelines are beyond the control of
                i-VANTAGE.
              </p>
            </TermsCard>

            {/* 14 */}
            <TermsCard title="14. Member Responsibilities">
              <p>The member agrees to:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Submit complete financial records on time.</li>
                <li>Maintain proper books and supporting documents.</li>
                <li>Reconcile bank accounts regularly.</li>
                <li>Respond promptly to clarification requests.</li>
                <li>Pay all statutory liabilities before due dates.</li>
                <li>
                  Inform i-VANTAGE of any significant financial changes
                  affecting compliance.
                </li>
              </ol>
            </TermsCard>

            {/* 15 */}
            <TermsCard title="15. Service Limitations">
              <p>
                Membership includes only the services specifically covered
                under the applicable membership plan.
              </p>

              <p className="mt-5">
                The following may attract additional professional fees:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Historical bookkeeping</li>
                <li>Reconstruction of accounts</li>
                <li>High-volume accounting</li>
                <li>Departmental notices</li>
                <li>Assessments</li>
                <li>Appeals</li>
                <li>Litigation support</li>
                <li>Financial due diligence</li>
                <li>Special reports</li>
                <li>Complex reconciliations</li>
                <li>Additional revisions</li>
                <li>Customized MIS requirements</li>
              </ol>
            </TermsCard>

            {/* 16 */}
            <TermsCard title="16. Third-Party Services">
              <p>
                Certain services may be performed through empanelled
                Chartered Accountants, Company Secretaries, Payroll
                Consultants, Software Partners, and other professional
                service providers.
              </p>

              <p className="mt-5">
                i-VANTAGE acts as a coordinator and facilitator for such
                services.
              </p>
            </TermsCard>

            {/* 17 */}
            <TermsCard title="17. No Guarantee of Financial Outcomes">
              <p>
                i-VANTAGE provides professional accounting and compliance
                assistance only.
              </p>

              <p className="mt-5">
                No guarantee is provided regarding:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Tax refunds</li>
                <li>Tax savings</li>
                <li>Input Tax Credit availability</li>
                <li>Government approvals</li>
                <li>Audit outcomes</li>
                <li>Loan approvals</li>
                <li>Financial performance</li>
                <li>Profitability</li>
                <li>Investment funding</li>
                <li>Government assessments</li>
              </ol>

              <p className="mt-5">
                All financial outcomes depend upon applicable laws, financial
                records, Government authorities, and business performance.
              </p>
            </TermsCard>

            {/* 18 */}
            <TermsCard title="18. Modification of Services">
              <p>
                i-VANTAGE reserves the right to modify, update, suspend, or
                discontinue any Finance Desk service, operational process,
                partner engagement, or membership benefit without prior
                notice, subject to applicable law.
              </p>
            </TermsCard>

            {/* 19 */}
            <TermsCard title="19. Acceptance of Terms">
              <p>
                By availing any Finance Desk service, the member confirms that
                they have read, understood, and agreed to these Terms of Use.
                The member further acknowledges that i-VANTAGE provides
                professional financial support and coordination only, while
                Government approvals, statutory liabilities, tax payments,
                audit certifications, and regulatory decisions remain the
                responsibility of the respective authorities and the member,
                as applicable.
              </p>
            </TermsCard>

          </div>
        </Container>
      </section>
    </main>
  );
}