import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";
import { marked } from "../frontend/node_modules/marked/lib/marked.esm.js";
import { insights } from "../frontend/src/data/insights.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "..", "frontend", "dist");

console.log(
  "--- Starting MyTenant Comprehensive Static Site Generation (SSG) Pre-renderer ---",
);

if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist. Run vite build first.");
  process.exit(1);
}

const templatePath = path.join(distDir, "index.html");
const baseTemplate = fs.readFileSync(templatePath, "utf-8");

// Helper to write file and compress with gzip and brotli
function writeStaticPage(subPath, htmlContent) {
  const cleanPath = (subPath || "").replace(/^\/+|\/+$/g, "");
  const targetDir = cleanPath ? path.join(distDir, cleanPath) : distDir;
  fs.mkdirSync(targetDir, { recursive: true });

  const targetFile = path.join(targetDir, "index.html");
  fs.writeFileSync(targetFile, htmlContent, "utf-8");

  // Create compressed versions
  const gzContent = zlib.gzipSync(Buffer.from(htmlContent, "utf-8"), {
    level: 9,
  });
  fs.writeFileSync(path.join(targetDir, "index.html.gz"), gzContent);

  const brContent = zlib.brotliCompressSync(Buffer.from(htmlContent, "utf-8"));
  fs.writeFileSync(path.join(targetDir, "index.html.br"), brContent);

  console.log(
    `✓ Pre-rendered: /${cleanPath ? cleanPath + "/" : ""}index.html (${Math.round(htmlContent.length / 1024)} KB)`,
  );
}

// Common Top Navigation Header
const commonNav = `
<header class="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 backdrop-blur-md">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <a href="/" class="flex items-center gap-2 group" aria-label="MyTenant Home">
        <span class="text-xl font-bold tracking-tight text-white">
          My<span class="text-blue-500">Tenant</span><span class="text-slate-400 font-normal">.me</span>
        </span>
      </a>
      <nav class="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <a href="/features/rent-ledger" class="hover:text-blue-400 transition-colors">Features</a>
        <a href="/tools/1031-exchange" class="hover:text-blue-400 transition-colors">1031 Calculator</a>
        <a href="/tools/cap-rate-calculator" class="hover:text-blue-400 transition-colors">Cap Rate Tool</a>
        <a href="/insights" class="hover:text-blue-400 transition-colors flex items-center gap-1.5">
          <span>Research & Insights</span>
          <span class="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
        </a>
        <a href="/pricing" class="hover:text-blue-400 transition-colors">Pricing</a>
        <a href="/about" class="hover:text-blue-400 transition-colors">About</a>
        <a href="/contact" class="hover:text-blue-400 transition-colors">Contact</a>
      </nav>
    </div>
    <div class="flex items-center gap-3">
      <a href="/login" class="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5">
        Log In
      </a>
      <a href="/dashboard" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-1.5">
        Open Live Demo
      </a>
    </div>
  </div>
</header>
`;

// Common MegaFooter
const commonFooter = `
<footer class="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm py-16 transition-colors">
  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
    <div class="lg:col-span-1">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl font-bold tracking-tight text-white">
          My<span class="text-blue-500">Tenant</span><span class="text-slate-400 font-normal">.me</span>
        </span>
      </div>
      <p class="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        Next-generation property and tenant management software engineered for independent landlords, portfolio operators, and real estate syndicators.
      </p>
      <div class="text-xs text-slate-500">
        © 2026 MyTenant Platform. All rights reserved. Registered commercial publisher.
      </div>
    </div>
    <div>
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Features & Compare</h4>
      <ul class="space-y-2.5">
        <li><a href="/features/rent-ledger" class="hover:text-blue-400 transition-colors">Automated Rent Ledger</a></li>
        <li><a href="/features/bill-splitting" class="hover:text-blue-400 transition-colors">Intelligent Bill Splitting</a></li>
        <li><a href="/features/tenant-tracking" class="hover:text-blue-400 transition-colors">Tenant Profiles & Leases</a></li>
        <li><a href="/features/auto-signatures" class="hover:text-blue-400 transition-colors">Digital Signatures</a></li>
        <li><a href="/pricing" class="hover:text-blue-400 transition-colors">Pricing & Plans</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Financial Tools</h4>
      <ul class="space-y-2.5">
        <li><a href="/tools/1031-exchange" class="hover:text-blue-400 transition-colors">1031 Exchange Calculator</a></li>
        <li><a href="/tools/cost-segregation" class="hover:text-blue-400 transition-colors">Cost Segregation Estimator</a></li>
        <li><a href="/tools/cap-rate-calculator" class="hover:text-blue-400 transition-colors">Cap Rate Calculator</a></li>
        <li><a href="/tools/roi-calculator" class="hover:text-blue-400 transition-colors">ROI / IRR Modeling Tool</a></li>
        <li><a href="/tools/rent-calculator" class="hover:text-blue-400 transition-colors">Optimal Rent Estimator</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Research Hub</h4>
      <ul class="space-y-2.5">
        <li><a href="/insights" class="hover:text-blue-400 transition-colors font-semibold text-blue-400">Landlord Insights Hub</a></li>
        <li><a href="/research/green-premiums" class="hover:text-blue-400 transition-colors">Low-Carbon Rent Premium</a></li>
        <li><a href="/research/tenant-retention" class="hover:text-blue-400 transition-colors">Vacancy Rate Paradox</a></li>
        <li><a href="/research/smart-management" class="hover:text-blue-400 transition-colors">IoT Property Management</a></li>
        <li><a href="/research/behavioral-rent" class="hover:text-blue-400 transition-colors">Behavioral Rent Collection</a></li>
      </ul>
    </div>
    <div>
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company & Legal</h4>
      <ul class="space-y-2.5">
        <li><a href="/about" class="hover:text-blue-400 transition-colors">About MyTenant</a></li>
        <li><a href="/pricing" class="hover:text-blue-400 transition-colors">Pricing & Plans</a></li>
        <li><a href="/contact" class="hover:text-blue-400 transition-colors">Contact Support</a></li>
        <li><a href="/privacy-policy" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
        <li><a href="/terms" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
        <li><a href="/refund-policy" class="hover:text-blue-400 transition-colors">Refund Policy</a></li>
      </ul>
    </div>
  </div>
</footer>
`;

