import TermsHeading from "@/components/terms/TermsHeading";

export default function TechnologyDeskTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <TermsHeading
            title="Terms of Use – Technology Desk"
            description="The following Terms of Use govern all services offered under the Technology Desk at i-VANTAGE Business Hub. By availing any Technology Desk service, the member confirms that they have read, understood, and agreed to these terms."
          />

          <div className="mt-10 space-y-8 rounded-3xl bg-white p-5 shadow-sm sm:p-8 lg:p-10">

            {/* 1 */}
            <section>
              <h2 className="terms-title">1. Scope of Services</h2>

              <p className="terms-text">
                The Technology Desk provides professional technical assistance
                and coordination for:
              </p>

              <ol className="terms-list">
                <li>Website Development</li>
                <li>Website Maintenance</li>
                <li>Landing Page Development</li>
                <li>Domain Management</li>
                <li>Email Hosting & Configuration</li>
                <li>Cloud Storage</li>
                <li>Hosting Setup & Management</li>
                <li>SSL Configuration</li>
                <li>Basic Technical Support</li>
                <li>CMS Maintenance</li>
                <li>Website Bug Fixes</li>
                <li>IT Infrastructure Support</li>
                <li>IT Security Guidance</li>
                <li>Cybersecurity Support</li>
                <li>CRM Setup & Support</li>
                <li>ERP Setup & Support</li>
                <li>AI Automation</li>
                <li>Technical Consultation</li>
              </ol>

              <p className="terms-text">
                The exact scope of each service depends on the applicable
                membership plan, technical requirements, and agreed service
                scope.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2 className="terms-title">
                2. Professional Assistance vs. Third-Party Costs
              </h2>

              <p className="terms-text">
                Membership covers professional technical assistance
                specifically included under the applicable membership plan.
              </p>

              <p className="terms-text">
                The following costs are <strong>not included</strong> and shall
                be payable separately by the member wherever applicable:
              </p>

              <ol className="terms-list">
                <li>Domain Registration & Renewal</li>
                <li>AWS, Google Cloud, Microsoft Azure and other Cloud Hosting Charges</li>
                <li>Server Rental</li>
                <li>Premium SSL Certificates</li>
                <li>Premium Plugins and Themes</li>
                <li>Paid APIs</li>
                <li>AI API Usage Charges</li>
                <li>SaaS Subscriptions</li>
                <li>CRM/ERP Licence Fees</li>
                <li>Email Service Licences</li>
                <li>Software Licences</li>
                <li>Premium Security Tools</li>
                <li>Backup Storage Charges</li>
                <li>Hardware Purchases</li>
                <li>Hardware Rental</li>
                <li>Dedicated Internet</li>
                <li>Static IP Charges</li>
                <li>Server Rack Charges</li>
                <li>Data Centre Charges</li>
                <li>Third-Party Technical Consultant Fees</li>
              </ol>

              <p className="terms-text">
                i-VANTAGE may assist with procurement, configuration, renewal,
                or coordination of such services, but the underlying
                third-party cost remains payable by the member.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="terms-title">
                3. Standard Maintenance vs. Custom Development
              </h2>

              <p className="terms-text">
                Technology Desk membership is primarily intended for{" "}
                <strong>
                  standard technical support, maintenance, configuration, and
                  coordination
                </strong>
                .
              </p>

              <p className="terms-text">Standard support may include:</p>

              <ol className="terms-list">
                <li>CMS updates</li>
                <li>Plugin updates</li>
                <li>SSL configuration</li>
                <li>Basic website changes</li>
                <li>Broken-link fixes</li>
                <li>Basic website troubleshooting</li>
                <li>Domain configuration</li>
                <li>Email configuration</li>
                <li>Hosting configuration</li>
                <li>Basic website performance improvements</li>
              </ol>

              <p className="terms-text">
                The following are generally outside standard membership scope
                and require separate project scoping:
              </p>

              <ol className="terms-list">
                <li>Custom mobile application development</li>
                <li>Full-stack software development</li>
                <li>New SaaS product development</li>
                <li>Complex React/Node.js development</li>
                <li>Custom database architecture</li>
                <li>Custom API development</li>
                <li>Complex payment gateway integrations</li>
                <li>ERP development</li>
                <li>Advanced CRM development</li>
                <li>Large-scale e-commerce development</li>
                <li>Legacy software redevelopment</li>
              </ol>
            </section>

            {/* 4 */}
            <section>
              <h2 className="terms-title">4. Website Development</h2>

              <p className="terms-text">
                Where website development is included in a membership, it
                applies only to the website scope specifically agreed with the
                member.
              </p>

              <p className="terms-text">
                A standard website project may include a defined number of
                pages, forms, integrations, and revisions.
              </p>

              <p className="terms-text">
                Requests for substantial additional functionality, including
                e-commerce systems, custom dashboards, membership platforms,
                advanced databases, complex API integrations, or custom
                applications, may require a separate quotation.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="terms-title">5. Website Maintenance</h2>

              <p className="terms-text">
                Website maintenance is intended for routine maintenance and
                minor technical changes.
              </p>

              <p className="terms-text">
                It does not automatically include reconstruction or
                redevelopment of a website with:
              </p>

              <ol className="terms-list">
                <li>Outdated code</li>
                <li>Unsupported software</li>
                <li>Severe security vulnerabilities</li>
                <li>Malware</li>
                <li>Extensive custom code</li>
                <li>Broken databases</li>
                <li>Unsupported plugins</li>
                <li>Legacy frameworks</li>
              </ol>

              <p className="terms-text">
                Such matters may require a separate technical audit and
                remediation project.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="terms-title">
                6. Cybersecurity & Security Incidents
              </h2>

              <p className="terms-text">
                Technology Desk security support may include basic security
                guidance, SSL configuration, routine updates, and coordination
                of standard security measures.
              </p>

              <p className="terms-text">
                Deep cybersecurity remediation, penetration testing, forensic
                investigation, malware removal, compromised-server recovery,
                security audits, and incident-response projects may require
                specialist third-party professionals and separate charges.
              </p>

              <p className="terms-text">
                i-VANTAGE does not guarantee that a website, server,
                application, network, or digital account will remain completely
                free from cyberattacks or security incidents.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="terms-title">7. Legacy Systems</h2>

              <p className="terms-text">
                Technology Desk services are primarily intended for systems
                that are reasonably maintained and supported.
              </p>

              <p className="terms-text">
                Where a member brings an existing website, application,
                server, database, or software system with significant technical
                debt, outdated technology, security vulnerabilities, or
                undocumented custom code, i-VANTAGE may first require a
                technical assessment.
              </p>

              <p className="terms-text">
                Any remediation or redevelopment identified during the
                assessment may be quoted separately.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="terms-title">
                8. Hosting & Cloud Infrastructure
              </h2>

              <p className="terms-text">i-VANTAGE may assist with:</p>

              <ol className="terms-list">
                <li>Hosting setup</li>
                <li>Server configuration</li>
                <li>Domain configuration</li>
                <li>SSL installation</li>
                <li>Basic cloud configuration</li>
                <li>Backup configuration</li>
                <li>Hosting coordination</li>
              </ol>

              <p className="terms-text">
                However, the availability and performance of third-party
                infrastructure depends on the relevant hosting or cloud
                provider.
              </p>

              <p className="terms-text">i-VANTAGE does not guarantee:</p>

              <ol className="terms-list">
                <li>100% uptime</li>
                <li>Specific server response times</li>
                <li>Specific PageSpeed scores</li>
                <li>Zero downtime</li>
                <li>Uninterrupted cloud availability</li>
                <li>Third-party infrastructure performance</li>
              </ol>
            </section>

            {/* 9 */}
            <section>
              <h2 className="terms-title">9. Technical Support Hours</h2>

              <p className="terms-text">
                Standard Technology Desk support operates during the support
                hours communicated to the member.
              </p>

              <p className="terms-text">
                Unless specifically included under a separate managed
                infrastructure or enterprise support agreement, standard
                membership does <strong>not</strong> include:
              </p>

              <ol className="terms-list">
                <li>24/7 monitoring</li>
                <li>Overnight server management</li>
                <li>Emergency weekend DevOps support</li>
                <li>Guaranteed immediate server restoration</li>
                <li>Dedicated on-call engineering teams</li>
              </ol>

              <p className="terms-text">
                Priority Membership provides priority handling within
                i-VANTAGE&apos;s normal support workflow. It does not
                automatically constitute 24/7 emergency technical support.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="terms-title">10. Emergency Technical Support</h2>

              <p className="terms-text">
                Emergency server restoration, application recovery, critical
                cybersecurity incidents, or other urgent technical
                requirements outside standard support hours may be handled
                through a separate emergency or managed-services arrangement.
              </p>

              <p className="terms-text">
                Additional professional and third-party charges may apply.
              </p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="terms-title">11. Network & Internet Usage</h2>

              <p className="terms-text">
                i-VANTAGE provides internet and network infrastructure for{" "}
                <strong>normal business use</strong> within the applicable
                workspace.
              </p>

              <p className="terms-text">
                Members must not use the network for activities that:
              </p>

              <ol className="terms-list">
                <li>Consume excessive bandwidth</li>
                <li>Disrupt other members</li>
                <li>Involve illegal downloads</li>
                <li>Operate unauthorized servers</li>
                <li>Conduct abusive automated scraping</li>
                <li>Run unauthorized mining operations</li>
                <li>Distribute malware</li>
                <li>Conduct cyberattacks</li>
                <li>Host malicious content</li>
                <li>Violate applicable law</li>
                <li>Breach third-party service terms</li>
              </ol>

              <p className="terms-text">
                i-VANTAGE may restrict, throttle, suspend, or disconnect
                network access where necessary to protect the network, other
                members, infrastructure, or legal compliance.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="terms-title">12. Dedicated Infrastructure</h2>

              <p className="terms-text">
                Dedicated infrastructure requirements are not automatically
                included in standard membership.
              </p>

              <p className="terms-text">
                The following may require separate commercial arrangements:
              </p>

              <ol className="terms-list">
                <li>Dedicated servers</li>
                <li>Physical server racks</li>
                <li>Static IP addresses</li>
                <li>Dedicated firewalls</li>
                <li>Custom VLANs</li>
                <li>Additional bandwidth</li>
                <li>Hardware installation</li>
                <li>High-power equipment</li>
                <li>Specialized network configurations</li>
              </ol>

              <p className="terms-text">
                Any such infrastructure is subject to technical feasibility
                and availability.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="terms-title">
                13. Individual Employee IT Support
              </h2>

              <p className="terms-text">
                Standard Technology Desk services primarily support the
                member&apos;s business technology environment and agreed
                systems.
              </p>

              <p className="terms-text">
                They do not constitute an unlimited outsourced IT helpdesk for
                every employee.
              </p>

              <p className="terms-text">
                Routine assistance may be provided within the applicable
                membership scope, but unlimited troubleshooting of:
              </p>

              <ol className="terms-list">
                <li>Individual laptops</li>
                <li>Operating system problems</li>
                <li>Personal devices</li>
                <li>Printer drivers</li>
                <li>Third-party applications</li>
                <li>Employee email issues</li>
                <li>Hardware failures</li>
              </ol>

              <p className="terms-text">
                may require a separate IT support arrangement.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="terms-title">14. Data, Access & Security</h2>

              <p className="terms-text">
                Members are responsible for providing necessary access
                credentials, administrator permissions, API keys, hosting
                access, and other information required to perform technical
                services.
              </p>

              <p className="terms-text">
                Members should provide access through secure channels wherever
                available.
              </p>

              <p className="terms-text">
                i-VANTAGE shall not be responsible for technical problems
                arising from:
              </p>

              <ol className="terms-list">
                <li>Incorrect credentials</li>
                <li>Expired credentials</li>
                <li>Unauthorized access</li>
                <li>Changes made by the member or another third party</li>
                <li>Unsupported software</li>
                <li>Unauthorised modifications</li>
                <li>Third-party platform changes</li>
              </ol>

              <p className="terms-text">
                Members should maintain appropriate backups of important
                business data.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="terms-title">15. Third-Party Platforms</h2>

              <p className="terms-text">
                Technology services may involve third-party providers
                including hosting companies, cloud platforms, domain
                registrars, email providers, CRM providers, ERP providers,
                payment gateways, APIs, plugins, and software vendors.
              </p>

              <p className="terms-text">
                i-VANTAGE is not responsible for:
              </p>

              <ol className="terms-list">
                <li>Third-party outages</li>
                <li>Service discontinuation</li>
                <li>Account suspension</li>
                <li>Pricing changes</li>
                <li>API changes</li>
                <li>Security incidents originating with the third party</li>
                <li>Loss caused by third-party infrastructure failure</li>
              </ol>
            </section>

            {/* 16 */}
            <section>
              <h2 className="terms-title">16. Backups & Data Recovery</h2>

              <p className="terms-text">
                Where backup services are specifically included, backups will
                be performed according to the agreed configuration and
                frequency.
              </p>

              <p className="terms-text">
                Unless explicitly agreed otherwise, i-VANTAGE does not
                guarantee complete recovery of all data following:
              </p>

              <ol className="terms-list">
                <li>Hardware failure</li>
                <li>Malware</li>
                <li>Cyberattack</li>
                <li>Accidental deletion</li>
                <li>Server failure</li>
                <li>Database corruption</li>
                <li>Third-party hosting failure</li>
              </ol>

              <p className="terms-text">
                Members remain responsible for maintaining appropriate
                independent backups of critical business information.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2 className="terms-title">17. Fair Usage Policy</h2>

              <p className="terms-text">
                Technology Desk services are subject to reasonable usage
                limits.
              </p>

              <p className="terms-text">
                High-volume or complex requirements may require a separate
                engagement, including:
              </p>

              <ol className="terms-list">
                <li>Large-scale website maintenance</li>
                <li>Multiple websites</li>
                <li>Multiple servers</li>
                <li>Multiple applications</li>
                <li>Extensive daily technical support</li>
                <li>Enterprise IT support</li>
                <li>Custom software development</li>
                <li>Large-scale data migration</li>
                <li>Complex cybersecurity work</li>
                <li>Extensive cloud infrastructure management</li>
              </ol>
            </section>

            {/* 18 */}
            <section>
              <h2 className="terms-title">18. Member Responsibilities</h2>

              <p className="terms-text">The member agrees to:</p>

              <ol className="terms-list">
                <li>Provide accurate technical information.</li>
                <li>Maintain valid domain and hosting accounts.</li>
                <li>Pay third-party infrastructure bills on time.</li>
                <li>Maintain necessary software licences.</li>
                <li>Provide required access credentials.</li>
                <li>Inform i-VANTAGE about major system changes.</li>
                <li>Maintain backups of critical information.</li>
                <li>Ensure that their digital activities comply with applicable laws.</li>
              </ol>

              <p className="terms-text">
                Delays caused by missing access, unpaid third-party
                subscriptions, or incomplete information may affect service
                timelines.
              </p>
            </section>

            {/* 19 */}
            <section>
              <h2 className="terms-title">
                19. No Guarantee of Technical Outcomes
              </h2>

              <p className="terms-text">
                i-VANTAGE provides technical assistance, maintenance,
                configuration, coordination, and optimization within the
                agreed scope.
              </p>

              <p className="terms-text">
                No guarantee is provided regarding:
              </p>

              <ol className="terms-list">
                <li>Website uptime</li>
                <li>PageSpeed scores</li>
                <li>Search rankings</li>
                <li>Website traffic</li>
                <li>Application performance</li>
                <li>Zero security incidents</li>
                <li>Server availability</li>
                <li>Data recovery</li>
                <li>Software compatibility</li>
                <li>Third-party platform availability</li>
                <li>Business results generated by technology</li>
              </ol>
            </section>

            {/* 20 */}
            <section>
              <h2 className="terms-title">
                20. Intellectual Property & Third-Party Code
              </h2>

              <p className="terms-text">
                Where i-VANTAGE creates website content, configurations,
                designs, or code as part of an agreed project, ownership and
                usage rights shall be governed by the applicable project
                agreement.
              </p>

              <p className="terms-text">
                Third-party software, plugins, themes, APIs, frameworks, stock
                assets, and licensed code remain subject to their respective
                licence terms.
              </p>
            </section>

            {/* 21 */}
            <section>
              <h2 className="terms-title">21. Modification of Services</h2>

              <p className="terms-text">
                i-VANTAGE reserves the right to modify, update, suspend, or
                discontinue any Technology Desk service, operational process,
                partner engagement, software platform, or membership benefit
                without prior notice, subject to applicable law.
              </p>
            </section>

            {/* 22 */}
            <section>
              <h2 className="terms-title">22. Acceptance of Terms</h2>

              <p className="terms-text">
                By availing any Technology Desk service, the member confirms
                that they have read, understood, and agreed to these Terms of
                Use.
              </p>

              <p className="terms-text">
                The member acknowledges that{" "}
                <strong>
                  i-VANTAGE provides technical support, maintenance,
                  configuration, coordination, and technology advisory within
                  the agreed scope. It does not provide unlimited software
                  engineering, 24/7 DevOps support, unlimited IT helpdesk
                  services, or guaranteed uptime and technical outcomes unless
                  specifically agreed under a separate engagement.
                </strong>
              </p>
            </section>

          </div>
        </div>
      </section>
    </main>
  );
}