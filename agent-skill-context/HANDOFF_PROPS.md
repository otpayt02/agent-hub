# Harness-Level Skill Handoff Props

Use these props when an agent runner, launcher, task template, or human kickoff prompt needs every agent to know where skill context lives and how to refresh it.

## Required props

```json
{
  "MASTER_AGENT_CONTEXT_ROOT": "%USERPROFILE%\\Projects\\agent-hub",
  "MASTER_AGENT_CONTEXT_INDEX": "agent-skill-context\\SKILLS_INDEX.md",
  "MASTER_AGENT_CONTEXT_INVENTORY": "agent-skill-context\\skill-inventory.json",
  "MASTER_AGENT_CONTEXT_SYNC_COMMAND": "powershell -ExecutionPolicy Bypass -File .\\scripts\\sync_agent_skill_context.ps1",
  "MASTER_AGENT_CONTEXT_GITHUB_REPO": "otpayt02/agent-hub",
  "MASTER_AGENT_CONTEXT_GITHUB_BRANCH": "master",
  "MASTER_AGENT_CONTEXT_DRIVE_FOLDER_ID": "1DA4A52L5Jd_bP7E_NyLQjEP1ohLKkPkD"
}
```

## Event props for skill creation

When an agent creates, installs, migrates, imports, or materially updates a skill, it should pass or report:

```json
{
  "SKILL_EVENT": "created|updated|installed|imported|migrated",
  "SKILL_SOURCE_PATHS": ["path\\to\\skill\\SKILL.md"],
  "SKILL_SYSTEM": "codex|qoder|hermes|skillmp|github|perplexity|other",
  "SKILL_PRIVACY": "public-index-ok|local-index-only|private-do-not-sync",
  "SKILL_SYNC_REQUIRED": true,
  "SKILL_SYNC_TARGETS": ["local-index", "github-agent-hub", "google-drive-agent-hub"],
  "SKILL_SYNC_EVIDENCE": "command output, commit SHA, Drive file ID, or blocker"
}
```

## Account-source boundaries

- Codex local skills: scan `%USERPROFILE%\.codex\skills`, `%USERPROFILE%\.codex\plugins\cache`, and `%USERPROFILE%\.codex\vendor_imports`.
- Qoder local skills/context: scan `%USERPROFILE%\.qoder` for `SKILL.md`, agent instruction files, and `.qoder\repowiki` public project context. Do not sync transcripts, auth, cache, shell snapshots, or temporary files.
- Hermes local skills: scan `%USERPROFILE%\Projects\hermes-agent` and `%USERPROFILE%\.hermes` when present.
- SkillMP/SkillsHub local skills: scan `%USERPROFILE%\.skillshub`.
- GitHub account skills: use the GitHub connector or selected local clones. Do not clone every repository automatically; first identify candidate repos and avoid secrets.
- Perplexity account skills: only scan local exported skill/context files or an authenticated connector export. Do not read browser profile databases, cookies, tokens, login data, or raw chat history as a skill source.

## Sync rule

Every agent that creates or discovers a reusable skill should refresh the local index before finishing:

```powershell
cd "%USERPROFILE%\Projects\agent-hub"
powershell -ExecutionPolicy Bypass -File ".\scripts\sync_agent_skill_context.ps1"
```

If the task is authorized to publish, the agent should then commit and push `agent-hub` and update the four Drive files in folder `1DA4A52L5Jd_bP7E_NyLQjEP1ohLKkPkD`.

If publish is not authorized, report the refreshed local count and leave GitHub/Drive pending.

## Prompt for future agents

```text
Before you start, use the master agent context at %USERPROFILE%\Projects\agent-hub.

Read AGENT_HUB.md first, then use agent-skill-context\AGENT_CONTEXT.md and agent-skill-context\SKILLS_INDEX.md to find relevant skills. Read only the specific SKILL.md files needed for this task.

If you create, install, import, migrate, or materially update any skill, refresh the master inventory before finishing:

cd "%USERPROFILE%\Projects\agent-hub"
powershell -ExecutionPolicy Bypass -File ".\scripts\sync_agent_skill_context.ps1"

Then report:
- skill event: created, updated, installed, imported, or migrated
- skill path(s)
- source system: Codex, Qoder, Hermes, SkillMP/SkillsHub, GitHub, Perplexity, or other
- privacy level: public-index-ok, local-index-only, or private-do-not-sync
- sync evidence: refreshed count, commit SHA, Drive file ID, or blocker

Do not read or sync browser profile stores, cookies, login data, tokens, transcripts, secrets, private customer data, or unrelated workspace files. Do not push to GitHub or upload to Drive unless this task explicitly authorizes that external sync.
```