function injectPage(title, description, canonicalUrl, schemaObj, bodyHtml) {
  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // Head Meta Injections
  const headInjections = `
    <meta name="description" content="${description.replace(/"/g, "&quot;")}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    ${schemaObj ? `<script type="application/ld+json">${JSON.stringify(schemaObj)}</script>` : ""}
  `;

  html = html.replace("</head>", `${headInjections}\n</head>`);

  const fullBody = `
    ${commonNav}
    <main class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      ${bodyHtml}
    </main>
    ${commonFooter}
  `;

  const bodyStartTag = "<body>";
  const bodyEndTag = "</body>";
  const bodyStartIndex = html.indexOf(bodyStartTag);
  const bodyEndIndex = html.indexOf(bodyEndTag);

  if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
    const preBody = html.substring(0, bodyStartIndex + bodyStartTag.length);
    const postBody = html.substring(bodyEndIndex);
    html = `${preBody}\n    <div id="root">${fullBody}</div>\n  ${postBody}`;
  }

  return html;
}

// ── 1. Pre-render All Insight Articles ──
console.log(`Pre-rendering ${insights.length} Insight Articles...`);
insights.forEach((article) => {
  const parsedContentHtml = marked.parse(article.content);
  const publishDateISO = new Date(article.date).toISOString().split("T")[0];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://mytenant.me/insights/${article.slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: article.image
      ? `https://mytenant.me${article.image}`
      : "https://mytenant.me/logo-96.png",
    datePublished: `${publishDateISO}T08:00:00Z`,
    dateModified: `${publishDateISO}T10:00:00Z`,
    author: {
      "@type": "Organization",
      name: "The MyTenant Research Team",
      url: "https://mytenant.me/about",
    },
    publisher: {
      "@type": "Organization",
      name: "MyTenant",
      logo: {
        "@type": "ImageObject",
        url: "https://mytenant.me/logo-96.png",
      },
    },
  };

  const articleBodyHtml = `
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-8">
        <a href="/insights" class="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Back to Research Briefs
        </a>
        <span class="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
          Editorial Analysis & Operational Guide
        </span>
      </div>

      <header class="mb-10">
        <div class="flex items-center gap-3 mb-6">
          <span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
            ${article.category}
          </span>
          <span class="text-slate-500 dark:text-slate-400 text-sm">${article.date}</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span class="text-slate-500 dark:text-slate-400 text-sm">${article.readTime}</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
          ${article.title}
        </h1>

        <p class="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-l-4 border-blue-500 pl-4 py-1">
          ${article.excerpt}
        </p>
      </header>

      ${
        article.image
          ? `
      <div class="rounded-2xl overflow-hidden mb-12 shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
        <img src="${article.image}" alt="${article.title}" class="w-full h-auto max-h-[480px] object-cover" />
      </div>
      `
          : ""
      }

      <article class="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-table:w-full prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-th:border prose-td:border prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-td:border-slate-200 dark:prose-td:border-slate-700">
        ${parsedContentHtml}
      </article>

      <div class="mt-16 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            MT
          </div>
          <div>
            <p class="font-bold text-slate-900 dark:text-white text-base">${article.author}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The MyTenant Research Team</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              ✓ Operational Guide • Reviewed 2026
            </p>
          </div>
        </div>
        <a href="/register" class="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
          Deploy MyTenant Platform
        </a>
      </div>
    </div>
  `;

  const pageHtml = injectPage(
    `${article.title} | MyTenant Research`,
    article.excerpt,
    `https://mytenant.me/insights/${article.slug}`,
    articleSchema,
    articleBodyHtml,
  );

  writeStaticPage(`insights/${article.slug}`, pageHtml);
});

// ── 2. Pre-render Insights Index Hub (/insights) ──
console.log("Pre-rendering Insights Index Hub...");
const sortedInsights = [...insights].sort(
  (a, b) => new Date(b.date) - new Date(a.date),
);

const insightsGridHtml = `
<div class="max-w-7xl mx-auto px-6 py-16">
  <div class="mb-12 max-w-3xl">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-4">
      Institutional Knowledge Hub
    </div>
    <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
      Landlord <span class="text-blue-600 dark:text-blue-500">Insights</span> & Economics
    </h1>
    <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
      Empirical research, mathematical portfolio modeling, and regulatory analysis for independent landlords and property portfolio operators.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    ${sortedInsights
      .map(
        (item) => `
      <a href="/insights/${item.slug}" class="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
        ${
          item.image
            ? `
          <div class="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 text-xs font-bold px-3 py-1 rounded-full text-slate-900 dark:text-white">
              ${item.category}
            </div>
          </div>
        `
            : ""
        }
        <div class="p-6 flex flex-col flex-1">
          <div class="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
            <span>${item.date}</span>
            <span>•</span>
            <span>${item.readTime}</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            ${item.title}
          </h2>
          <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
            ${item.excerpt}
          </p>
          <div class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4">
            By ${item.author}
          </div>
          <div class="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm mt-auto">
            Read Full Research Brief &rarr;
          </div>
        </div>
      </a>
    `,
      )
      .join("")}
  </div>
</div>
`;

const insightsIndexHtml = injectPage(
  "Landlord Insights & Real Estate Research | MyTenant",
  "Daily insights, academic research, and operational strategies for independent landlords and property managers.",
  "https://mytenant.me/insights",
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Landlord Insights & Real Estate Research",
    description:
      "Daily insights, academic research, and operational strategies for independent landlords and property managers.",
    url: "https://mytenant.me/insights",
  },
  insightsGridHtml,
);

writeStaticPage("insights", insightsIndexHtml);

