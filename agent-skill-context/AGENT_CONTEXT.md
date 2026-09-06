# Master Agent Context

Generated: 2026-09-06T20:32:52.019Z

This directory is the local source of truth for cross-agent skill context. It extends the existing `agent-hub` repo instead of creating another hub.

## Scanned roots

- `%USERPROFILE%\Projects`
- `%USERPROFILE%\.agents`
- `%USERPROFILE%\.codex\skills`
- `%USERPROFILE%\.codex\plugins\cache`
- `%USERPROFILE%\.codex\vendor_imports`
- `%USERPROFILE%\.skillshub`
- `%USERPROFILE%\.qoder`
- `%USERPROFILE%\.hermes`
- `%USERPROFILE%\.perplexity-mcp`
- `%USERPROFILE%\GitNexus`
- `%USERPROFILE%\maka-gitnexus-integration`
- `%USERPROFILE%\Documents\GitHub`

## How agents should use this

1. Start with `AGENT_HUB.md` at the repo root for Oliver-level context.
2. Use `agent-skill-context/SKILLS_INDEX.md` to find agent-specific skills and instruction files.
3. Use `agent-skill-context/skill-inventory.json` for automation, diffing, or GitHub/Drive sync.
4. Use `agent-skill-context/HANDOFF_PROPS.md` when another agent or harness needs sync props.
5. Read only the relevant source `SKILL.md` or instruction file before applying that skill.

## Sync boundaries

- Local generation is allowed by running `scripts/sync_agent_skill_context.ps1`.
- GitHub sync should target `otpayt02/agent-hub` unless Oliver chooses a different repo.
- Google Drive sync needs an exact destination folder ID or URL before uploading.
- Do not upload credentials, browser stores, private customer data, or unrelated workspace files.
- Do not treat a skill index as authorization to execute external writes; get explicit target approval for each external destination.

## Current source families

- agent-instructions: 36
- agents-project-skills: 31
- claude-compatible-skills: 54
- claude-instructions: 9
- codex-global-skills: 52
- codex-vendor-import-skills: 39
- gitnexus-local-skills: 150
- hermes-core-skills: 82
- hermes-optional-skills: 117
- hermes-plugins: 1
- other-agent-context: 3
- perplexity-mcp-local: 2
- personalization: 1
- project-skills: 58
- qoder: 48
- skillmp-skillshub-local: 103
