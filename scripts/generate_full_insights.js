import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { part1 } from "./insights_part1.js";
import { part2 } from "./insights_part2.js";
import { part3 } from "./insights_part3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allInsights = [...part1, ...part2, ...part3];

console.log(`Total articles prepared: ${allInsights.length}`);

let totalWords = 0;
allInsights.forEach((article, index) => {
  const wordCount = article.content.trim().split(/\s+/).length;
  totalWords += wordCount;
  console.log(
    `[${index + 1}/18] ${article.slug}: ${wordCount} words (Author: ${article.author})`,
  );
});

const avgWords = Math.round(totalWords / allInsights.length);
console.log(
  `Total words: ${totalWords} | Average per article: ${avgWords} words`,
);

const targetPath = path.join(
  __dirname,
  "..",
  "frontend",
  "src",
  "data",
  "insights.js",
);

const fileHeader = `// Practical Landlord Guides & Operational Insights
// Published by The MyTenant Research Team
// Focused on Real Estate Economics, Portfolio Accounting & Operations

export const insights = ${JSON.stringify(allInsights, null, 2)};
`;

fs.writeFileSync(targetPath, fileHeader, "utf-8");
console.log(
  `Successfully updated ${targetPath} with full institutional content!`,
);