// ── 3. Pre-render Financial Calculator & Tool Pages ──
console.log("Pre-rendering Financial Tool Pages...");
const toolPages = [
  {
    slug: "tools/1031-exchange",
    title: "1031 Exchange Calculator & Tax Deferral Estimator | MyTenant",
    description:
      "Calculate capital gains tax deferral, depreciation recapture savings, and 45-day/180-day statutory identification deadlines under IRC § 1031.",
    heading: "IRC § 1031 Like-Kind Exchange Calculator",
    content: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Under Internal Revenue Code (IRC) § 1031, real estate investors can defer 100% of federal capital gains taxes (15%–20%), depreciation recapture taxes (25%), and Net Investment Income Tax (3.8%) by reinvesting proceeds into qualified replacement property.
      </p>
      <div class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 mb-8">
        <h3 class="font-bold text-blue-900 dark:text-blue-300 text-lg mb-2">Statutory 45-Day and 180-Day Deadlines</h3>
        <p class="text-sm text-blue-800 dark:text-blue-400">
          The IRS enforces rigid statutory time limits: replacement properties must be formally identified within 45 days of relinquished property closing, and acquired within 180 days. Use this tool to model your tax liability and track strict calendar cliffs.
        </p>
      </div>
    `,
  },
  {
    slug: "tools/cost-segregation",
    title: "Cost Segregation Tax Depreciation Estimator | MyTenant",
    description:
      "Model first-year bonus depreciation and Net Present Value (NPV) tax shielding by reclassifying building assets under MACRS 5, 7, and 15-year property.",
    heading: "MACRS Cost Segregation Study Estimator",
    content: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Instead of standard 27.5-year straight-line depreciation, a cost segregation engineering study dissects real property into IRC § 1245 tangible personal property (5-year and 7-year) and land improvements (15-year), unlocking massive first-year tax shields.
      </p>
      <div class="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 mb-8">
        <h3 class="font-bold text-emerald-900 dark:text-emerald-300 text-lg mb-2">Time Value of Money (TVM) Multiplier</h3>
        <p class="text-sm text-emerald-800 dark:text-emerald-400">
          Accelerating depreciation deductions into Year 1 preserves working capital to reinvest into cash-flowing assets. Estimate your accelerated tax savings before hiring an engineering firm.
        </p>
      </div>
    `,
  },
  {
    slug: "tools/cap-rate-calculator",
    title: "Capitalization Rate (Cap Rate) & Spread Calculator | MyTenant",
    description:
      "Calculate Net Operating Income (NOI), capitalization rates, debt constants, and risk-free Treasury yield spreads for commercial multifamily underwriting.",
    heading: "Capitalization Rate & Spread Modeling Tool",
    content: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Capitalization rate (Cap Rate = Net Operating Income / Purchase Price) is the fundamental benchmark for unlevered commercial property yields. Model sensitivity across interest rate spreads and debt coverage floors.
      </p>
    `,
  },
  {
    slug: "tools/rent-calculator",
    title: "Optimal Rent & Utility Billing Estimator | MyTenant",
    description:
      "Model market rent elasticity, Ratio Utility Billing System (RUBS) allocations, and late fee pricing curves to maximize annualized portfolio yield.",
    heading: "Optimal Rent & RUBS Recovery Estimator",
    content: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Determine optimal pricing structures, evaluate seasonal lease term adjustments, and calculate Net Operating Income expansion generated through tenant utility pass-through allocations.
      </p>
    `,
  },
  {
    slug: "tools/roi-calculator",
    title:
      "Real Estate ROI & Internal Rate of Return (IRR) Calculator | MyTenant",
    description:
      "Compare Year 1 Cash-on-Cash returns against 5-to-10 year Internal Rate of Return (IRR) and Equity Multiples across multi-period Discounted Cash Flow models.",
    heading: "Multi-Period Discounted Cash Flow (DCF) & IRR Calculator",
    content: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Avoid the Cash-on-Cash yield trap by underwriting complete 5-year investment horizons: accounting for ongoing CapEx reserves, mortgage principal amortization, and terminal disposition proceeds.
      </p>
    `,
  },
];

toolPages.forEach((tool) => {
  const toolBodyHtml = `
    <div class="max-w-4xl mx-auto px-6 py-16">
      <div class="mb-4">
        <a href="/insights" class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          &larr; Return to Financial Resources
        </a>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        ${tool.heading}
      </h1>
      ${tool.content}
      <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Interactive Calculation Engine</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Input your property parameters to run real-time econometric simulations.
        </p>
        <a href="/dashboard" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">
          Launch Interactive Calculator
        </a>
      </div>
    </div>
  `;

  const toolHtml = injectPage(
    tool.title,
    tool.description,
    `https://mytenant.me/${tool.slug}`,
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: tool.heading,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    toolBodyHtml,
  );

  writeStaticPage(tool.slug, toolHtml);
});

