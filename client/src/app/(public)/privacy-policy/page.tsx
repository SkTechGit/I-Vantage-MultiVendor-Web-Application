import Container from "@/components/common/Container";

const sections = [
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          Depending on how you interact with us, we may collect the following
          information.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          A. Information You Provide
        </h3>

        <p className="mt-3">This may include:</p>

        <ul>
          <li>Name</li>
          <li>Company/business name</li>
          <li>Mobile number</li>
          <li>Email address</li>
          <li>Business address</li>
          <li>Billing address</li>
          <li>GST details</li>
          <li>PAN/TAN details</li>
          <li>Website or social media links</li>
          <li>Business type and industry</li>
          <li>Number of employees</li>
          <li>Workspace requirements</li>
          <li>Services requested</li>
          <li>Documents submitted for service delivery</li>
          <li>Payment and transaction information</li>
          <li>Information provided through enquiry forms</li>
          <li>
            Information provided through WhatsApp, telephone, email, or other
            communication channels
          </li>
        </ul>

        <p className="mt-4">
          For certain business support services, you may voluntarily provide
          documents containing additional personal or business information.
        </p>
      </>
    ),
  },

  {
    title: "2. Information Collected Automatically",
    content: (
      <>
        <p>
          When you visit our website, certain information may be collected
          automatically, including:
        </p>

        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Pages visited</li>
          <li>Date and time of visits</li>
          <li>Approximate location derived from technical information</li>
          <li>Referral source</li>
          <li>Website interaction information</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <p className="mt-4">
          We use this information primarily to operate, secure, analyse, and
          improve our website and services.
        </p>
      </>
    ),
  },

  {
    title: "3. Information Collected Through Enquiry Forms",
    content: (
      <>
        <p>
          If you submit an enquiry through our website, we may collect
          information such as:
        </p>

        <ul>
          <li>Name</li>
          <li>Mobile number</li>
          <li>Email</li>
          <li>Company name</li>
          <li>Location</li>
          <li>Number of seats required</li>
          <li>Business support requirements</li>
          <li>Preferred service or Business Desk</li>
          <li>Additional information voluntarily provided by you</li>
        </ul>

        <p className="mt-4">
          We use this information to understand your requirements and contact
          you regarding relevant i-VANTAGE services.
        </p>
      </>
    ),
  },

  {
    title: "4. How We Use Your Information",
    content: (
      <>
        <p>We may use personal information for the following purposes:</p>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          Providing Services
        </h3>

        <p className="mt-3">To:</p>

        <ul>
          <li>Process service requests</li>
          <li>Provide business support services</li>
          <li>Manage coworking memberships</li>
          <li>Process registrations and applications</li>
          <li>
            Provide accounting, HR, legal, marketing, technology, and other
            requested services
          </li>
          <li>Communicate regarding ongoing assignments</li>
          <li>Manage appointments and meetings</li>
          <li>Process payments</li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          Customer Communication
        </h3>

        <p className="mt-3">To:</p>

        <ul>
          <li>Respond to enquiries</li>
          <li>Contact you regarding requested services</li>
          <li>Send service-related notifications</li>
          <li>Provide updates</li>
          <li>Respond to support requests</li>
          <li>Obtain information required to complete a service</li>
        </ul>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          Business Development & Marketing
        </h3>

        <p className="mt-3">
          Where permitted and where you have provided the required consent or
          otherwise allowed under applicable law, we may use your contact
          information to send:
        </p>

        <ul>
          <li>Service updates</li>
          <li>Offers</li>
          <li>Business information</li>
          <li>Events and workshops</li>
          <li>Newsletters</li>
          <li>Educational content</li>
          <li>i-VANTAGE announcements</li>
        </ul>

        <p className="mt-4">
          You may opt out of promotional communications at any time.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-[#0A1F66]">
          Website & Business Improvement
        </h3>

        <p className="mt-3">We may use information to:</p>

        <ul>
          <li>Understand how visitors use our website</li>
          <li>Improve website functionality</li>
          <li>Improve our services</li>
          <li>Measure marketing campaigns</li>
          <li>Understand customer requirements</li>
          <li>Develop new services</li>
          <li>Prevent fraud and misuse</li>
        </ul>
      </>
    ),
  },

  {
    title: "5. Business Support Services & Sensitive Documents",
    content: (
      <>
        <p>
          Certain i-VANTAGE services may require you to provide business,
          financial, employment, legal, tax, identity, or other documentation.
        </p>

        <p className="mt-4">Examples may include documents required for:</p>

        <ul>
          <li>Company registration</li>
          <li>GST registration</li>
          <li>Accounting</li>
          <li>Tax compliance</li>
          <li>Payroll</li>
          <li>HR services</li>
          <li>Legal documentation</li>
          <li>Trademark applications</li>
          <li>Banking assistance</li>
          <li>Business licences</li>
        </ul>

        <p className="mt-4">
          We use such information only to the extent reasonably necessary to
          provide the requested service or fulfil applicable legal,
          contractual, or operational requirements.
        </p>

        <p className="mt-4">
          You should provide only the information and documents reasonably
          required for the service.
        </p>
      </>
    ),
  },

  {
    title: "6. Sharing Information With Service Providers",
    content: (
      <>
        <p>
          To provide certain services, i-VANTAGE may share relevant information
          with trusted service providers, professional partners, consultants,
          technology providers, or other parties involved in delivering the
          requested service.
        </p>

        <p className="mt-4">Depending on the service, these may include:</p>

        <ul>
          <li>Chartered Accountants</li>
          <li>Company Secretaries</li>
          <li>Advocates and legal professionals</li>
          <li>HR consultants</li>
          <li>Recruitment partners</li>
          <li>Marketing professionals</li>
          <li>Technology providers</li>
          <li>Cloud and software providers</li>
          <li>Payment processors</li>
          <li>Government portals and authorities</li>
          <li>Banks and financial institutions</li>
          <li>Courier and logistics providers</li>
        </ul>

        <p className="mt-4">
          We aim to share only the information reasonably required for the
          relevant purpose.
        </p>

        <p className="mt-4">
          Where appropriate, service providers may process information on our
          behalf subject to contractual or other applicable safeguards.
        </p>
      </>
    ),
  },

  {
    title: "7. Government Authorities & Statutory Requirements",
    content: (
      <>
        <p>
          Certain i-VANTAGE services require information to be submitted to
          government departments, regulators, statutory authorities, banks,
          registries, or other authorised entities.
        </p>

        <p className="mt-4">Examples include:</p>

        <ul>
          <li>MCA</li>
          <li>GST authorities</li>
          <li>Income Tax authorities</li>
          <li>EPFO</li>
          <li>ESIC</li>
          <li>Trademark Registry</li>
          <li>DGFT</li>
          <li>Banks</li>
          <li>Other relevant government or regulatory authorities</li>
        </ul>

        <p className="mt-4">
          Where submission is required to provide the requested service or
          comply with applicable law, the relevant information may be shared
          with the appropriate authority.
        </p>
      </>
    ),
  },

  {
    title: "8. Payment Information",
    content: (
      <>
        <p>
          Payments may be processed through third-party payment gateways,
          banks, or other payment service providers.
        </p>

        <p className="mt-4">
          i-VANTAGE may receive transaction-related information such as:
        </p>

        <ul>
          <li>Payment status</li>
          <li>Transaction reference</li>
          <li>Amount</li>
          <li>Date of payment</li>
          <li>Payment method</li>
        </ul>

        <p className="mt-4">
          We generally do not require or store your complete card, banking, or
          payment credentials on our website unless specifically stated.
        </p>

        <p className="mt-4">
          Third-party payment providers may have their own privacy policies and
          terms.
        </p>
      </>
    ),
  },

  {
    title: "9. Cookies",
    content: (
      <>
        <p>
          Our website may use cookies and similar technologies.
        </p>

        <p className="mt-4">Cookies may help us:</p>

        <ul>
          <li>Keep the website functioning</li>
          <li>Remember preferences</li>
          <li>Understand website usage</li>
          <li>Measure advertising performance</li>
          <li>Improve user experience</li>
          <li>Analyse traffic</li>
        </ul>

        <p className="mt-4">
          Where required, we will provide appropriate controls for cookie
          preferences.
        </p>

        <p className="mt-4">
          You may also control cookies through your browser settings, although
          disabling certain cookies may affect website functionality.
        </p>
      </>
    ),
  },

  {
    title: "10. Advertising & Analytics",
    content: (
      <>
        <p>
          We may use third-party analytics and advertising platforms to
          understand website traffic and measure marketing campaigns.
        </p>

        <p className="mt-4">
          These platforms may use cookies, pixels, tags, or similar
          technologies.
        </p>

        <p className="mt-4">They may collect information such as:</p>

        <ul>
          <li>Pages visited</li>
          <li>Website interactions</li>
          <li>Device information</li>
          <li>Advertising interactions</li>
          <li>Approximate geographic information</li>
        </ul>

        <p className="mt-4">
          Examples may include analytics, search advertising, social media
          advertising, and conversion measurement services.
        </p>

        <p className="mt-4">
          Such third parties process information according to their own
          policies and applicable law.
        </p>
      </>
    ),
  },

  {
    title: "11. WhatsApp, Telephone & Other Communications",
    content: (
      <>
        <p>
          If you contact us through WhatsApp, telephone, email, SMS, social
          media, or another communication channel, we may retain relevant
          communication records for:
        </p>

        <ul>
          <li>Responding to your enquiry</li>
          <li>Providing services</li>
          <li>Customer support</li>
          <li>Quality monitoring</li>
          <li>Dispute resolution</li>
          <li>Internal records</li>
        </ul>

        <p className="mt-4">
          We may also use approved communication platforms or service providers
          to manage customer communication.
        </p>
      </>
    ),
  },

  {
    title: "12. Data Security",
    content: (
      <>
        <p>
          We take reasonable technical and organisational measures to protect
          personal information against unauthorised access, misuse, alteration,
          disclosure, loss, or destruction.
        </p>

        <p className="mt-4">These measures may include:</p>

        <ul>
          <li>Access controls</li>
          <li>Password protection</li>
          <li>Restricted access to customer information</li>
          <li>Secure systems</li>
          <li>Authentication controls</li>
          <li>Staff and partner confidentiality requirements</li>
          <li>Monitoring and security procedures</li>
        </ul>

        <p className="mt-4">
          However, no electronic transmission or storage system can be
          guaranteed to be completely secure.
        </p>
      </>
    ),
  },

  {
    title: "13. Data Retention",
    content: (
      <>
        <p>
          We retain personal information only for as long as reasonably
          necessary for the purposes for which it was collected, including:
        </p>

        <ul>
          <li>Providing services</li>
          <li>Maintaining business records</li>
          <li>Fulfilling contractual obligations</li>
          <li>Complying with legal and regulatory requirements</li>
          <li>Resolving disputes</li>
          <li>Preventing fraud</li>
          <li>Maintaining financial and accounting records</li>
        </ul>

        <p className="mt-4">
          The appropriate retention period may vary depending on the type of
          information and the purpose for which it was collected.
        </p>

        <p className="mt-4">
          When information is no longer required, we may delete, anonymise, or
          securely dispose of it, subject to applicable legal requirements.
        </p>
      </>
    ),
  },

  {
    title: "14. Your Rights",
    content: (
      <>
        <p>
          Subject to applicable law, you may have rights relating to your
          personal information, including the ability to:
        </p>

        <ul>
          <li>
            Request information about the processing of your personal data
          </li>
          <li>Request correction of inaccurate information</li>
          <li>Request updating of information</li>
          <li>
            Withdraw consent where consent is the basis for processing
          </li>
          <li>Request deletion or erasure where applicable</li>
          <li>
            Raise a grievance regarding the processing of your personal
            information
          </li>
        </ul>

        <p className="mt-4">
          The Digital Personal Data Protection Act, 2023 establishes a
          framework for processing digital personal data in India, including
          provisions concerning notice, consent, withdrawal of consent, and
          rights of individuals. The Government notified the Digital Personal
          Data Protection Rules, 2025 on 14 November 2025, with provisions
          being brought into force according to the notified phased
          commencement schedule.
        </p>

        <p className="mt-4">
          The availability and timing of particular rights may depend on
          whether the relevant provisions of applicable law are in force and on
          the circumstances of the processing.
        </p>
      </>
    ),
  },

  {
    title: "15. Withdrawal of Consent",
    content: (
      <>
        <p>
          Where we process personal information based on your consent, you may
          withdraw that consent by contacting us using the details provided
          below.
        </p>

        <p className="mt-4">
          Withdrawal of consent will not affect the lawfulness of processing
          carried out before withdrawal.
        </p>

        <p className="mt-4">
          Please note that withdrawing consent may affect our ability to
          provide certain services where the information is necessary for those
          services or where continued processing is otherwise permitted or
          required by law.
        </p>
      </>
    ),
  },

  {
    title: "16. Marketing Communications",
    content: (
      <>
        <p>You may opt out of promotional communications by:</p>

        <ul>
          <li>Using the unsubscribe option provided in an email;</li>
          <li>
            Responding to the relevant communication with an opt-out request;
          </li>
          <li>Contacting us using the details provided below.</li>
        </ul>

        <p className="mt-4">
          Even if you opt out of marketing communications, we may continue
          sending essential service-related communications, such as payment
          confirmations, service updates, account notifications, and
          information necessary to fulfil an ongoing service.
        </p>
      </>
    ),
  },

  {
    title: "17. Children's Privacy",
    content: (
      <>
        <p>
          Our services are intended for businesses, founders, professionals,
          organisations, and adults.
        </p>

        <p className="mt-4">
          Our website is not intended to knowingly collect personal information
          from children for commercial purposes.
        </p>

        <p className="mt-4">
          If you believe that a child has provided personal information to us,
          please contact us so that we can review and take appropriate action.
        </p>
      </>
    ),
  },

  {
    title: "18. Third-Party Websites",
    content: (
      <>
        <p>
          Our website may contain links to third-party websites, platforms,
          applications, or services.
        </p>

        <p className="mt-4">
          These third parties operate independently and may have their own
          privacy policies.
        </p>

        <p className="mt-4">
          i-VANTAGE is not responsible for the privacy practices, security,
          content, or policies of third-party websites.
        </p>

        <p className="mt-4">
          We encourage users to review the privacy policies of third-party
          services before providing them with personal information.
        </p>
      </>
    ),
  },

  {
    title: "19. Business Support Partners",
    content: (
      <>
        <p>
          Some i-VANTAGE services may be delivered with the assistance of
          independent professionals or specialist partners.
        </p>

        <p className="mt-4">
          Where necessary, information relevant to the requested service may be
          shared with such partners.
        </p>

        <p className="mt-4">
          Partners may include professionals working in areas such as:
        </p>

        <ul>
          <li>Finance</li>
          <li>Taxation</li>
          <li>Legal</li>
          <li>HR</li>
          <li>Recruitment</li>
          <li>Marketing</li>
          <li>Technology</li>
          <li>Business consulting</li>
        </ul>

        <p className="mt-4">
          Where applicable, the processing of information by such partners may
          also be governed by their own privacy obligations.
        </p>
      </>
    ),
  },

  {
    title: "20. Accuracy of Information",
    content: (
      <>
        <p>
          You are responsible for providing accurate, complete, and up-to-date
          information when submitting an enquiry or requesting a service.
        </p>

        <p className="mt-4">
          Incorrect or incomplete information may result in:
        </p>

        <ul>
          <li>Delayed service delivery</li>
          <li>Failed applications</li>
          <li>Incorrect filings</li>
          <li>Communication problems</li>
          <li>Additional service requirements</li>
        </ul>

        <p className="mt-4">
          i-VANTAGE is not responsible for consequences arising solely from
          inaccurate or incomplete information provided by you.
        </p>
      </>
    ),
  },

  {
    title: "21. Data Breach & Security Incidents",
    content: (
      <>
        <p>
          If we become aware of a personal data breach requiring notification
          under applicable law, we will take appropriate steps in accordance
          with applicable legal requirements.
        </p>

        <p className="mt-4">This may include:</p>

        <ul>
          <li>Investigating the incident</li>
          <li>Taking steps to contain the incident</li>
          <li>Implementing remedial measures</li>
          <li>Notifying affected persons where required</li>
          <li>Notifying relevant authorities where required</li>
        </ul>
      </>
    ),
  },

  {
    title: "22. Changes to This Privacy Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect:
        </p>

        <ul>
          <li>Changes in our services</li>
          <li>Changes in technology</li>
          <li>Changes in business practices</li>
          <li>Changes in applicable laws or regulations</li>
          <li>Changes in data-processing practices</li>
        </ul>

        <p className="mt-4">
          The updated version will be published on this page with a revised
          &quot;Last Updated&quot; date.
        </p>
      </>
    ),
  },

  {
    title: "23. Contact & Privacy Requests",
    content: (
      <>
        <p>
          For privacy-related questions, requests, corrections, complaints, or
          withdrawal of consent, please contact:
        </p>

        <div className="mt-5 rounded-2xl bg-slate-50 p-5">
          <p className="font-semibold">i-VANTAGE</p>
          <p>Operated by Asset Sense Private Limited</p>
          <p className="mt-3">
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
          For requests relating to personal information, please include
          sufficient information to help us identify the relevant account,
          enquiry, or service.
        </p>
      </>
    ),
  },

  {
    title: "24. Grievance Handling",
    content: (
      <>
        <p>
          If you have a concern regarding the collection, use, disclosure, or
          handling of your personal information, you may contact us using the
          contact details above.
        </p>

        <p className="mt-4">
          We will review and respond to privacy-related grievances in
          accordance with applicable law and our internal procedures.
        </p>

        <p className="mt-4">
          Where applicable law provides additional grievance or complaint
          mechanisms, those mechanisms will remain available.
        </p>
      </>
    ),
  },

  {
    title: "25. Acceptance of This Privacy Policy",
    content: (
      <>
        <p>
          By using the i-VANTAGE website, submitting an enquiry, requesting a
          service, or otherwise providing personal information to i-VANTAGE,
          you acknowledge that you have read this Privacy Policy.
        </p>

        <p className="mt-4">
          Where applicable law requires consent for a particular processing
          activity, we will seek consent through an appropriate mechanism.
        </p>

        <p className="mt-6 font-semibold text-[#0A1F66]">
          i-VANTAGE is committed to using personal information responsibly,
          transparently, and only for legitimate business, service-delivery,
          legal, security, and other permitted purposes.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b bg-white">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24">

            <div className="max-w-4xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1E5BFF]">
                Legal
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#0A1F66] sm:text-5xl lg:text-6xl">
                Privacy Policy – i-VANTAGE
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
                  We respect your privacy and are committed to handling
                  personal information responsibly. This Privacy Policy
                  explains how we collect, use, store, share, and protect
                  information when you visit our website, contact us, use our
                  services, submit an enquiry, become a member, or otherwise
                  interact with i-VANTAGE.
                </p>

                <p>
                  This policy is intended to apply to our website, enquiries,
                  business support services, coworking-related services,
                  communications, and other services provided through
                  i-VANTAGE.
                </p>
              </div>

            </div>

          </div>
        </Container>
      </section>

      {/* Policy Content */}
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