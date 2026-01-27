---
title: "How to Write Secure, Predictable Coding Rules Files for AI Assistants"
date: 2026-01-27
author: acyclic
description: "A practical guide to creating robust, security-focused rules files for Copilot, Gemini, Claude, and more."
categories: [security, AI, devsecops, best-practices]
---

# How to Write Secure, Predictable Coding Rules Files for AI Assistants

AI coding assistants like GitHub Copilot, Gemini Code, Claude, Cursor, and Windsurf are transforming the way we write and review code. But to harness their full potential—especially for security-critical projects—we need to provide them with clear, actionable, and robust rules files.

*This post is inspired by [Rules Files for Safer Vibe Coding](https://www.wiz.io/blog/safer-vibe-coding-rules-files) and the open-source [wiz-sec-public/secure-rules-files GitHub repository](https://github.com/wiz-sec-public/secure-rules-files).*

In this post, you'll learn a proven approach for crafting security rules files that are:
- **Predictable** in structure
- **Comprehensive** in coverage
- **Aligned** with industry best practices (OWASP, ASVS, etc.)
- **Ready** for all major AI coding agents

## Why Rules File Structure Matters

A well-structured rules file ensures that both humans and AI assistants:
- Understand the security context and threat model
- Apply consistent, principle-driven mitigations
- Avoid common pitfalls like slopsquatting or ambiguous package usage
- Can easily trace, update, and audit security guidance

## The Essential Rules File Template

Below is a summary of the recommended section order and content for every rules file, regardless of agent:

1. **Metadata** (version, author, date, references, changelog)
2. **Security Context / Threat Model**
3. **Assumptions and Limitations**
4. **Agent-required frontmatter** (YAML, only for Cursor/Windsurf)
5. **Foundational LLM Instructions** (security-aware coding, OWASP/ASVS, inline comments, no guessing, etc.)
6. **Security Risks or CWEs** (with summary, mitigation, and references for each)
7. **(Optional) Additional agent-specific requirements**

For full details and the latest template, see: [generate_agent_rules_prompt.md](/download/generate_agent_rules_prompt.md)

## Example Section Order

**For Cursor and Windsurf:**
```
---
# (YAML frontmatter with metadata)
---
## Security Context / Threat Model
(context)
## Assumptions and Limitations
(assumptions)
## Foundational LLM Instructions
(instructions)
## Security Risks / CWEs
(risk/CWE sections)
```

**For Copilot, Gemini, Claude, Cline:**
```
### Metadata
- version: 1.0
- author: Your Name
- date: 2026-01-27
- references: [https://owasp.org/ASVS/]
- changelog: [2026-01-27: Initial version]
## Security Context / Threat Model
(context)
## Assumptions and Limitations
(assumptions)
## Foundational LLM Instructions
(instructions)
## Security Risks / CWEs
(risk/CWE sections)
```

## Best Practices Checklist
- Use clear, actionable language
- Reference industry standards (OWASP, ASVS, CIS, etc.)
- Require inline comments for all security controls and assumptions
- Forbid code examples (to avoid misuse)
- Include references for every risk/CWE
- Keep the structure consistent across all files and agents

## Get Started

Ready to create your own secure rules files? Use the [generate_agent_rules_prompt.md](LINK-TO-YOUR-FILE) as your starting point and adapt it for your project and agents.

---

*Have questions or want to share your experience? Reach out via the contact form on acyclic.eu.*