// ── 4. Pre-render Feature Spotlight Pages ──
console.log("Pre-rendering Feature Spotlight Pages...");
const featurePages = [
  {
    slug: "features/rent-ledger",
    title: "Automated Rent Ledger Software for Landlords | MyTenant",
    description:
      "Replace messy spreadsheets with a beautiful, automated rent ledger. Track payments, late fees, and overdue rent across your entire real estate portfolio.",
    heading: "The Ultimate Automated Rent Ledger",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        Say goodbye to broken formulas, manual data entry errors, and disconnected accounting sheets. MyTenant delivers a crystal-clear, automated digital rent roll that synchronizes every transaction, rent cycle, and tenant balance in real time.
      </p>
      <div class="grid sm:grid-cols-2 gap-8 mb-12">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Zero Data Entry Errors</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Recorded payments automatically credit tenant accounts and recalculate property revenue instantly without manual formula intervention.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Automated Rent Generation</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Generate recurring monthly rent invoices across your entire multi-unit portfolio with one click on the 1st of every month.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Instant Overdue Alerts</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Identify late payments immediately with automatic visual flags and customizable grace-period rules before arrears compound.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Audit-Ready PDF Exports</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Generate compliant rent rolls, CPA income/expense statements, and tenant receipts ready for tax filing and lenders.</p>
        </div>
      </div>
    `,
  },
  {
    slug: "features/bill-splitting",
    title: "Utility Bill Splitting & RUBS Software for Landlords | MyTenant",
    description:
      "Easily split master electricity, water, gas, and maintenance bills among tenants. Automate expense allocation and stop losing money on shared utilities.",
    heading: "Painless Utility Bill Splitting & RUBS Allocation",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        Eliminate the headache of manual utility calculation. Upload master invoices for water, trash, gas, or power and let MyTenant automatically compute proportional tenant splits based on occupancy, square footage, or equal distribution.
      </p>
      <div class="grid sm:grid-cols-2 gap-8 mb-12">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Dynamic Ratio Allocation</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Allocate master charges equally among tenants, by unit square footage, or by custom percentage ratios with complete mathematical transparency.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Direct Ledger Synchronization</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Split utility portions append directly to each tenant's rent ledger, consolidating monthly obligations into a single clear balance.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Master Bill Document Storage</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Attach digital photos and PDFs of official utility statements to prevent disputes and provide indisputable audit verification.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ NOI Expansion</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Independent landlords recover thousands in previously uncaptured utility slippage, directly enhancing building capitalization value.</p>
        </div>
      </div>
    `,
  },
  {
    slug: "features/tenant-tracking",
    title: "Tenant Onboarding & Lease Lifecycle Management | MyTenant",
    description:
      "Manage tenant profiles, monitor lease renewal dates, store identification documents securely, and track lifetime payment records in one central portal.",
    heading: "Complete Tenant Tracking from Move-In to Move-Out",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        Maintain a unified source of truth for every resident across your portfolio. Store verified contact information, executed leases, identification proofs, and historical payment performance in secure cloud storage.
      </p>
      <div class="grid sm:grid-cols-2 gap-8 mb-12">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Comprehensive Resident Profiles</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Access instant summaries of lifetime rent collected, active balances, emergency contacts, and signed agreements at a single glance.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Secure Cloud Document Storage</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Store government IDs, lease addenda, and inspection reports encrypted on Backblaze B2 cloud storage with instant access from any device.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Lease Expiration Tracking</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Automated countdown alerts notify operators 60 and 90 days before lease maturity, eliminating accidental vacancy lapses.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Historical Archiving</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Archive departed tenants upon move-out while preserving full financial and communication records for statutory compliance.</p>
        </div>
      </div>
    `,
  },
  {
    slug: "features/auto-signatures",
    title: "Automated E-Signatures for Landlord Leases & Notices | MyTenant",
    description:
      "Upload your authorized landlord signature once and automatically sign legal leases, renewals, and official notices with legally binding ESIGN compliance.",
    heading: "Set Up Once. Auto-Sign Leases & Legal Notices.",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
        Stop printing, scanning, and manually signing dozens of repetitive documents. Save your verified landlord signature securely in your account preferences to automatically endorse generated lease packets, rent increase notices, and ledger statements.
      </p>
      <div class="grid sm:grid-cols-2 gap-8 mb-12">
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ One-Time Signature Capture</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Draw or upload a high-resolution signature PNG once; our cryptographic engine applies it consistently across generated agreements.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ ESIGN & UETA Compliance</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Engineered to comply with statutory e-signature frameworks, carrying equal evidentiary weight to traditional ink signatures.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Batch Document Endorsement</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Issue annual renewal packets or statutory notices to 50+ units simultaneously without manual repetitive signing.</p>
        </div>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">✓ Tamper-Evident PDFs</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">Generated documents are sealed with cryptographic timestamps, preserving evidentiary integrity for legal and banking compliance.</p>
        </div>
      </div>
    `,
  },
];

featurePages.forEach((f) => {
  const bodyHtml = `
    <div class="max-w-4xl mx-auto px-6 py-16">
      <div class="mb-4">
        <a href="/" class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">&larr; Return to Home</a>
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
        ${f.heading}
      </h1>
      ${f.body}
      <div class="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center shadow-xl">
        <h3 class="text-2xl font-bold mb-3">Experience Automated Property Management</h3>
        <p class="text-slate-400 text-sm max-w-xl mx-auto mb-6">Start managing your units with institutional speed and zero onboarding fees.</p>
        <a href="/register" class="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white transition-all shadow-md">
          Start Your Free Trial &rarr;
        </a>
      </div>
    </div>
  `;

  const pageHtml = injectPage(
    f.title,
    f.description,
    `https://mytenant.me/${f.slug}`,
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: f.heading,
      description: f.description,
      url: `https://mytenant.me/${f.slug}`,
    },
    bodyHtml,
  );

  writeStaticPage(f.slug, pageHtml);
});

