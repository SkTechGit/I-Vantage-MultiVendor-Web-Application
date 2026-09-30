import Container from "@/components/common/Container";

const sections = [
  {
    title: "1. General Refund Principle",
    content: (
      <>
        <p>
          i-VANTAGE provides a combination of workspace access, professional
          assistance, coordination, administrative services, and third-party
          professional services.
        </p>

        <p className="mt-4">
          Because certain services involve advance allocation of resources,
          professional time, third-party costs, bookings, or work that begins
          immediately after payment, <strong>not all payments are refundable</strong>.
        </p>

        <p className="mt-4">Refund eligibility depends on:</p>

        <ul>
          <li>The type of service purchased</li>
          <li>Whether service delivery has started</li>
          <li>Whether third-party costs have already been incurred</li>
          <li>The applicable membership agreement</li>
          <li>The reason for the refund request</li>
          <li>Any specific terms communicated at the time of purchase</li>
        </ul>
      </>
    ),
  },

  {
    title: "2. Coworking & Workspace Memberships",
    content: (
      <>
        <p>
          Workspace memberships are governed primarily by the applicable{" "}
          <strong>Workspace Agreement/Membership Agreement</strong>.
        </p>

        <p className="mt-4">
          Unless otherwise stated in the applicable agreement:
        </p>

        <ul>
          <li>Membership fees are payable according to the agreed billing cycle.</li>
          <li>
            Once a membership period has commenced, fees for that period are
            generally non-refundable.
          </li>
          <li>
            Unused coworking days, seats, meeting-room credits, printing
            credits, or other unused benefits do not automatically qualify for
            a refund.
          </li>
          <li>
            Temporary non-use of the workspace does not automatically suspend
            or reduce membership fees.
          </li>
          <li>
            Security deposits, where applicable, are governed by the relevant
            workspace agreement.
          </li>
        </ul>

        <p className="mt-4">
          If a member cancels before the commencement of the membership, any
          refund will be subject to the cancellation terms communicated at the
          time of booking.
        </p>
      </>
    ),
  },

  {
    title: "3. Business Support Services",
    content: (
      <>
        <p>
          For Business Support Services, refund eligibility depends on whether
          i-VANTAGE has already started performing the requested service.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          Before Service Commencement
        </h3>

        <p className="mt-3">
          If a service has been paid for but work has <strong>not yet commenced</strong>,
          the member may request cancellation.
        </p>

        <p className="mt-4">
          Where approved, i-VANTAGE may refund the amount paid after deducting
          any:
        </p>

        <ul>
          <li>Payment gateway charges</li>
          <li>Administrative charges</li>
          <li>Third-party charges already incurred</li>
          <li>Other non-recoverable costs</li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          After Service Commencement
        </h3>

        <p className="mt-3">
          Once professional work has commenced, the service fee may become{" "}
          <strong>non-refundable</strong>, because resources may already have
          been allocated and work may have been performed.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Application preparation</li>
          <li>Document review</li>
          <li>Accounting work</li>
          <li>Legal drafting</li>
          <li>Design work</li>
          <li>Website development</li>
          <li>Marketing work</li>
          <li>HR processing</li>
          <li>Technical configuration</li>
          <li>Business consultation</li>
          <li>Filing preparation</li>
        </ul>
      </>
    ),
  },

  {
    title: "4. Professional Assistance Included",
    content: (
      <>
        <p>Where a membership states:</p>

        <blockquote className="mt-4 rounded-xl border-l-4 border-[#1E5BFF] bg-blue-50 p-4 font-semibold text-[#0A1F66]">
          Professional Assistance Included
        </blockquote>

        <p className="mt-4">
          this means that the applicable professional service component is
          included within the membership according to its stated scope and
          fair-use limits.
        </p>

        <p className="mt-4">
          It does <strong>not</strong> mean that all associated government
          fees, statutory payments, third-party charges, software costs, filing
          fees, taxes, or external professional charges are included.
        </p>

        <p className="mt-4">
          Such costs are generally non-refundable once paid or committed.
        </p>
      </>
    ),
  },

  {
    title: "5. Government & Statutory Fees",
    content: (
      <>
        <p>
          Government and statutory payments are generally{" "}
          <strong>non-refundable by i-VANTAGE</strong> once submitted or paid
          to the relevant authority.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Government filing fees</li>
          <li>Stamp duty</li>
          <li>Trademark filing fees</li>
          <li>MCA fees</li>
          <li>GST-related payments</li>
          <li>Tax payments</li>
          <li>EPF/ESI contributions</li>
          <li>Government licence fees</li>
          <li>Registration fees</li>
          <li>Official application charges</li>
        </ul>

        <p className="mt-4">
          If a government authority itself provides a refund, i-VANTAGE may
          assist in coordinating the process where appropriate.
        </p>

        <p className="mt-4">
          However, approval of such refund remains subject to the relevant
          authority.
        </p>
      </>
    ),
  },

  {
    title: "6. Third-Party Costs",
    content: (
      <>
        <p>
          Payments made to third-party providers are generally non-refundable
          once the third-party service has been ordered, activated, consumed,
          or committed.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Domain registration</li>
          <li>Cloud hosting</li>
          <li>Software subscriptions</li>
          <li>SaaS subscriptions</li>
          <li>API usage</li>
          <li>Advertising spend</li>
          <li>Job portal fees</li>
          <li>Background verification</li>
          <li>Professional fees</li>
          <li>Printing</li>
          <li>Photography</li>
          <li>Videography</li>
          <li>Courier charges</li>
          <li>External consultant fees</li>
          <li>Government or registry fees</li>
        </ul>

        <p className="mt-4">
          Where a third party provides a refund, i-VANTAGE may pass the
          applicable refundable amount to the member after receipt, subject to
          the third party&apos;s terms.
        </p>
      </>
    ),
  },

  {
    title: "7. Business Registration & Government Applications",
    content: (
      <>
        <p>
          Payment for assistance with government registrations does not
          guarantee approval.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Company Registration</li>
          <li>GST Registration</li>
          <li>MSME Registration</li>
          <li>Startup India</li>
          <li>IEC</li>
          <li>Trademark Registration</li>
          <li>Business Licences</li>
          <li>Bank Account Assistance</li>
        </ul>

        <p className="mt-4">
          Applications may be delayed, rejected, queried, or require
          resubmission by the relevant authority.
        </p>

        <p className="mt-4">
          A rejection or delay by a government authority does not automatically
          entitle the member to a refund of the professional service fee where
          i-VANTAGE has completed the agreed scope of work.
        </p>

        <p className="mt-4">
          Where an application fails because of an error attributable to
          i-VANTAGE, the matter will be reviewed and appropriate corrective
          action may be taken within the agreed service scope.
        </p>
      </>
    ),
  },

  {
    title: "8. No Refund for Government Processing Delays",
    content: (
      <>
        <p>
          i-VANTAGE does not control the processing timelines of government
          departments, banks, regulators, registries, or third-party
          platforms.
        </p>

        <p className="mt-4">
          Accordingly, refunds will not normally be provided solely because:
        </p>

        <ul>
          <li>A government application takes longer than expected</li>
          <li>A government portal is unavailable</li>
          <li>An application receives a query</li>
          <li>An authority requests additional documents</li>
          <li>A bank delays account opening</li>
          <li>A trademark application faces an objection</li>
          <li>A registration requires resubmission</li>
        </ul>
      </>
    ),
  },

  {
    title: "9. Finance Services",
    content: (
      <>
        <p>
          Finance Desk services may involve recurring professional work.
        </p>

        <p className="mt-4">
          Once a monthly accounting, bookkeeping, payroll, tax filing, or
          compliance cycle has commenced, the corresponding service fee is
          generally non-refundable.
        </p>

        <p className="mt-4">
          If the member fails to provide required documents within the
          prescribed timeline, this does not automatically create a right to a
          refund.
        </p>

        <p className="mt-4">
          Government tax liabilities, statutory payments, penalties, interest,
          and other amounts payable by the member remain the member&apos;s
          responsibility.
        </p>
      </>
    ),
  },

  {
    title: "10. Marketing Services",
    content: (
      <>
        <p>
          Marketing services may involve significant creative and professional
          resources.
        </p>

        <p className="mt-4">
          Payments for marketing services may become non-refundable once work
          has commenced.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Graphic design</li>
          <li>Social media management</li>
          <li>Content creation</li>
          <li>Website development</li>
          <li>SEO</li>
          <li>Campaign setup</li>
          <li>Advertising management</li>
          <li>Branding</li>
          <li>Photography</li>
          <li>Video production</li>
        </ul>

        <p className="mt-4">
          Client dissatisfaction with creative preference does not
          automatically qualify for a refund where the agreed service has been
          performed.
        </p>

        <p className="mt-4">
          Applicable revision limits and project scope will apply.
        </p>
      </>
    ),
  },

  {
    title: "11. Legal Services",
    content: (
      <>
        <p>
          Legal services are generally non-refundable once professional work
          has commenced.
        </p>

        <p className="mt-4">This includes:</p>

        <ul>
          <li>Contract review</li>
          <li>Agreement drafting</li>
          <li>NDA preparation</li>
          <li>Legal documentation</li>
          <li>Trademark assistance</li>
          <li>Legal notices</li>
          <li>Legal consultations</li>
        </ul>

        <p className="mt-4">
          Payment for legal assistance does not guarantee:
        </p>

        <ul>
          <li>Trademark approval</li>
          <li>Court outcomes</li>
          <li>Settlement</li>
          <li>Dispute resolution</li>
          <li>Contract enforcement</li>
          <li>Regulatory approval</li>
        </ul>

        <p className="mt-4">
          Government filing fees, court fees, stamp duty, advocate fees, and
          other third-party legal costs are separately payable where
          applicable.
        </p>
      </>
    ),
  },

  {
    title: "12. Technology & AI Automation Services",
    content: (
      <>
        <p>
          Technology services may require advance allocation of technical
          resources.
        </p>

        <p className="mt-4">
          Payments may become non-refundable once work has commenced,
          including:
        </p>

        <ul>
          <li>Website development</li>
          <li>Website maintenance</li>
          <li>Technical configuration</li>
          <li>Hosting setup</li>
          <li>CRM configuration</li>
          <li>AI automation</li>
          <li>Workflow development</li>
          <li>Chatbot development</li>
          <li>Custom integrations</li>
        </ul>

        <p className="mt-4">
          Third-party technology costs are subject to the relevant provider&apos;s
          refund policy.
        </p>
      </>
    ),
  },

  {
    title: "13. Custom Projects",
    content: (
      <>
        <p>
          Custom projects are governed by the specific quotation, proposal,
          statement of work, or project agreement.
        </p>

        <p className="mt-4">
          Where a project requires an advance payment, the advance may become
          non-refundable once resources have been allocated or work has
          commenced.
        </p>

        <p className="mt-4">
          If the member cancels a project after commencement, i-VANTAGE may
          charge for:
        </p>

        <ul>
          <li>Work completed</li>
          <li>Resources allocated</li>
          <li>Third-party costs</li>
          <li>Materials purchased</li>
          <li>Development completed</li>
          <li>Professional time already used</li>
        </ul>

        <p className="mt-4">
          Any remaining refundable balance, if applicable, will be calculated
          after these deductions.
        </p>
      </>
    ),
  },

  {
    title: "14. Membership Cancellation",
    content: (
      <>
        <p>
          Cancellation of an i-VANTAGE membership does not automatically result
          in a refund.
        </p>

        <p className="mt-4">
          Where a membership includes recurring services, cancellation will
          normally take effect according to the applicable membership agreement
          and billing terms.
        </p>

        <p className="mt-4">
          Services already delivered or periods already commenced will
          generally not be refunded unless specifically provided for under the
          applicable agreement.
        </p>
      </>
    ),
  },

  {
    title: "15. Duplicate Payments",
    content: (
      <>
        <p>
          If a customer accidentally makes a duplicate payment for the same
          service, the customer may request a refund of the duplicate amount.
        </p>

        <p className="mt-4">
          After verification, the refundable amount may be returned through the
          original payment method or another appropriate method.
        </p>
      </>
    ),
  },

  {
    title: "16. Failed or Unsuccessful Transactions",
    content: (
      <>
        <p>
          If a payment is deducted from the customer&apos;s bank account but the
          transaction is not successfully recorded by i-VANTAGE, the customer
          should contact us with the transaction details.
        </p>

        <p className="mt-4">After verification, the amount may be:</p>

        <ul>
          <li>Reflected against the customer&apos;s account; or</li>
          <li>Refunded through the applicable payment system.</li>
        </ul>

        <p className="mt-4">
          Banking and payment-processing timelines may vary.
        </p>
      </>
    ),
  },

  {
    title: "17. Refunds Due to i-VANTAGE's Failure",
    content: (
      <>
        <p>
          If i-VANTAGE is unable to provide a service that has been paid for
          and the failure is attributable to i-VANTAGE, we may, depending on
          the circumstances:
        </p>

        <ul>
          <li>Correct the issue</li>
          <li>Provide the service at a later date</li>
          <li>Offer an alternative service</li>
          <li>Provide a partial refund</li>
          <li>Provide a full refund</li>
        </ul>

        <p className="mt-4">
          The appropriate remedy will depend on the nature of the service, work
          already completed, and applicable contractual terms.
        </p>
      </>
    ),
  },

  {
    title: "18. Client-Caused Delays",
    content: (
      <>
        <p>
          A refund will generally not be provided where service delivery is
          delayed or cannot be completed because the member:
        </p>

        <ul>
          <li>Does not provide required documents</li>
          <li>Provides incorrect information</li>
          <li>Does not provide necessary access</li>
          <li>Fails to respond to requests</li>
          <li>Does not make required third-party payments</li>
          <li>Fails to complete required verification</li>
          <li>Changes the scope of the assignment</li>
          <li>Becomes unavailable for required approvals</li>
        </ul>

        <p className="mt-4">
          Where additional work is required because of such circumstances,
          additional charges may apply.
        </p>
      </>
    ),
  },

  {
    title: "19. Change of Mind",
    content: (
      <>
        <p>
          A change of mind after service commencement does not automatically
          qualify for a refund.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>Deciding not to launch the business</li>
          <li>Deciding not to use the service</li>
          <li>Choosing another service provider</li>
          <li>Deciding not to proceed with a registration</li>
          <li>Changing business plans</li>
          <li>No longer requiring the service</li>
        </ul>

        <p className="mt-4">
          Refunds, where applicable, will be considered according to the
          specific service terms.
        </p>
      </>
    ),
  },

  {
    title: "20. Service Results & Refunds",
    content: (
      <>
        <p>
          Payment for a service does not constitute a guarantee of a particular
          business outcome.
        </p>

        <p className="mt-4">
          Refunds will not normally be provided solely because the member did
          not achieve the expected commercial result.
        </p>

        <p className="mt-4">This includes:</p>

        <ul>
          <li>No sales generated</li>
          <li>No investor funding</li>
          <li>No leads</li>
          <li>No customer acquisition</li>
          <li>No SEO ranking</li>
          <li>No employee hired</li>
          <li>No trademark approval</li>
          <li>No bank account approval</li>
          <li>No government registration approval</li>
          <li>No business growth</li>
        </ul>

        <p className="mt-4">
          Where i-VANTAGE has delivered the agreed professional assistance
          within the defined scope, the absence of a desired external outcome
          does not automatically create a refund entitlement.
        </p>
      </>
    ),
  },

  {
    title: "21. How to Request a Refund",
    content: (
      <>
        <p>
          Refund requests should be submitted through the official i-VANTAGE
          customer support channel.
        </p>

        <p className="mt-4">Please provide:</p>

        <ul>
          <li>Name</li>
          <li>Company name</li>
          <li>Registered mobile number</li>
          <li>Email address</li>
          <li>Service purchased</li>
          <li>Payment date</li>
          <li>Transaction/reference number</li>
          <li>Reason for requesting the refund</li>
        </ul>

        <p className="mt-4">
          Requests should preferably be submitted within{" "}
          <strong>7 days of the relevant payment or service event</strong>,
          unless a different period is specified in the applicable agreement.
        </p>

        <p className="mt-4">
          Submission of a refund request does not automatically mean that the
          refund will be approved.
        </p>
      </>
    ),
  },

  {
    title: "22. Refund Review Process",
    content: (
      <>
        <p>Upon receiving a refund request, i-VANTAGE may review:</p>

        <ul>
          <li>The applicable service agreement</li>
          <li>Membership plan</li>
          <li>Service scope</li>
          <li>Work already completed</li>
          <li>Documents submitted</li>
          <li>Third-party costs incurred</li>
          <li>Government payments made</li>
          <li>Communication records</li>
          <li>Payment records</li>
        </ul>

        <p className="mt-4">
          We may contact the member for additional information before reaching
          a decision.
        </p>
      </>
    ),
  },

  {
    title: "23. Approved Refunds",
    content: (
      <>
        <p>
          Where a refund is approved, it will generally be processed through
          the original payment method, where technically possible.
        </p>

        <p className="mt-4">
          The time taken for the amount to appear in the customer&apos;s account may
          depend on:
        </p>

        <ul>
          <li>Payment gateway</li>
          <li>Bank</li>
          <li>Card issuer</li>
          <li>Payment method</li>
          <li>Banking holidays</li>
          <li>Other financial institutions</li>
        </ul>

        <p className="mt-4">
          Any non-refundable payment gateway or third-party charges may be
          deducted where applicable.
        </p>
      </>
    ),
  },

  {
    title: "24. No Double Recovery",
    content: (
      <p>
        Where a third party, government authority, bank, or other service
        provider has already refunded an amount to the member, i-VANTAGE will
        not be responsible for providing a duplicate refund for the same
        amount.
      </p>
    ),
  },

  {
    title: "25. Fraudulent or Abusive Refund Claims",
    content: (
      <>
        <p>
          i-VANTAGE reserves the right to reject refund requests that involve:
        </p>

        <ul>
          <li>Fraudulent transactions</li>
          <li>False information</li>
          <li>Misrepresentation</li>
          <li>Abuse of services</li>
          <li>Repeated unreasonable refund requests</li>
          <li>Unauthorized use of another person&apos;s payment method</li>
          <li>Attempts to obtain services without payment</li>
        </ul>

        <p className="mt-4">
          Where appropriate, i-VANTAGE may suspend the relevant account or
          service.
        </p>
      </>
    ),
  },

  {
    title: "26. Policy for Promotional Offers",
    content: (
      <>
        <p>
          Promotional, discounted, complimentary, introductory, or special-offer
          services may have separate refund conditions.
        </p>

        <p className="mt-4">
          Where a promotional offer specifies a different refund or
          cancellation policy, the terms of that offer will apply.
        </p>

        <p className="mt-4">
          Complimentary services do not have a cash value and cannot normally
          be exchanged for cash or converted into a refund.
        </p>
      </>
    ),
  },

  {
    title: "27. Amendments to This Refund Policy",
    content: (
      <>
        <p>
          i-VANTAGE may update this Refund Policy from time to time to reflect
          changes in:
        </p>

        <ul>
          <li>Services</li>
          <li>Pricing</li>
          <li>Business practices</li>
          <li>Payment systems</li>
          <li>Legal requirements</li>
          <li>Operational procedures</li>
        </ul>

        <p className="mt-4">
          The latest version published on the website will apply to future
          transactions, subject to applicable law and existing contractual
          commitments.
        </p>
      </>
    ),
  },

  {
    title: "28. Contact Information",
    content: (
      <>
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="font-semibold text-[#0A1F66]">i-VANTAGE</p>
          <p>Operated by Asset Sense Private Limited</p>

          <p className="mt-4">
            <strong>Website:</strong>{" "}
            <a
              href="http://www.i-vantage.in/"
              className="break-all text-[#1E5BFF] hover:underline"
            >
              www.i-vantage.in
            </a>
          </p>

          <p>
            <strong>Customer Support:</strong> (+91) 9907 800 600
          </p>

          <p>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:info@i-vantage.in"
              className="break-all text-[#1E5BFF] hover:underline"
            >
              info@i-vantage.in
            </a>
          </p>
        </div>

        <p className="mt-4">
          For refund-related queries, please provide your transaction/reference
          number so that we can locate the relevant payment and service
          details.
        </p>
      </>
    ),
  },

  {
    title: "29. Acceptance of This Refund Policy",
    content: (
      <>
        <p>
          By making a payment for any i-VANTAGE service, the customer confirms
          that they have read and understood this Refund Policy.
        </p>

        <p className="mt-6 font-semibold text-[#0A1F66]">
          i-VANTAGE aims to deal with refund requests fairly and transparently.
          Refund eligibility depends on the nature of the service, whether
          work has commenced, third-party and statutory costs incurred, and the
          specific terms applicable to the customer&apos;s purchase or membership.
        </p>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Page Header */}
      <section className="border-b bg-white">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">

            <div className="max-w-4xl">

              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1E5BFF]">
                Legal
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#0A1F66] sm:text-5xl lg:text-6xl">
                Refund Policy – i-VANTAGE
              </h1>

              <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:gap-6">
                <p>
                  <span className="font-semibold text-slate-700">
                    Effective Date:
                  </span>{" "}
                  12/August/2026
                </p>

                <p>
                  <span className="font-semibold text-slate-700">
                    Last Updated:
                  </span>{" "}
                  12/August/2026
                </p>
              </div>

              <div className="mt-8 space-y-4 text-base leading-7 text-slate-600 sm:text-lg">

                <p>
                  i-VANTAGE is a business support services brand operated by{" "}
                  <strong className="text-slate-900">
                    Asset Sense Private Limited
                  </strong>{" "}
                  (&quot;i-VANTAGE&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                </p>

                <p>
                  This Refund Policy explains the circumstances under which
                  payments made for i-VANTAGE services, memberships,
                  workspace-related services, business support services, and
                  other offerings may or may not be refunded.
                </p>

                <p>
                  By purchasing or subscribing to any i-VANTAGE service, you
                  acknowledge and agree to this Refund Policy.
                </p>

              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* Policy Sections */}
      <section className="py-10 sm:py-14 lg:py-20">
        <Container>

          <div className="mx-auto max-w-5xl">

            <div className="space-y-6">

              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-9"
                >

                  <h2 className="text-xl font-bold leading-tight text-[#0A1F66] sm:text-2xl">
                    {section.title}
                  </h2>

                  <div className="policy-content mt-5 text-sm leading-7 text-slate-600 sm:text-base">
                    {section.content}
                  </div>

                </section>
              ))}

            </div>

          </div>

        </Container>
      </section>

    </main>
  );
}