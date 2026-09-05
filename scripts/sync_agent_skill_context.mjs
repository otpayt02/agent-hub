import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) {
    return fallback;
  }
  return args[index + 1];
}

const scriptRoot = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1");
const repoRoot = path.resolve(scriptRoot, "..");
const defaultProjectsRoot = process.env.USERPROFILE ? path.join(process.env.USERPROFILE, "Projects") : process.cwd();
const projectsRoot = path.resolve(readArg("--projects-root", defaultProjectsRoot));
const outputDir = path.resolve(readArg("--output-dir", path.join(repoRoot, "agent-skill-context")));
const userProfile = process.env.USERPROFILE ? path.resolve(process.env.USERPROFILE) : "";

function publicPathLabel(filePath) {
  const resolved = path.resolve(filePath);
  if (userProfile && resolved.toLowerCase().startsWith(userProfile.toLowerCase())) {
    return `%USERPROFILE%${resolved.slice(userProfile.length)}`;
  }
  return resolved;
}

const targetFileNames = new Set([
  "SKILL.md",
  "AGENTS.md",
  "CLAUDE.md",
  "CODEX_PERSONALIZATION_INSTRUCTIONS.md",
]);

function isQoderContext(filePath) {
  const normalized = filePath.toLowerCase().replaceAll("/", "\\");
  if (!normalized.includes("\\.qoder\\repowiki\\")) {
    return false;
  }
  return [".md", ".json", ".yaml", ".yml"].includes(path.extname(filePath).toLowerCase());
}

function isTargetFile(filePath) {
  return targetFileNames.has(path.basename(filePath)) || isQoderContext(filePath);
}

const skipSegments = new Set([
  ".git",
  ".next",
  ".turbo",
  ".venv",
  "__pycache__",
  "build",
  "dist",
  "node_modules",
  "site-packages",
]);

function hasSkippedSegment(filePath) {
  return filePath.split(/[\\/]/).some((part) => skipSegments.has(part));
}

function runRg() {
  const result = spawnSync(
    "rg",
    [
      "--files",
      "--hidden",
      "-g",
      "!**/.git/**",
      "-g",
      "!**/.next/**",
      "-g",
      "!**/.turbo/**",
      "-g",
      "!**/.venv/**",
      "-g",
      "!**/__pycache__/**",
      "-g",
      "!**/build/**",
      "-g",
      "!**/dist/**",
      "-g",
      "!**/node_modules/**",
      "-g",
      "!**/site-packages/**",
      "-g",
      "SKILL.md",
      "-g",
      "AGENTS.md",
      "-g",
      "CLAUDE.md",
      "-g",
      "CODEX_PERSONALIZATION_INSTRUCTIONS.md",
      "-g",
      "**/.qoder/**",
      projectsRoot,
    ],
    { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 }
  );

  if (result.status !== 0 && !result.stdout) {
    return null;
  }

  return result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map((filePath) => path.resolve(filePath));
}

function walk(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (hasSkippedSegment(fullPath)) {
      continue;
    }
    if (entry.isDirectory()) {
      walk(fullPath, found);
      continue;
    }
    if (entry.isFile() && isTargetFile(fullPath)) {
      found.push(fullPath);
    }
  }
  return found;
}

function projectName(filePath) {
  const relative = path.relative(projectsRoot, filePath);
  const first = relative.split(path.sep)[0];
  return first || ".";
}

function skillName(filePath) {
  return path.basename(path.dirname(filePath));
}

function sourceFamily(filePath) {
  const normalized = filePath.toLowerCase().replaceAll("/", "\\");
  if (/\\qoder\\|\\\.qoder\\|qoder/.test(normalized)) return "qoder";
  if (normalized.includes("\\hermes-agent\\optional-skills\\")) return "hermes-optional-skills";
  if (normalized.includes("\\hermes-agent\\skills\\")) return "hermes-core-skills";
  if (normalized.includes("\\hermes-agent\\plugins\\")) return "hermes-plugins";
  if (normalized.includes("\\.codex\\skills\\")) return "codex-project-skills";
  if (normalized.includes("\\.agents\\skills\\") || normalized.includes("\\agents\\skills\\")) return "agents-project-skills";
  if (normalized.includes("\\.claude\\skills\\")) return "claude-compatible-skills";
  if (normalized.includes("\\skills\\")) return "project-skills";
  if (normalized.endsWith("\\agents.md")) return "agent-instructions";
  if (normalized.endsWith("\\claude.md")) return "claude-instructions";
  if (normalized.endsWith("\\codex_personalization_instructions.md")) return "personalization";
  return "other-agent-context";
}

