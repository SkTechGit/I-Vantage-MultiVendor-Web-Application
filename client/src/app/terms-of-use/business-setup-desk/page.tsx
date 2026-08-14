import Container from "@/components/common/Container";
import TermsCard from "@/components/terms/TermsCard";

export default function BusinessSetupTermsPage() {
  return (
    <main className="bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <Container>
  <div className="flex flex-col items-center py-12 text-center sm:py-16 lg:py-20">
    {/* Eyebrow */}
    <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#1E5BFF] sm:text-sm">
      i-VANTAGE Business Hub
    </p>

    {/* Heading */}
    <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-4xl md:text-5xl lg:text-6xl">
      Terms of Use – Business Setup Desk
    </h1>

    {/* Description */}
    <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
      The following Terms of Use govern all services offered under the{" "}
      <strong className="font-semibold text-slate-800">
        Business Setup Desk
      </strong>{" "}
      at i-VANTAGE Business Hub. By availing any service, the member agrees
      to the terms mentioned below.
    </p>
  </div>
</Container>
      </section>

      {/* Terms */}
      <section>
        <Container>
          <div className="mx-auto max-w-5xl space-y-6 py-10 sm:py-14 lg:py-20">

            {/* 1 */}
            <TermsCard title="1. Scope of Services">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The Business Setup Desk provides professional assistance for:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Company Registration</li>
                <li>LLP Registration</li>
                <li>GST Registration</li>
                <li>PAN &amp; TAN Registration</li>
                <li>MSME Registration</li>
                <li>Startup India Registration</li>
                <li>Import Export Code (IEC)</li>
                <li>Trademark Registration</li>
                <li>Business Licenses &amp; Approvals</li>
                <li>Business Bank Account Assistance</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The scope of service is limited to professional consultation,
                documentation, application preparation, submission,
                coordination, and follow-up with the relevant authorities.
              </p>
            </TermsCard>

            {/* 2 */}
            <TermsCard title="2. Professional Fees vs Government Charges">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Membership covers only the professional services specifically
                included under the applicable membership plan.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The following charges are{" "}
                <strong>not included</strong> and shall be payable by the
                member at actuals wherever applicable:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Government filing fees</li>
                <li>MCA fees</li>
                <li>GST registration charges levied by authorities</li>
                <li>Stamp duty</li>
                <li>Digital Signature Certificate (DSC) charges</li>
                <li>Director Identification Number (DIN) fees</li>
                <li>Name reservation fees</li>
                <li>Trademark filing fees</li>
                <li>Licensing fees</li>
                <li>Municipal charges</li>
                <li>Notary charges</li>
                <li>Courier charges</li>
                <li>Third-party vendor charges</li>
                <li>
                  Any statutory or regulatory fees imposed by Government
                  authorities
                </li>
              </ol>
            </TermsCard>

            {/* 3 */}
            <TermsCard title="3. Processing Timelines">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE commits to initiating and submitting complete
                applications within a reasonable time after receiving all
                required documents.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Approval timelines are controlled entirely by Government
                departments, statutory authorities, banks, and regulatory
                agencies.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE does not guarantee any specific approval date or
                processing timeline.
              </p>
            </TermsCard>

            {/* 4 */}
            <TermsCard title="4. Government Approvals">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Approval, rejection, resubmission, clarification requests,
                inspections, or delays are solely at the discretion of the
                concerned Government authority.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE shall not be responsible for delays arising due to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Government portal downtime</li>
                <li>Department backlog</li>
                <li>Public holidays</li>
                <li>Regulatory changes</li>
                <li>Officer availability</li>
                <li>Manual verification</li>
                <li>Inspection requirements</li>
              </ol>
            </TermsCard>

            {/* 5 */}
            <TermsCard title="5. Accuracy of Information">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Members are responsible for providing:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Accurate information</li>
                <li>Valid documents</li>
                <li>Updated identity proofs</li>
                <li>Correct address proofs</li>
                <li>Authentic business information</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Any delay or rejection resulting from incorrect, incomplete,
                expired, or inconsistent documentation shall be the sole
                responsibility of the member.
              </p>
            </TermsCard>

            {/* 6 */}
            <TermsCard title="6. KYC & Verification Requirements">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Certain registrations may require:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Aadhaar Authentication</li>
                <li>Video KYC</li>
                <li>Physical verification</li>
                <li>Biometric verification</li>
                <li>Director verification</li>
                <li>Personal appearance before authorities</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                These requirements are determined by the respective authority
                and cannot be waived by i-VANTAGE.
              </p>
            </TermsCard>

            {/* 7 */}
            <TermsCard title="7. Company Name Availability">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Approval of a proposed company or LLP name is subject to the
                Ministry of Corporate Affairs.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE cannot guarantee approval of any specific business
                name.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                If a proposed name is rejected, alternative names may need to
                be submitted.
              </p>
            </TermsCard>

            {/* 8 */}
            <TermsCard title="8. GST Registration">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                GST registration approval depends upon the GST Department.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The department may request:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Additional documents</li>
                <li>Physical verification</li>
                <li>Aadhaar authentication</li>
                <li>Clarifications</li>
                <li>Site inspection</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE cannot guarantee approval of any GST application.
              </p>
            </TermsCard>

            {/* 9 */}
            <TermsCard title="9. Virtual Office Address">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Where a Virtual Office address is used, acceptance of the
                address remains solely at the discretion of the concerned
                Government authority.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Any additional documentation, inspections, or clarifications
                requested by tax authorities shall be provided subject to
                availability and applicable charges.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE does not guarantee GST approval solely because a
                Virtual Office facility has been provided.
              </p>
            </TermsCard>

            {/* 10 */}
            <TermsCard title="10. Business Licenses">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Certain business licenses may require:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Site inspections</li>
                <li>Fire safety approvals</li>
                <li>Pollution clearances</li>
                <li>Health department approvals</li>
                <li>Municipal permissions</li>
                <li>Industry-specific compliance</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Obtaining such approvals may require the member&apos;s active
                participation and additional documentation.
              </p>
            </TermsCard>

            {/* 11 */}
            <TermsCard title="11. Bank Account Opening">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE may facilitate introductions to partner banks.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                However, approval of a business bank account is entirely at
                the discretion of the concerned bank.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The bank may:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Reject the application</li>
                <li>Seek additional documents</li>
                <li>Conduct physical verification</li>
                <li>Perform enhanced KYC</li>
                <li>Require further compliance</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE cannot guarantee bank account approval or activation
                timelines.
              </p>
            </TermsCard>

            {/* 12 */}
            <TermsCard title="12. Membership Coverage">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Unless specifically mentioned otherwise, Business Setup
                services apply to <strong>one legal entity per membership contract</strong>.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Additional companies, LLPs, proprietorships, partnerships,
                branches, or sister concerns shall be treated as separate
                assignments and charged accordingly.
              </p>
            </TermsCard>

            {/* 13 */}
            <TermsCard title="13. Existing Businesses">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Membership benefits apply to new assignments undertaken after
                commencement of membership.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Rectification of historical non-compliance, pending statutory
                filings, litigation matters, penalties, notices, or legacy
                legal and tax issues shall be treated as separate professional
                assignments and billed independently.
              </p>
            </TermsCard>

            {/* 14 */}
            <TermsCard title="14. Trademark & Intellectual Property">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Trademark registration is subject to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Availability of the proposed mark</li>
                <li>Trademark classification</li>
                <li>Government examination</li>
                <li>Objections</li>
                <li>Oppositions</li>
                <li>Applicable laws</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE does not guarantee trademark approval or registration.
              </p>
            </TermsCard>

            {/* 15 */}
            <TermsCard title="15. Service Limitations">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Membership includes only the services expressly stated under
                the applicable membership plan.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Any additional work arising due to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Multiple revisions</li>
                <li>Change of business structure</li>
                <li>Additional documentation</li>
                <li>Government objections</li>
                <li>Resubmissions</li>
                <li>Appeals</li>
                <li>Legal representation</li>
                <li>Complex advisory</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                may attract additional professional fees.
              </p>
            </TermsCard>

            {/* 16 */}
            <TermsCard title="16. Third-Party Services">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Certain services may be delivered through empanelled
                professionals, including Chartered Accountants, Company
                Secretaries, Advocates, Consultants, Banking Partners, and
                Government-authorized agencies.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE acts as a facilitator and coordinator for such
                services.
              </p>
            </TermsCard>

            {/* 17 */}
            <TermsCard title="17. Member Responsibilities">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                The member agrees to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Submit complete documentation on time.</li>
                <li>Respond promptly to clarification requests.</li>
                <li>
                  Cooperate during verification and inspection processes.
                </li>
                <li>
                  Make all statutory payments before prescribed deadlines.
                </li>
                <li>Provide truthful and lawful information.</li>
              </ol>
            </TermsCard>

            {/* 18 */}
            <TermsCard title="18. No Guarantee of Approval">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE provides professional assistance and coordination
                only.
              </p>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                No guarantee is provided regarding:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-[#1E5BFF] sm:text-base sm:leading-8">
                <li>Company incorporation</li>
                <li>GST registration</li>
                <li>Trademark registration</li>
                <li>Business license approval</li>
                <li>Startup India recognition</li>
                <li>IEC approval</li>
                <li>Bank account approval</li>
                <li>Any Government approval or certification</li>
              </ol>

              <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                All approvals remain subject to applicable laws and the
                discretion of the respective authority.
              </p>
            </TermsCard>

            {/* 19 */}
            <TermsCard title="19. Modification of Services">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                i-VANTAGE reserves the right to modify, update, replace, or
                discontinue any service, process, partner, or membership
                benefit without prior notice, subject to applicable law.
              </p>
            </TermsCard>

            {/* 20 */}
            <TermsCard title="20. Acceptance of Terms">
              <p className="text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                By availing any Business Setup Desk service, the member
                confirms that they have read, understood, and agreed to these
                Terms of Use and acknowledge that Government processes,
                statutory timelines, and third-party approvals are beyond the
                control of i-VANTAGE Business Hub.
              </p>
            </TermsCard>

          </div>
        </Container>
      </section>
    </main>
  );
}