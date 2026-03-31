// scripts/extract-pdf.js
// Run with: node scripts/extract-pdf.js
// Extracts rules from EN and FR PDFs into JSON files for the app.

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ─── Section definitions ─────────────────────────────────────────────────────

const EN_SECTIONS = [
  { id: "preface",       title: "Preface",                             pattern: /^Preface\b/m },
  { id: "intro",         title: "Introduction",                        pattern: /^1\.\s+Introduction\b/m },
  { id: "spirit",        title: "Spirit of the Game",                  pattern: /^2\.\s+Spirit of the Game\b/m },
  { id: "definitions",   title: "Definitions",                         pattern: /^3\.\s+Definitions\b/m },
  { id: "field",         title: "Playing Field",                       pattern: /^4\.\s+Playing Field\b/m },
  { id: "equipment",     title: "Equipment",                           pattern: /^5\.\s+Equipment\b/m },
  { id: "game_structure",title: "Game Structure",                      pattern: /^6\.\s+Game Structure\b/m },
  { id: "timeouts",      title: "Timeouts",                            pattern: /^7\.\s+Timeouts\b/m },
  { id: "substitutions", title: "Player Substitutions",                pattern: /^8\.\s+Player Substitutions\b/m },
  { id: "pull",          title: "The Pull",                            pattern: /^9\.\s+The Pull\b/m },
  { id: "restarting",    title: "Restarting and Continuing Play",      pattern: /^10\.\s+Restarting and Continuing Play\b/m },
  { id: "bounds",        title: "In- and Out-of-bounds",               pattern: /^11\.\s+In-\s*and Out-of-bounds\b/m },
  { id: "endzone",       title: "End Zone Possession",                 pattern: /^12\.\s+End Zone Possession\b/m },
  { id: "scoring",       title: "Scoring",                             pattern: /^13\.\s+Scoring\b/m },
  { id: "turnovers",     title: "Turnovers",                           pattern: /^14\.\s+Turnovers\b/m },
  { id: "stalling",      title: "Stalling",                            pattern: /^15\.\s+Stalling\b/m },
  { id: "marking",       title: "Marking Violations",                  pattern: /^16\.\s+Marking Violations\b/m },
  { id: "calls",         title: "Making and Resolving Calls",          pattern: /^17\.\s+Making and Resolving Calls\b/m },
  { id: "travels",       title: "Travels",                             pattern: /^18\.\s+Travels\b/m },
  { id: "picks",         title: "Picks",                               pattern: /^19\.\s+Picks\b/m },
  { id: "fouls",         title: "Fouls",                               pattern: /^20\.\s+Fouls\b/m },
  { id: "positioning",   title: "Positioning",                         pattern: /^21\.\s+Positioning\b/m },
  { id: "observers",     title: "Observers",                           pattern: /^22\.\s+Observers\b/m },
  { id: "etiquette",     title: "Etiquette",                           pattern: /^23\.\s+Etiquette\b/m },
  { id: "appendix_a",   title: "Appendix A: Field Diagram",           pattern: /^Appendix A[:\s]/m },
  { id: "appendix_b",   title: "Appendix B: Mixed Rules",             pattern: /^Appendix B[:\s]/m },
  { id: "appendix_c",   title: "Appendix C: Misconduct System",       pattern: /^Appendix C[:\s]/m },
  { id: "appendix_d",   title: "Appendix D: Hand Signals",            pattern: /^Appendix D[:\s]/m },
  { id: "appendix_e",   title: "Appendix E: Youth Rules",             pattern: /^Appendix E[:\s]/m },
  { id: "appendix_f",   title: "Appendix F: Beach Ultimate",          pattern: /^Appendix F[:\s]/m },
  { id: "appendix_g",   title: "Appendix G: Ultimate 4's",            pattern: /^Appendix G[:\s]/m },
];