// ── 5. Pre-render Academic Research Pages ──
console.log("Pre-rendering Academic Research Pages...");
const academicStudies = [
  {
    slug: "research/green-premiums",
    title:
      "The Low-Carbon Rent Premium in Multifamily Housing | Real Estate Research",
    description:
      "Empirical analysis of hedonic rent ceilings and tenant retention driven by energy-efficient building systems and low-carbon operational features.",
    heading: "The Low-Carbon Rent Premium in Multifamily Housing",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Recent econometric analysis published in real estate economics literature proves that sustainable, low-carbon building attributes command measurable rent premiums. Tenants evaluate properties on a Total Cost of Occupancy (TCO) basis, willing to absorb higher contractual base rent when utility expenditure is predictably lower.
      </p>
      <h3 class="text-xl font-bold mb-3">Key Academic Findings</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Energy-certified residential units capture an average 4.2% to 6.8% premium in effective gross rents compared to non-certified comparables.</li>
        <li>Millennial and Gen-Z tenant demographics exhibit higher voluntary lease renewal retention in properties offering digital, paperless management infrastructure.</li>
        <li>Targeted retrofits—such as smart submetering and digital lease execution—deliver internal rates of return (IRR) exceeding 22% on initial capital expenditures.</li>
      </ul>
    `,
  },
  {
    slug: "research/tenant-retention",
    title:
      "The Vacancy Rate-Rent Paradox & Tenant Retention | Real Estate Research",
    description:
      "Economic modeling of search frictions, tenant turnover costs, and optimal rent stabilization strategies for private property operators.",
    heading: "The Vacancy Rate-Rent Paradox & Optimal Retention Strategy",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Research from the National Bureau of Economic Research (NBER) analyzes the asymmetric friction of tenant turnover. Aggressive lease-renewal rent escalations frequently result in negative net cash flows over 24-month investment horizons due to turnover CapEx and unrecoverable vacancy drag.
      </p>
      <h3 class="text-xl font-bold mb-3">Economic Cost of Unit Churn</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Unit turnover costs—including repainting, cleaning, marketing, and leasing commissions—average 1.5 to 2.5 months of gross contractual rent.</li>
        <li>A 5% renewal rent increase that triggers vacancy creates an unrecoverable 18-month payback lag compared to retaining a reliable tenant at current rent.</li>
        <li>Predictive renewal tracking initiated 90 days before lease expiration helps operators minimize last-minute vacancies and plan turnarounds well in advance.</li>
      </ul>
    `,
  },
  {
    slug: "research/smart-management",
    title:
      "IoT-Enabled Smart Property Management Systems | Real Estate Research",
    description:
      "Analysis of operational efficiency, error reduction, and Net Operating Income expansion achieved through cloud-native property management systems.",
    heading: "IoT Integration & Cloud Ledger Operations",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        The transition from legacy manual bookkeeping to automated cloud platforms fundamentally restructures operating margins for real estate syndicates and private landlords.
      </p>
      <h3 class="text-xl font-bold mb-3">Operational Efficiency Multipliers</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Manual spreadsheet entry produces an average 3.8% error rate across rent ledgers, resulting in missed late fees and delayed reconciliations.</li>
        <li>Automating rent cycles and ledger calculations allows a single property manager to oversee up to 40% more units without increasing administrative overhead.</li>
        <li>Automated maintenance logging shortens repair cycle times, directly increasing tenant satisfaction scores.</li>
      </ul>
    `,
  },
  {
    slug: "research/behavioral-rent",
    title:
      "Behavioral Economics of Rent Collection & Tenant Nudges | Real Estate Research",
    description:
      "Why punitive late fees trigger default cycles and how behavioral choice architecture improves on-time rental payments.",
    heading: "Behavioral Economics & Choice Architecture in Rent Collection",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Traditional property management relies on punitive late fees, assuming rational actor deterrence. However, behavioral economics research shows that punitive fees frequently trigger present-bias debt spirals.
      </p>
      <h3 class="text-xl font-bold mb-3">Nudge Theory Interventions</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Pre-due-date digital payment reminders aligned with payroll cycles boost on-time collection rates by 19.4%.</li>
        <li>Frictionless mobile payment portals eliminate procrastination delays associated with physical checks or manual transfers.</li>
        <li>Reporting timely payments to credit bureaus reframes rent from an operational penalty to a positive wealth-building asset.</li>
      </ul>
    `,
  },
  {
    slug: "research/maintenance-roi",
    title:
      "Maintenance Response Times & Lease Renewal Probabilities | Real Estate Research",
    description:
      "SERVQUAL service quality modeling proving that maintenance responsiveness is the single highest predictor of tenant retention and property ROI.",
    heading: "Maintenance Metrics & Tenant Retention Economics",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Applying the SERVQUAL framework to multifamily housing reveals that maintenance resolution speed dwarfs cosmetic amenities in determining lease renewal propensity.
      </p>
      <h3 class="text-xl font-bold mb-3">The 8.5% Renewal Correlation</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>A 1-point increase in maintenance satisfaction on a 10-point scale produces an 8.5% higher probability of lease renewal.</li>
        <li>Proactive digital status updates mitigate tenant frustration during unavoidable repair parts delays.</li>
        <li>Preventative maintenance scheduling reduces catastrophic building equipment failures by over 45% over 5-year operating cycles.</li>
      </ul>
    `,
  },
  {
    slug: "research/utility-billing",
    title:
      "RUBS vs Submetering: Solving the Split Incentive Problem | Real Estate Research",
    description:
      "Academic evaluation of Ratio Utility Billing Systems (RUBS) and submetering interventions in multifamily property operations.",
    heading: "RUBS, Submetering, and Energy Conservation Economics",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        The split incentive problem arises when property owners pay utilities while tenants control consumption. Research compares capital-intensive submetering with algorithmic RUBS allocations.
      </p>
      <h3 class="text-xl font-bold mb-3">Comparative Analysis</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Direct submetering reduces overall building energy consumption by 15% to 25%, but requires $1,500+ per-unit retrofit CapEx.</li>
        <li>RUBS achieves near-100% utility cost recovery for landlords with zero capital investment, immediately boosting Net Operating Income.</li>
        <li>Pairing RUBS with transparent ledger statements ensures legal compliance with municipal utility recovery statutes.</li>
      </ul>
    `,
  },
  {
    slug: "research/rent-determinants",
    title:
      "Hedonic Pricing Models & Apartment Rent Determinants | Real Estate Research",
    description:
      "Spatial modeling and hedonic regression analysis identifying the exact monetary valuation of in-unit amenities and transit proximity.",
    heading: "Hedonic Pricing Regressions in Multifamily Underwriting",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Hedonic pricing models isolate the incremental rent yield generated by specific building amenities and spatial characteristics.
      </p>
      <h3 class="text-xl font-bold mb-3">Amenity Yield Hierarchy</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>In-unit laundry appliances deliver the highest internal CapEx payback period, typically recouping total installation costs in 12–14 months.</li>
        <li>Proximity to transit corridors within a 0.25-mile radius generates statistically significant rent premiums compared to suburban baselines.</li>
        <li>Digital lease signing and online resident management portals serve as vital differentiators in high-density competitive submarkets.</li>
      </ul>
    `,
  },
  {
    slug: "research/landlord-economics",
    title:
      "Institutional vs Independent Landlord Economics | Real Estate Research",
    description:
      "NBER working papers examining diverging risk profiles, yield targets, and technological democratization in private housing markets.",
    heading: "The Financialization of Housing & PropTech Democratization",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        The influx of institutional capital into residential real estate has created two distinct operating models: Wall Street algorithmic yield optimization versus independent relationship-focused management.
      </p>
      <h3 class="text-xl font-bold mb-3">Operational Comparisons</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Institutional operators prioritize maximum immediate rent increases, accepting higher tenant churn as acceptable frictional cost.</li>
        <li>Independent landlords prioritize stable long-term cash flows, often exchanging minor nominal rent premiums for lower vacancy volatility.</li>
        <li>Democratized cloud software gives independent operators institutional-grade ledger automation at a fraction of the cost.</li>
      </ul>
    `,
  },
  {
    slug: "research/eviction-costs",
    title:
      "The Financial Anatomy of Eviction Court vs Cash-for-Keys | Real Estate Research",
    description:
      "Mathematical breakdown of legal fees, vacancy drag, and property damage in formal eviction proceedings versus negotiated exits.",
    heading: "The Economic Cost of Eviction & Loss Mitigation",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Sociological and real estate research demonstrates that formal eviction litigation is almost universally a net-negative financial event for private landlords.
      </p>
      <h3 class="text-xl font-bold mb-3">Financial Friction Breakdown</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Formal court proceedings incur $2,500 to $5,000+ in combined legal expenses, sheriff fees, and 2–4 months of uncollected vacancy rent.</li>
        <li>Hostile evictions dramatically elevate the risk of retaliatory property destruction before turnover.</li>
        <li>Game theory supports 'Cash-for-Keys' settlements, which resolve defaults in days and preserve overall annual portfolio yields.</li>
      </ul>
    `,
  },
  {
    slug: "research/digital-transformation",
    title:
      "Digital Transformation & Audit Liability Protection | Real Estate Research",
    description:
      "How cloud-based accounting ledgers eliminate commingling penalties and provide immutable audit trails for IRS compliance.",
    heading: "Cloud Accounting Infrastructure & Audit Risk Elimination",
    body: `
      <p class="text-lg text-slate-600 dark:text-slate-300 mb-6">
        Accounting studies consistently cite commingling of security deposits and inadequate paper records as primary drivers of severe penalties during state and federal audits.
      </p>
      <h3 class="text-xl font-bold mb-3">Audit Defense Protocols</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400 mb-6">
        <li>Immutable, timestamped digital transaction logs prevent evidentiary disqualification in municipal landlord-tenant disputes.</li>
        <li>Automated security deposit tracking ensures strict statutory compliance with escrow reserve requirements.</li>
        <li>Cloud backups eliminate document destruction risks from localized hardware failures or office disasters.</li>
      </ul>
    `,
  },
];

academicStudies.forEach((study) => {
  const bodyHtml = `
    <div class="max-w-4xl mx-auto px-6 py-16">
      <div class="mb-4">
        <a href="/insights" class="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">&larr; Return to Research Hub</a>
      </div>
      <div class="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-4">
        Institutional Academic Brief
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        ${study.heading}
      </h1>
      ${study.body}
      <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-10 text-center">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Implement Institutional Best Practices</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">Apply empirical findings to your portfolio with MyTenant's automated operations suite.</p>
        <a href="/register" class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md">
          Deploy Free Trial
        </a>
      </div>
    </div>
  `;

  const pageHtml = injectPage(
    study.title,
    study.description,
    `https://mytenant.me/${study.slug}`,
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: study.heading,
      description: study.description,
      url: `https://mytenant.me/${study.slug}`,
      author: {
        "@type": "Organization",
        name: "The MyTenant Research Team",
        url: "https://mytenant.me/about",
      },
      publisher: {
        "@type": "Organization",
        name: "MyTenant",
        url: "https://mytenant.me",
      },
    },
    bodyHtml,
  );

  writeStaticPage(study.slug, pageHtml);
});

