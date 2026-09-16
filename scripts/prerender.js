import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";
import { marked } from '../frontend/node_modules/marked/lib/marked.esm.js';
import { insights } from "../frontend/src/data/insights.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, "..", "frontend", "dist");

console.log(
  "--- Starting MyTenant Static Site Generation (SSG) Pre-renderer ---",
);

if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist. Run vite build first.");
  process.exit(1);
}

const templatePath = path.join(distDir, "index.html");
const baseTemplate = fs.readFileSync(templatePath, "utf-8");

// Helper to write file and compress with gzip and brotli
function writeStaticPage(subPath, htmlContent) {
  const targetDir = path.join(distDir, subPath);
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
    `✓ Pre-rendered: /${subPath}/index.html (${Math.round(htmlContent.length / 1024)} KB)`,
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
    <div class="lg:col-span-2">
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
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Features</h4>
      <ul class="space-y-2.5">
        <li><a href="/features/rent-ledger" class="hover:text-blue-400 transition-colors">Automated Rent Ledger</a></li>
        <li><a href="/features/bill-splitting" class="hover:text-blue-400 transition-colors">Intelligent Bill Splitting</a></li>
        <li><a href="/features/tenant-tracking" class="hover:text-blue-400 transition-colors">Tenant Profiles & Leases</a></li>
        <li><a href="/features/auto-signatures" class="hover:text-blue-400 transition-colors">Digital Signatures</a></li>
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
      <h4 class="text-white font-bold mb-4 text-sm uppercase tracking-wider">Research & Company</h4>
      <ul class="space-y-2.5">
        <li><a href="/insights" class="hover:text-blue-400 transition-colors font-semibold text-blue-400">Landlord Insights Hub</a></li>
        <li><a href="/about" class="hover:text-blue-400 transition-colors">About MyTenant</a></li>
        <li><a href="/pricing" class="hover:text-blue-400 transition-colors">Pricing & Plans</a></li>
        <li><a href="/contact" class="hover:text-blue-400 transition-colors">Contact Support</a></li>
        <li><a href="/privacy-policy" class="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
        <li><a href="/terms" class="hover:text-blue-400 transition-colors">Terms of Service</a></li>
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

  const bodyStartTag = '<body>';
  const bodyEndTag = '</body>';
  const bodyStartIndex = html.indexOf(bodyStartTag);
  const bodyEndIndex = html.indexOf(bodyEndTag);

  if (bodyStartIndex !== -1 && bodyEndIndex !== -1) {
    const preBody = html.substring(0, bodyStartIndex + bodyStartTag.length);
    const postBody = html.substring(bodyEndIndex);
    html = `${preBody}\n    <div id="root">${fullBody}</div>\n  ${postBody}`;
  }

  return html;
}

// ── 1. Pre-render All 18 Insight Articles ──
console.log("Pre-rendering 18 Insight Articles...");
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
      "@type": "Person",
      name: article.author,
      jobTitle: "Principal Real Estate & Housing Quantitative Analyst",
      worksFor: {
        "@type": "Organization",
        name: "MyTenant Operations & Research Lab",
      },
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
          Peer-Reviewed Institutional Analysis
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
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">MyTenant Quantitative Operations & Research Lab</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              ✓ Verified Institutional Analysis • Reviewed August 2026
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

// ── 4. Pre-render Core Static & Legal Pages ──
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
        <h2>Our Quantitative Operations & Research Lab</h2>
        <p>
          Beyond building cloud-native property management software, MyTenant maintains an active quantitative research division. We publish peer-reviewed economic briefs analyzing search frictions in rental markets, macro interest rate spreads, MACRS cost segregation depreciation structures, and regulatory compliance under the Fair Housing Act.
        </p>
      </div>
    `,
  },
  {
    slug: "contact",
    title: "Contact Customer Support & Research Team | MyTenant",
    description:
      "Get in touch with MyTenant customer support, technical engineering, or our quantitative research editorial staff.",
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

console.log(
  "--- SSG Pre-rendering Complete: All pages generated with 100% crawlable raw HTML! ---",
);