function artifactKind(filePath) {
  const base = path.basename(filePath);
  if (isQoderContext(filePath)) return "qoder-context";
  if (base === "SKILL.md") return "skill";
  if (base === "AGENTS.md") return "agent-instructions";
  if (base === "CLAUDE.md") return "claude-instructions";
  if (base === "CODEX_PERSONALIZATION_INSTRUCTIONS.md") return "personalization";
  return "context";
}

fs.mkdirSync(outputDir, { recursive: true });

const rawPaths = runRg() ?? walk(projectsRoot);
const filePaths = [...new Set(rawPaths.map((filePath) => path.resolve(filePath)))]
  .filter((filePath) => isTargetFile(filePath))
  .filter((filePath) => !hasSkippedSegment(filePath))
  .sort((a, b) => a.localeCompare(b));

const records = filePaths.map((filePath) => ({
  name: path.basename(filePath) === "SKILL.md" ? skillName(filePath) : path.basename(filePath),
  kind: artifactKind(filePath),
  source_family: sourceFamily(filePath),
  project: projectName(filePath),
  relative_path: path.relative(projectsRoot, filePath),
}));

const generatedAt = new Date().toISOString();
const inventory = {
  generated_at: generatedAt,
  projects_root: publicPathLabel(projectsRoot),
  output_dir: path.relative(repoRoot, outputDir) || ".",
  exclusions: [...skipSegments].sort(),
  total_records: records.length,
  records,
};

fs.writeFileSync(path.join(outputDir, "skill-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");

const byFamily = new Map();
for (const record of records) {
  const rows = byFamily.get(record.source_family) ?? [];
  rows.push(record);
  byFamily.set(record.source_family, rows);
}

const indexLines = [
  "# Agent Skill Index",
  "",
  `Generated: ${generatedAt}`,
  "",
  `Projects root: \`${publicPathLabel(projectsRoot)}\``,
  "",
  "This index is generated from local agent-facing files. It intentionally excludes dependency folders and build output.",
  "",
];

for (const family of [...byFamily.keys()].sort()) {
  indexLines.push(`## ${family}`, "");
  const rows = byFamily.get(family).sort((a, b) =>
    `${a.project}/${a.name}/${a.relative_path}`.localeCompare(`${b.project}/${b.name}/${b.relative_path}`)
  );
  for (const record of rows) {
    indexLines.push(`- \`${record.name}\` [${record.kind}] in \`${record.project}\` -> \`${record.relative_path}\``);
  }
  indexLines.push("");
}

if (!byFamily.has("qoder")) {
  indexLines.push("## qoder", "", "- No Qoder-specific agent or skill files were found in the current scan.", "");
}

fs.writeFileSync(path.join(outputDir, "SKILLS_INDEX.md"), `${indexLines.join("\n")}\n`, "utf8");

const contextLines = [
  "# Master Agent Context",
  "",
  `Generated: ${generatedAt}`,
  "",
  "This directory is the local source of truth for cross-agent skill context. It extends the existing `agent-hub` repo instead of creating another hub.",
  "",
  "## How agents should use this",
  "",
  "1. Start with `AGENT_HUB.md` at the repo root for Oliver-level context.",
  "2. Use `agent-skill-context/SKILLS_INDEX.md` to find agent-specific skills and instruction files.",
  "3. Use `agent-skill-context/skill-inventory.json` for automation, diffing, or GitHub/Drive sync.",
  "4. Read only the relevant source `SKILL.md` or instruction file before applying that skill.",
  "",
  "## Sync boundaries",
  "",
  "- Local generation is allowed by running `scripts/sync_agent_skill_context.ps1`.",
  "- GitHub sync should target `otpayt02/agent-hub` unless Oliver chooses a different repo.",
  "- Google Drive sync needs an exact destination folder ID or URL before uploading.",
  "- Do not upload credentials, browser stores, private customer data, or unrelated workspace files.",
  "- Do not treat a skill index as authorization to execute external writes; get explicit target approval for each external destination.",
  "",
  "## Current source families",
  "",
];

for (const family of [...byFamily.keys()].sort()) {
  contextLines.push(`- ${family}: ${byFamily.get(family).length}`);
}

if (!byFamily.has("qoder")) {
  contextLines.push("- qoder: 0");
}

fs.writeFileSync(path.join(outputDir, "AGENT_CONTEXT.md"), `${contextLines.join("\n")}\n`, "utf8");

console.log(`Wrote ${path.join(outputDir, "skill-inventory.json")}`);
console.log(`Wrote ${path.join(outputDir, "SKILLS_INDEX.md")}`);
console.log(`Wrote ${path.join(outputDir, "AGENT_CONTEXT.md")}`);
console.log(`Records: ${records.length}`);