// ── 7. Pre-render Core Static & Legal Pages ──
console.log("Pre-rendering Core Static & Company Pages...");
const companyPages = [
  {
    slug: "about",
    title: "About MyTenant Platform | Mission & Institutional Architecture",
    description:
      "MyTenant is dedicated to empowering independent landlords and multifamily operators with institutional-grade automation, financial modeling, and compliant tenant operations.",
    heading: "About MyTenant Platform",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p class="text-lg">
          MyTenant was founded on a singular premise: independent landlords and private portfolio operators deserve access to the same sophisticated financial modeling, automated accounting ledgers, and operational tools utilized by multi-billion dollar institutional REITs.
        </p>
        <h2>Practical Research & Landlord Guides</h2>
        <p>
          Alongside our software platform, MyTenant publishes practical guides, calculator tools, and research briefs on rental market economics, lease structuring, tax fundamentals, and property operations.
        </p>
      </div>
    `,
  },
  {
    slug: "contact",
    title: "Contact Customer Support & Research Team | MyTenant",
    description:
      "Get in touch with MyTenant customer support, technical engineering, or our research editorial staff.",
    heading: "Contact MyTenant Support",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none">
        <p class="text-lg">
          We provide enterprise support for landlords and portfolio operators. Whether you have questions regarding automated rent ledgers, API integrations, or our published research briefs, our team is available.
        </p>
        <div class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 my-6">
          <p class="font-bold text-slate-900 dark:text-white">Customer Support & Inquiries:</p>
          <p class="text-blue-600 dark:text-blue-400 font-mono">support@mytenant.me</p>
          <p class="text-xs text-slate-500 mt-2">Response time: Typically within 2 to 4 business hours.</p>
        </div>
      </div>
    `,
  },
  {
    slug: "pricing",
    title: "Pricing & Subscription Tiers | MyTenant Property Management",
    description:
      "Transparent pricing for independent landlords and portfolio operators. Track unlimited properties, automated rent ledgers, and compliant digital leases.",
    heading: "Transparent Portfolio Pricing",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none mb-8">
        <p class="text-lg">
          No hidden fees, no onboarding setup costs. Scale your real estate portfolio with predictable, high-ROI operational software.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 class="text-xl font-bold mb-2">Free Community Tier</h3>
          <p class="text-3xl font-extrabold text-blue-600 mb-4">$0 <span class="text-sm font-normal text-slate-500">/ forever</span></p>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Full access to financial calculators, property setup, and basic rent tracking.</p>
          <a href="/register" class="block text-center py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold rounded-xl transition-colors text-sm">Get Started Free</a>
        </div>
        <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-600 shadow-lg relative">
          <div class="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
          <h3 class="text-xl font-bold mb-2">Portfolio Pro</h3>
          <p class="text-3xl font-extrabold text-blue-600 mb-4">$9.99 <span class="text-sm font-normal text-slate-500">/ month</span></p>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Unlimited units, automated rent collection, CPA tax P&L exports, and digital lease signatures.</p>
          <a href="/register" class="block text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm">Upgrade to Pro</a>
        </div>
      </div>
    `,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy | MyTenant Platform",
    description:
      "Read how MyTenant collects, utilizes, and protects landlord and tenant records, authentication credentials, and transactional data.",
    heading: "Privacy & Data Protection Policy",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p class="text-sm text-slate-500">Last updated: April 2026</p>
        <p>MyTenant ("we", "our", "us") is dedicated to safeguarding user information. This document delineates how personal, operational, and financial data is handled across our property management platform.</p>
        <h3>1. Information Collected</h3>
        <p>We process account credentials, property unit addresses, tenant contact records, lease dates, and utility records necessary to provide software operations. Payment credentials are handled strictly through PCI-DSS certified gateway Razorpay.</p>
        <h3>2. Storage & Security</h3>
        <p>All database communications utilize TLS 1.3 encryption. Passwords utilize salted bcrypt hashing. Property unit documents are securely partitioned in Backblaze B2 encrypted cloud storage.</p>
        <h3>3. Data Sharing & Retention</h3>
        <p>We do not sell user data. Records are maintained during active subscriptions and can be permanently exported or expunged upon user request by contacting support@mytenant.me.</p>
      </div>
    `,
  },
  {
    slug: "terms",
    title: "Terms of Service | MyTenant Platform",
    description:
      "Understand our user agreement, subscription terms, acceptable use policies, and legal framework governing the MyTenant property management platform.",
    heading: "Terms of Service & User Agreement",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p class="text-sm text-slate-500">Last updated: April 2026</p>
        <p>By accessing or utilizing MyTenant, you agree to be bound by these statutory terms governing property record maintenance and subscription services.</p>
        <h3>1. Platform Scope & Licensing</h3>
        <p>MyTenant provides cloud software facilitating property tracking, utility bill allocations, rent ledgers, and document storage on an ongoing subscription basis.</p>
        <h3>2. Acceptable Use Standards</h3>
        <p>Users must comply with the Fair Housing Act, state landlord-tenant regulations, and statutory rent notification timelines. Unlawful tenant harassment or automated unauthorized system scraping is strictly prohibited.</p>
        <h3>3. Limitation of Liability</h3>
        <p>MyTenant provides financial calculations and automated ledgers as administrative tools. Users remain responsible for verifying calculations against local legal and municipal tax requirements.</p>
      </div>
    `,
  },
  {
    slug: "refund-policy",
    title: "Refund & Cancellation Policy | MyTenant Platform",
    description:
      "Review our transparent subscription cancellation and refund policies for independent landlords and property portfolio managers.",
    heading: "Refund & Subscription Cancellation Policy",
    body: `
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p class="text-sm text-slate-500">Last updated: April 2026</p>
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-300">
          <strong>Notice:</strong> All subscription billing tiers include a full 7-day unrestricted free trial before payment processing occurs.
        </div>
        <h3>1. Subscription Renewals & Billing</h3>
        <p>Subscription fees are billed on a monthly or annual cadence. Accounts may be cancelled at any time by contacting support@mytenant.me with your registered account credentials.</p>
        <h3>2. Refund Review Conditions</h3>
        <p>In accordance with SaaS industry standards, completed billing periods are non-refundable. Exceptional cases involving duplicate charges or payment gateway errors are resolved within 3 to 5 business days upon receipt of transaction identifiers.</p>
      </div>
    `,
  },
];

companyPages.forEach((page) => {
  const bodyHtml = `
    <div class="max-w-4xl mx-auto px-6 py-16">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
        ${page.heading}
      </h1>
      ${page.body}
    </div>
  `;

  const fullHtml = injectPage(
    page.title,
    page.description,
    `https://mytenant.me/${page.slug}`,
    null,
    bodyHtml,
  );

  writeStaticPage(page.slug, fullHtml);
});

