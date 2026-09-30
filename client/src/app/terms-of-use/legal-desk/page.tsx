import Container from "@/components/common/Container";
import TermsCard from "@/components/terms/TermsCard";

export default function LegalDeskTermsPage() {
  return (
    <main className="bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <Container>
  <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
    <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#1E5BFF] sm:text-sm">
      i-VANTAGE Business Hub
    </p>

    <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight tracking-tight text-[#0A1F66] sm:text-4xl md:text-5xl lg:text-6xl">
      Terms of Use – Legal Desk
    </h1>

    <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:mt-6 sm:text-base sm:leading-8 lg:text-lg">
      The following Terms of Use govern all services offered under the{" "}
      <strong className="font-semibold text-slate-700">Legal Desk</strong>{" "}
      at i-VANTAGE Business Hub. By availing any Legal Desk service, the
      member confirms that they have read, understood, and agreed to these
      terms.
    </p>
  </div>
</Container>
      </section>

      {/* Content */}
      <section>
        <Container>
          <div className="mx-auto max-w-5xl space-y-6 py-10 sm:py-14 lg:py-20">

            {/* 1 */}
            <TermsCard title="1. Scope of Services">
              <p>
                The Legal Desk provides professional assistance and
                coordination for:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Legal Consultation</li>
                <li>Contract Review &amp; Vetting</li>
                <li>Agreement Drafting</li>
                <li>Employment Agreements</li>
                <li>Vendor Agreements</li>
                <li>Non-Disclosure Agreements (NDA)</li>
                <li>Memorandum of Understanding (MoU)</li>
                <li>Legal Notice Drafting</li>
                <li>Legal Compliance Guidance</li>
                <li>Trademark Assistance</li>
                <li>Copyright Assistance</li>
                <li>Patent Assistance</li>
                <li>Intellectual Property (IP) Advisory</li>
                <li>Business Legal Documentation</li>
              </ol>

              <p className="mt-5">
                The exact scope of each service depends on the applicable
                membership plan and the nature and complexity of the
                assignment.
              </p>
            </TermsCard>

            {/* 2 */}
            <TermsCard title="2. Professional Assistance vs. External Costs">
              <p>
                Membership covers professional assistance specifically stated
                under the applicable membership plan.
              </p>

              <p className="mt-5">
                The following are <strong>not included</strong> and shall be
                payable separately by the member wherever applicable:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Government filing fees</li>
                <li>Trademark filing fees</li>
                <li>Patent filing fees</li>
                <li>Copyright registration fees</li>
                <li>Stamp duty</li>
                <li>Court fees</li>
                <li>Notarization charges</li>
                <li>Registration charges</li>
                <li>Registry fees</li>
                <li>Advocate appearance fees</li>
                <li>Third-party legal professional fees</li>
                <li>Specialist legal consultant fees</li>
                <li>Translation charges</li>
                <li>Documentation and courier charges</li>
                <li>Any other statutory or third-party charges</li>
              </ol>

              <p className="mt-5">
                Where such charges are applicable, the member shall be
                informed before the relevant service is undertaken, wherever
                reasonably possible.
              </p>
            </TermsCard>

            {/* 3 */}
            <TermsCard title="3. Standard Templates vs. Custom Legal Drafting">
              <p>
                Membership may include customization of standard legal
                templates such as:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Standard NDAs</li>
                <li>Basic employment agreements</li>
                <li>Basic vendor agreements</li>
                <li>Standard MoUs</li>
                <li>Routine business agreements</li>
              </ol>

              <p className="mt-5">
                Complex or highly customized legal documentation may require a
                separate professional engagement.
              </p>

              <p className="mt-5">This may include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Shareholders Agreements</li>
                <li>Share Purchase Agreements</li>
                <li>Investment Agreements</li>
                <li>Founders&apos; Agreements with complex vesting structures</li>
                <li>Mergers &amp; Acquisitions documentation</li>
                <li>Complex licensing agreements</li>
                <li>International commercial agreements</li>
                <li>Franchise agreements</li>
                <li>Complex technology agreements</li>
                <li>Corporate restructuring documentation</li>
              </ol>

              <p className="mt-5">
                The scope and professional fees for such assignments shall be
                communicated separately.
              </p>
            </TermsCard>

            {/* 4 */}
            <TermsCard title="4. Contract Review & Vetting">
              <p>
                Contract review services involve examination of the agreement
                provided by the member and identification of key commercial
                and legal considerations.
              </p>

              <p className="mt-5">The review may include:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Identification of significant contractual risks</li>
                <li>Liability provisions</li>
                <li>Indemnity clauses</li>
                <li>Payment terms</li>
                <li>Termination provisions</li>
                <li>Confidentiality provisions</li>
                <li>Intellectual property provisions</li>
                <li>Dispute resolution provisions</li>
                <li>Suggested revisions</li>
              </ol>

              <p className="mt-5">
                The turnaround time depends on the length, complexity,
                urgency, and number of documents involved.
              </p>

              <p className="mt-5 font-semibold">
                Priority Membership does not mean immediate or guaranteed
                completion within a few hours.
              </p>
            </TermsCard>

            {/* 5 */}
            <TermsCard title="5. Revision & Scope Changes">
              <p>
                Legal drafting and contract review services include revisions
                within the originally agreed scope.
              </p>

              <p className="mt-5">
                If the member substantially changes the commercial
                arrangement, business structure, transaction terms, or purpose
                of the document after drafting has commenced, the revised
                requirement may be treated as a new assignment.
              </p>

              <p className="mt-5">
                Extensive redrafting or repeated changes may attract
                additional professional charges.
              </p>
            </TermsCard>

            {/* 6 */}
            <TermsCard title="6. Legal Notices">
              <p>
                The Legal Desk may assist with drafting routine legal notices
                relating to matters such as:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Outstanding payments</li>
                <li>Contractual breaches</li>
                <li>Commercial disputes</li>
                <li>Recovery matters</li>
                <li>Basic contractual notices</li>
              </ol>

              <p className="mt-5">
                A legal notice does not constitute representation in subsequent
                litigation or proceedings.
              </p>

              <p className="mt-5">
                If the recipient responds with a counter-notice or initiates
                litigation, arbitration, criminal proceedings, regulatory
                proceedings, or other formal proceedings, the matter may
                require a separate legal engagement.
              </p>
            </TermsCard>

            {/* 7 */}
            <TermsCard title="7. Litigation & Court Representation">
              <p>
                Legal Desk membership does <strong>not</strong> include:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Court appearances</li>
                <li>Tribunal appearances</li>
                <li>Arbitration hearings</li>
                <li>Mediation representation</li>
                <li>Police representation</li>
                <li>Regulatory hearings</li>
                <li>Litigation management</li>
                <li>Filing of court proceedings</li>
                <li>Advocate appearance fees</li>
                <li>Litigation strategy for complex disputes</li>
              </ol>

              <p className="mt-5">
                Such services may be facilitated through appropriate legal
                professionals under a separate engagement.
              </p>

              <p className="mt-5">
                i-VANTAGE does not guarantee any litigation, arbitration,
                mediation, settlement, or dispute-resolution outcome.
              </p>
            </TermsCard>

            {/* 8 */}
            <TermsCard title="8. Intellectual Property Services">
              <p>
                The Legal Desk may provide assistance relating to:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Trademark registration</li>
                <li>Copyright registration</li>
                <li>Patent assistance</li>
                <li>IP documentation</li>
                <li>IP advisory</li>
              </ol>

              <p className="mt-5">
                Government filing fees and other statutory charges are payable
                separately.
              </p>

              <p className="mt-5">
                Patent drafting, claims drafting, technical specifications,
                international patent filings, specialized IP opinions,
                opposition proceedings, hearings, and complex IP litigation
                may require separate specialist professional services.
              </p>
            </TermsCard>

            {/* 9 */}
            <TermsCard title="9. Trademark Registration">
              <p>
                Trademark assistance may include preliminary guidance,
                documentation, application preparation, filing coordination,
                and status tracking within the agreed scope.
              </p>

              <p className="mt-5">
                Trademark registration is subject to examination by the
                Trademark Registry and may be affected by:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Existing trademarks</li>
                <li>Similar marks</li>
                <li>Registry objections</li>
                <li>Third-party opposition</li>
                <li>Classification issues</li>
                <li>Legal objections</li>
                <li>Changes in applicable law</li>
              </ol>

              <p className="mt-5 font-semibold">
                i-VANTAGE does not guarantee trademark registration, approval,
                or a specific registration timeline.
              </p>

              <p className="mt-5">
                Responses to objections, oppositions, hearings, appeals, and
                complex trademark disputes may attract additional professional
                fees.
              </p>
            </TermsCard>

            {/* 10 */}
            <TermsCard title="10. Patent Assistance">
              <p>
                Patent-related services are subject to the complexity and
                technical nature of the invention.
              </p>

              <p className="mt-5">
                Basic patent assistance and coordination may be available
                under the applicable membership.
              </p>

              <p className="mt-5">
                The following may require a separate specialist engagement:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Patent specification drafting</li>
                <li>Claims drafting</li>
                <li>Patentability opinions</li>
                <li>Prior-art research</li>
                <li>International patent applications</li>
                <li>PCT filings</li>
                <li>Patent prosecution</li>
                <li>Patent opposition</li>
                <li>Patent hearings</li>
                <li>Patent litigation</li>
              </ol>

              <p className="mt-5">
                Government fees and specialist professional charges are
                payable separately.
              </p>
            </TermsCard>

            {/* 11 */}
            <TermsCard title="11. Legal Advisory">
              <p>
                Legal guidance provided through i-VANTAGE is intended to
                assist members in understanding routine business
                documentation, contractual considerations, and general legal
                processes.
              </p>

              <p className="mt-5">
                Members remain responsible for making their own commercial
                decisions.
              </p>

              <p className="mt-5">
                No advice provided by i-VANTAGE shall be interpreted as a
                guarantee that a particular commercial, legal, regulatory, or
                dispute outcome will occur.
              </p>
            </TermsCard>

            {/* 12 */}
            <TermsCard title="12. No Permanent In-House Counsel Relationship">
              <p>
                A <strong>Dedicated Legal Advisor</strong> under a membership
                does not mean that i-VANTAGE is providing a full-time in-house
                lawyer exclusively assigned to the member.
              </p>

              <p className="mt-5">
                The Dedicated Legal Advisor provides coordination, guidance,
                document support, and access to appropriate legal resources
                within the scope of the membership.
              </p>

              <p className="mt-5">
                Daily participation in every vendor negotiation, board
                meeting, commercial transaction, or business decision is not
                included unless separately agreed.
              </p>
            </TermsCard>

            {/* 13 */}
            <TermsCard title="13. Historical Legal Matters">
              <p>
                Legal Desk membership generally applies to new matters
                initiated after commencement of the membership.
              </p>

              <p className="mt-5">
                The following are treated as separate assignments unless
                specifically agreed otherwise:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Existing lawsuits</li>
                <li>Pending court cases</li>
                <li>Previous legal notices</li>
                <li>Historical contractual disputes</li>
                <li>Existing arbitration proceedings</li>
                <li>Previous IP disputes</li>
                <li>Regulatory proceedings</li>
                <li>Legacy compliance matters</li>
                <li>Existing litigation or claims</li>
              </ol>

              <p className="mt-5">
                The member must disclose any known ongoing legal proceedings or
                material disputes during onboarding.
              </p>
            </TermsCard>

            {/* 14 */}
            <TermsCard title="14. Member Responsibilities">
              <p>The member agrees to:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Provide complete and accurate information.</li>
                <li>Provide all relevant contracts and documents.</li>
                <li>Disclose material facts relevant to the matter.</li>
                <li>Respond to clarification requests promptly.</li>
                <li>Review and approve documents before execution.</li>
                <li>Make statutory and third-party payments on time.</li>
                <li>
                  Attend hearings or provide required authorizations where
                  applicable.
                </li>
              </ol>

              <p className="mt-5">
                i-VANTAGE shall not be responsible for consequences arising
                from incomplete, inaccurate, misleading, or withheld
                information supplied by the member.
              </p>
            </TermsCard>

            {/* 15 */}
            <TermsCard title="15. Processing Timelines">
              <p>
                Legal work is undertaken after receipt of complete information
                and documents required for the assignment.
              </p>

              <p className="mt-5">
                Standard processing timelines may vary depending upon:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Document length</li>
                <li>Complexity</li>
                <li>Number of documents</li>
                <li>Number of parties involved</li>
                <li>Required revisions</li>
                <li>Specialist involvement</li>
                <li>Government or regulatory processes</li>
              </ol>

              <p className="mt-5 font-semibold">
                Priority Processing means priority within the i-VANTAGE
                workflow. It does not guarantee completion within a specific
                number of hours or days unless a specific timeline has been
                agreed in writing.
              </p>
            </TermsCard>

            {/* 16 */}
            <TermsCard title="16. Confidentiality">
              <p>
                Information and documents shared by members for the purpose of
                receiving Legal Desk services shall be handled with reasonable
                confidentiality and used for providing the requested services.
              </p>

              <p className="mt-5">
                Members should provide documents through designated secure
                communication or document-sharing channels wherever available.
              </p>

              <p className="mt-5">
                Where external lawyers, consultants, or specialist partners
                are involved, relevant information may be shared with them to
                the extent necessary to provide the requested service.
              </p>
            </TermsCard>

            {/* 17 */}
            <TermsCard title="17. No Guarantee of Legal Outcome">
              <p>
                i-VANTAGE provides legal support, documentation, coordination,
                and access to legal professionals within the agreed scope.
              </p>

              <p className="mt-5">
                No guarantee is provided regarding:
              </p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Court outcomes</li>
                <li>Arbitration outcomes</li>
                <li>Settlement outcomes</li>
                <li>Trademark registration</li>
                <li>Patent approval</li>
                <li>Copyright registration</li>
                <li>Contract enforcement</li>
                <li>Recovery of money</li>
                <li>Resolution of disputes</li>
                <li>Government or regulatory decisions</li>
                <li>Acceptance of any legal filing</li>
              </ol>

              <p className="mt-5">
                Legal outcomes depend upon applicable law, facts, evidence,
                authorities, courts, counterparties, and other circumstances
                beyond the control of i-VANTAGE.
              </p>
            </TermsCard>

            {/* 18 */}
            <TermsCard title="18. Third-Party Legal Professionals">
              <p>
                Certain matters may require specialized advocates, patent
                attorneys, trademark professionals, or other legal
                specialists.
              </p>

              <p className="mt-5">
                i-VANTAGE may facilitate access to such professionals.
              </p>

              <p className="mt-5">
                Their professional fees, appearance fees, filing fees, travel
                expenses, and other charges shall be payable separately unless
                expressly included in a written proposal.
              </p>
            </TermsCard>

            {/* 19 */}
            <TermsCard title="19. Fair Usage Policy">
              <p>
                Legal Desk services are intended for routine business
                requirements and are subject to reasonable usage limits.
              </p>

              <p className="mt-5">
                High-volume or complex requirements, including multiple
                contracts, numerous negotiations, repeated legal reviews,
                extensive documentation, litigation matters, or specialized
                legal assignments, may require a separate retainer or project
                engagement.
              </p>
            </TermsCard>

            {/* 20 */}
            <TermsCard title="20. Member Approval & Commercial Decisions">
              <p>The member remains responsible for:</p>

              <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#1E5BFF]">
                <li>Signing contracts</li>
                <li>Accepting commercial terms</li>
                <li>Entering into transactions</li>
                <li>Hiring or terminating employees</li>
                <li>Settling disputes</li>
                <li>Filing claims</li>
                <li>Making business decisions</li>
              </ol>

              <p className="mt-5">
                Review or approval of a document by the Legal Desk does not
                transfer responsibility for the member&apos;s commercial decisions
                to i-VANTAGE.
              </p>
            </TermsCard>

            {/* 21 */}
            <TermsCard title="21. Limitation of Responsibility">
              <p>
                i-VANTAGE provides legal support and coordination within the
                agreed scope of service.
              </p>

              <p className="mt-5">
                The member acknowledges that legal review is based on the
                information and documents made available at the time of
                review.
              </p>

              <p className="mt-5">
                No legal review can eliminate every possible commercial,
                legal, financial, or operational risk.
              </p>

              <p className="mt-5">
                i-VANTAGE shall not be responsible for losses arising from
                undisclosed facts, actions of third parties, changes in law,
                counterparty conduct, Government decisions, or commercial
                decisions taken by the member.
              </p>
            </TermsCard>

            {/* 22 */}
            <TermsCard title="22. Modification of Services">
              <p>
                i-VANTAGE reserves the right to modify, update, suspend, or
                discontinue any Legal Desk service, operational process,
                partner engagement, or membership benefit without prior
                notice, subject to applicable law.
              </p>
            </TermsCard>

            {/* 23 */}
            <TermsCard title="23. Acceptance of Terms">
              <p>
                By availing any Legal Desk service, the member confirms that
                they have read, understood, and agreed to these Terms of Use.
              </p>

              <p className="mt-5">
                The member acknowledges that{" "}
                <strong>
                  i-VANTAGE provides business-oriented legal support,
                  documentation, coordination, and access to appropriate legal
                  professionals within the agreed scope. It does not provide
                  unlimited in-house legal counsel, guarantee legal outcomes,
                  or assume responsibility for the member&apos;s legal,
                  commercial, contractual, regulatory, or litigation decisions.
                </strong>
              </p>
            </TermsCard>

          </div>
        </Container>
      </section>
    </main>
  );
}