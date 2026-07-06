const columns = [
  {
    heading: "Platform",
    links: [
      "IPS Generation",
      "Portfolio Construction",
      "Risk Analytics",
      "Institutional Reporting",
    ],
  },
  {
    heading: "Company",
    links: ["About", "Leadership", "Careers", "Press"],
  },
  {
    heading: "Governance",
    links: [
      "Regulatory Disclosures",
      "Investor Charter",
      "Grievance Redressal",
      "Privacy Policy",
    ],
  },
  {
    heading: "Contact",
    links: [
      "advisory@ninja.example",
      "+91 22 6100 0000",
      "Lower Parel, Mumbai 400013",
      "Request a briefing",
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((label) => (
                  <li key={label}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <p className="text-xs leading-relaxed text-muted-foreground">
            NINJA Advisory is a demonstration platform. All portfolios,
            products and figures are illustrative and do not constitute
            investment advice or an offer to sell securities.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            &copy; 2026 NINJA Advisory
          </p>
        </div>
      </div>
    </footer>
  );
}
