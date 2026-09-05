# Master Agent Context

Generated: 2026-09-05T15:36:08.628Z

This directory is the local source of truth for cross-agent skill context. It extends the existing `agent-hub` repo instead of creating another hub.

## How agents should use this

1. Start with `AGENT_HUB.md` at the repo root for Oliver-level context.
2. Use `agent-skill-context/SKILLS_INDEX.md` to find agent-specific skills and instruction files.
3. Use `agent-skill-context/skill-inventory.json` for automation, diffing, or GitHub/Drive sync.
4. Read only the relevant source `SKILL.md` or instruction file before applying that skill.

## Sync boundaries

- Local generation is allowed by running `scripts/sync_agent_skill_context.ps1`.
- GitHub sync should target `otpayt02/agent-hub` unless Oliver chooses a different repo.
- Google Drive sync needs an exact destination folder ID or URL before uploading.
- Do not upload credentials, browser stores, private customer data, or unrelated workspace files.
- Do not treat a skill index as authorization to execute external writes; get explicit target approval for each external destination.

## Current source families

- agent-instructions: 28
- agents-project-skills: 22
- claude-compatible-skills: 6
- claude-instructions: 2
- codex-project-skills: 4
- hermes-core-skills: 82
- hermes-optional-skills: 117
- hermes-plugins: 1
- personalization: 1
- project-skills: 33
- qoder: 48
