function parseCsv(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function getAllowedFrameSrc() {
  const fromEnv = parseCsv(process.env.IFRAME_ALLOWLIST);
  if (fromEnv.length > 0) return fromEnv;

  // Defaults cover Power BI + Tableau public embeds.
  return [
    "https://app.powerbi.com",
    "https://*.powerbi.com",
    "https://public.tableau.com",
    "https://*.tableau.com",
  ];
}

export function isCspReportOnly() {
  // Default to report-only to avoid breaking existing dashboards.
  return (process.env.CSP_REPORT_ONLY ?? "true").toLowerCase() !== "false";
}