const FR_SECTIONS = [
  { id: "preface",       title: "Préface",                             pattern: /^Préface\b/m },
  { id: "intro",         title: "Introduction",                        pattern: /^1\.\s*Introduction\b/m },
  { id: "spirit",        title: "L'esprit du jeu",                    pattern: /^2\.\s*L.esprit du jeu\b/m },
  { id: "definitions",   title: "Définitions et terminologie",        pattern: /^3\.\s*Définitions/m },
  { id: "field",         title: "Terrain de jeu",                     pattern: /^4\.\s*Terrain de jeu\b/m },
  { id: "equipment",     title: "Équipement",                         pattern: /^5\.\s*Équipement\b/m },
  { id: "game_structure",title: "Durée du jeu",                       pattern: /^6\.\s*Durée du jeu\b/m },
  { id: "timeouts",      title: "Temps morts",                        pattern: /^7\.\s*Temps morts\b/m },
  { id: "substitutions", title: "Remplacements de joueurs",           pattern: /^8\.\s*Remplacements de joueurs\b/m },
  { id: "pull",          title: "Amorcer ou reprendre le jeu",        pattern: /^9\.\s*Amorcer ou reprendre le jeu\b/m },
  { id: "bounds",        title: "Intérieur des limites du terrain et hors limite", pattern: /^10\.\s*Int.rieur des limites/m },
  { id: "endzone",       title: "Possession dans la zone de but",     pattern: /^11\.\s*Possession dans la zone/m },
  { id: "scoring",       title: "Marquer des points",                 pattern: /^12\.\s*Marquer des points\b/m },
  { id: "turnovers",     title: "Revirements",                        pattern: /^13\.\s*Revirements\b/m },
  { id: "thrower",       title: "Le lanceur",                         pattern: /^14\.\s*Le lanceur\b/m },
  { id: "marker",        title: "Le marqueur",                        pattern: /^15\.\s*Le marqueur\b/m },
  { id: "receiver",      title: "Le receveur",                        pattern: /^16\.\s*Le receveur\b/m },
  { id: "fouls",         title: "Les violations et les fautes",       pattern: /^17\.\s*Les violations et les fautes\b/m },
  { id: "positioning",   title: "Positionnement",                     pattern: /^18\.\s*Positionnement\b/m },
  { id: "observers",     title: "Observateurs",                       pattern: /^19\.\s*Observateurs\b/m },
  { id: "etiquette",     title: "Étiquette",                          pattern: /^20\.\s*Étiquette\b/m },
  { id: "appendix_a",   title: "Annexe A : Diagramme du terrain",    pattern: /^Annexe A\s*[:\s]/m },
  { id: "appendix_b",   title: "Annexe B : Système d'inconduite",    pattern: /^Annexe B\s*[:\s]/m },
  { id: "appendix_c",   title: "Annexe C : Signaux",                 pattern: /^Annexe C\s*[:\s]/m },
  { id: "appendix_d",   title: "Annexe D : Règles pour les jeunes",  pattern: /^Annexe D\s*[:\s]/m },
  { id: "appendix_f",   title: "Annexe F : Ultimate 4x4",            pattern: /^Annexe F\s*[:\s]/m },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractKeywords(text, title) {
  // Extract meaningful words from title and first 500 chars of text
  const source = (title + " " + text.slice(0, 500)).toLowerCase();
  const stopwords = new Set([
    "the","a","an","and","or","of","to","in","is","are","be","by","for",
    "with","that","this","it","not","at","on","as","from","was","but","also",
    "any","may","must","shall","when","if","all","each","their","they","than",
    "les","des","une","est","que","qui","pas","par","sur","dans","avec","pour",
    "son","ses","leur","plus","mais","ou","donc","ni","car","ce","cet","cette",
    "au","aux","du","de","le","la","l","en","un","se","ne","il","ils","elle",
  ]);
  const words = source.match(/\b[a-záàâäéèêëîïôùûüç]{3,}\b/gi) || [];
  const freq = {};
  for (const w of words) {
    const lw = w.toLowerCase();
    if (!stopwords.has(lw)) freq[lw] = (freq[lw] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([w]) => w);
}

function cleanText(text) {
  return text
    .replace(/\f/g, "\n")              // form feeds → newlines
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")     // collapse excessive blank lines
    .replace(/[ \t]+/g, " ")          // collapse spaces/tabs
    .replace(/^\s+/gm, match => match.replace(/ /g, "")) // trim leading spaces per line
    .trim();
}

function splitIntoSections(rawText, sectionDefs) {
  const text = cleanText(rawText);
  const lines = text.split("\n");

  // Find the start index (in lines) for each section.
  // Skip ToC lines (contain "....." — table-of-contents dot leaders).
  const hits = [];
  for (const def of sectionDefs) {
    for (let i = 0; i < lines.length; i++) {
      // Skip ToC lines: EN uses "....N", FR uses trailing " N " (page number)
      const isTocLine = lines[i].includes("..") || /\s+\d+\s*$/.test(lines[i]);
      if (def.pattern.test(lines[i]) && !isTocLine) {
        hits.push({ ...def, lineIndex: i });
        break;
      }
    }
  }

  // Sort by line position
  hits.sort((a, b) => a.lineIndex - b.lineIndex);

  // Extract text between consecutive hits
  const sections = [];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].lineIndex;
    const end = i + 1 < hits.length ? hits[i + 1].lineIndex : lines.length;
    const sectionText = lines.slice(start, end).join("\n").trim();
    sections.push({
      id: hits[i].id,
      title: hits[i].title,
      keywords: extractKeywords(sectionText, hits[i].title),
      text: sectionText,
    });
  }

  return sections;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function extractPdf(pdfPath, sectionDefs, outPath, label) {
  console.log(`\n📄 Extracting ${label}...`);
  const buffer = readFileSync(pdfPath);
  const data = await pdfParse(buffer);
  console.log(`   Pages: ${data.numpages}, chars: ${data.text.length}`);

  const sections = splitIntoSections(data.text, sectionDefs);
  console.log(`   Sections found: ${sections.length}/${sectionDefs.length}`);
  for (const s of sections) {
    console.log(`   ✓ [${s.id}] ${s.title} (${s.text.length} chars)`);
  }

  writeFileSync(outPath, JSON.stringify(sections, null, 2), "utf8");
  console.log(`   Saved → ${outPath}`);
}

await extractPdf(
  join(root, "assets/rules_en.pdf"),
  EN_SECTIONS,
  join(root, "src/data/rules_en.json"),
  "English (2026-2027)"
);

await extractPdf(
  join(root, "assets/rules_fr.pdf"),
  FR_SECTIONS,
  join(root, "src/data/rules_fr.json"),
  "French (2024-2025)"
);

console.log("\n✅ Done! Both JSON files written to src/data/");