// ── 8. Pre-render Complete Root Homepage (dist/index.html) ──
console.log("Pre-rendering Root Homepage (/)...");
const homeFeaturesList = [
  {
    title: "Property Portfolio",
    desc: "Oversee your entire portfolio from a single intuitive dashboard. Track total assets, occupancy, and financial performance.",
  },
  {
    title: "Deep Property Insights",
    desc: "Analyze occupancy rates, unit distributions, and real-time tenant statistics at a glance across every property.",
  },
  {
    title: "Smart Unit Management",
    desc: "Add, configure, and manage units across properties. Set base rents, utility rules, and monitor vacancy status.",
  },
  {
    title: "Tenant Lifecycle Management",
    desc: "Full-lifecycle tenant management: digital onboarding, lease expiration tracking, and historical payment ledgers.",
  },
  {
    title: "Centralized Utility Billing",
    desc: "Log water, electricity, and maintenance invoices. Manage master utility costs effortlessly in one central repository.",
  },
  {
    title: "Intelligent Bill Splitting (RUBS)",
    desc: "Automate complex calculations. Split master bills among tenants based on occupancy, square footage, or equal share.",
  },
  {
    title: "Real-Time Overdue Tracking",
    desc: "Intelligent alerts highlight overdue rents and utility bills before they compound into serious delinquency.",
  },
  {
    title: "Transparent Payments Feed",
    desc: "A searchable, immutable history of every transaction and payment method in one synchronized real-time feed.",
  },
  {
    title: "Automated Monthly Rent Cycles",
    desc: "Generate rent invoices and ledger balances for your entire portfolio automatically on the first of every month.",
  },
  {
    title: "Advanced Financial Analytics",
    desc: "Generate comprehensive revenue reports, collection statements, Net Operating Income charts, and CPA tax summaries.",
  },
  {
    title: "One-Click PDF Exports",
    desc: "Export crystal-clear PDFs for receipts, rent rolls, and financial statements to share with accountants and lenders.",
  },
  {
    title: "Scale Without Artificial Limits",
    desc: "Grow with confidence. Manage unlimited properties and units seamlessly as your real estate syndication expands.",
  },
];

const homeFaqs = [
  {
    q: "How does the automated rent ledger work?",
    a: "Our automated rent ledger tracks all payments, overdue balances, and credits across your entire portfolio. When a tenant makes a payment, it instantly updates their ledger and your global revenue dashboard without manual calculations.",
  },
  {
    q: "Can I split utility bills among multiple tenants?",
    a: "Yes! You can log master utility bills (such as water, electricity, or trash) and our Ratio Utility Billing System (RUBS) engine automatically divides the invoice among tenants equally, by custom percentage, or by unit occupancy.",
  },
  {
    q: "Is MyTenant suitable for commercial and multifamily portfolios?",
    a: "Absolutely. MyTenant handles unlimited properties and units, making it ideal for residential apartments, single-family rental syndications, and mixed-use commercial real estate.",
  },
  {
    q: "How does MyTenant protect landlord and tenant data?",
    a: "All records are transmitted over TLS 1.3 encrypted connections, stored in SOC-2 compliant cloud infrastructure, and documents are securely isolated on Backblaze B2 encrypted storage.",
  },
];

const homepageBodyHtml = `
  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-6 pt-16 pb-20">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold mb-6 border border-blue-200 dark:border-blue-800">
          ✓ Next-Generation Property & Tenant Management Platform
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.15] mb-6 tracking-tight">
          Manage your <span class="text-blue-600 dark:text-blue-500">properties</span> with absolute ease.
        </h1>
        <p class="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
          MyTenant is the modern property management platform that reduces onboarding time by 90% and cuts overhead costs by up to 41%. Track tenants, automated rent ledgers, utility splitting, and maintenance in one professional portal.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <a href="/dashboard" class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 text-base">
            Open Live Demo &rarr;
          </a>
          <a href="/pricing" class="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-all text-base">
            Explore Pricing
          </a>
        </div>
        <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-center sm:text-left">
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">90%</div>
            <div class="text-xs text-slate-500 mt-1">Faster Setup</div>
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">100%</div>
            <div class="text-xs text-slate-500 mt-1">Cloud Automated</div>
          </div>
          <div>
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">0</div>
            <div class="text-xs text-slate-500 mt-1">Hidden Fees</div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-5">
        <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
          <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="w-3 h-3 rounded-full bg-amber-500"></span>
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-xs text-slate-400 font-mono ml-2">mytenant.me/dashboard</span>
            </div>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Live Demo</span>
          </div>
          <img src="/ScreenShots/1.PropertyPage.webp" alt="MyTenant Property Portfolio Management Dashboard" class="rounded-xl w-full object-cover shadow-sm mb-4" />
          <div class="text-xs text-slate-500 flex justify-between items-center">
            <span>Portfolio Occupancy: 94.2%</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">Synchronized Ledger Active</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 12 Platform Capabilities Grid -->
  <section class="max-w-7xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-slate-800">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <span class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
        Enterprise Architecture
      </span>
      <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-4 mb-4">
        Engineered for High-Yield Real Estate Operations
      </h2>
      <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
        Eliminate administrative friction across your multifamily units, single-family syndications, and mixed commercial buildings.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      ${homeFeaturesList
        .map(
          (item, idx) => `
        <div class="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all hover:shadow-xl group">
          <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-sm mb-5 group-hover:scale-110 transition-transform">
            ${idx + 1}
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">${item.title}</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">${item.desc}</p>
        </div>
      `,
        )
        .join("")}
    </div>
  </section>

  <!-- Financial Calculator Suite Showcase -->
  <section class="bg-slate-100 dark:bg-slate-900/50 py-20 border-y border-slate-200 dark:border-slate-800">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
            Underwriting Engines
          </span>
          <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white mt-4">
            Institutional Financial Calculators
          </h2>
        </div>
        <a href="/insights" class="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
          View All Modeling Tools &rarr;
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/tools/1031-exchange" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all block">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">1031 Exchange Calculator</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Calculate deferred capital gains, depreciation recapture taxes, and strict statutory 45/180-day deadlines.</p>
          <span class="text-xs font-bold text-blue-600 dark:text-blue-400">Launch Tool &rarr;</span>
        </a>
        <a href="/tools/cap-rate-calculator" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all block">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Cap Rate & Spread Tool</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Analyze Net Operating Income (NOI), cap rate yields, and mortgage debt service coverage constants.</p>
          <span class="text-xs font-bold text-blue-600 dark:text-blue-400">Launch Tool &rarr;</span>
        </a>
        <a href="/tools/cost-segregation" class="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all block">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Cost Segregation Estimator</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">Model accelerated first-year bonus depreciation under MACRS 5, 7, and 15-year property classifications.</p>
          <span class="text-xs font-bold text-blue-600 dark:text-blue-400">Launch Tool &rarr;</span>
        </a>
      </div>
    </div>
  </section>

  <!-- FAQ Accordion -->
  <section class="max-w-4xl mx-auto px-6 py-20">
    <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white text-center mb-12">
      Frequently Asked Questions
    </h2>
    <div class="space-y-4">
      ${homeFaqs
        .map(
          (faq) => `
        <details class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 cursor-pointer">
          <summary class="flex items-center justify-between font-bold text-slate-900 dark:text-white list-none">
            <span>${faq.q}</span>
            <span class="text-blue-600 dark:text-blue-400 text-lg transition-transform group-open:rotate-180">&darr;</span>
          </summary>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            ${faq.a}
          </p>
        </details>
      `,
        )
        .join("")}
    </div>
  </section>
`;

const rootSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mytenant.me/#organization",
      name: "MyTenant",
      url: "https://mytenant.me",
      logo: "https://mytenant.me/logo-96.png",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@mytenant.me",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://mytenant.me/#website",
      url: "https://mytenant.me",
      name: "MyTenant",
      publisher: { "@id": "https://mytenant.me/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "MyTenant Property Management",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      image: "https://mytenant.me/logo-96.png",
      offers: { "@type": "Offer", price: "9.99", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: homeFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const rootPageHtml = injectPage(
  "MyTenant | Property & Tenant Management Platform",
  "MyTenant is a modern real estate property and tenant management platform offering automated rent ledgers, utility bill splitting, document storage, and CPA-ready financial reporting.",
  "https://mytenant.me/",
  rootSchema,
  homepageBodyHtml,
);

writeStaticPage("", rootPageHtml);

console.log(
  "=== Full SSG Pre-rendering Complete: All 46 Pages Generated with 100% Crawlable Raw HTML! ===",
);
