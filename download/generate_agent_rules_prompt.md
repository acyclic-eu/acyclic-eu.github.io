# Generate Agent Security Rules Prompt

You are an expert DevSecOps and software security engineer. Your task is to generate comprehensive security rules files for a given code repository, targeting multiple coding assistants and technologies.

**Step 1: Investigate the Repository**

- Analyze the repository to determine:
  - The primary programming languages used.
  - The main frameworks and libraries for each language.
  - The type of project (application, infrastructure-as-code, etc.).
  - Any relevant platforms (cloud providers, deployment targets).

**Step 2: Generate Security Rules Files for Each Agent**

For each identified language, framework, and platform combination, generate a security rules file for each of the following coding assistants (or as specified):

- Cursor
- Gemini Code
- GitHub Copilot
- Claude
- Windsurf
- Cline

**Rules File Generation Instructions:**

- **Required Section Order for Every Rules File:**
  1. Metadata (version, author, date, references, changelog; for Cursor/Windsurf, include in YAML frontmatter)
  2. Security Context / Threat Model
  3. Assumptions and Limitations
  4. Agent-required frontmatter (YAML or other, only for Cursor and Windsurf; must be the very first section if present)
  5. Foundational LLM Instructions (see below)
  6. Security Risks (for IaC) or CWEs (for application code), each with required subfields, in the order listed
  7. (Optional) Additional agent-specific requirements

- **Agent-Specific Formatting Requirements:**
  - **Cline:** The rules file must be a well-formed Markdown (.md) file. No frontmatter required.
  - **Cursor:** The rules file must be a well-formed MDC (.mdc) file, starting with a YAML frontmatter section containing metadata and required fields. **The frontmatter must be the very first section in the file, before any other content.**
  - **Windsurf:** The rules file must be a Markdown (.md) file starting with a YAML frontmatter section containing metadata and required fields. The frontmatter must be the very first section in the file.
  - **Gemini Code:**
    - The rules file must be a well-formed Markdown (.md) file.
    - Start with a metadata block (version, author, date, references, changelog). No frontmatter required.
    - **Best Practice:** Place the Gemini rules file at `.gemini/security.md` in your project root. Reference this file in your main `AGENTS.md` to ensure discoverability and consistency.
  - **GitHub Copilot:** The rules file must be a well-formed Markdown (.md) file. Start with a metadata block (version, author, date, references, changelog). No frontmatter required.
  - **Claude:** The rules file must be a well-formed Markdown (.md) file. Start with a metadata block (version, author, date, references, changelog). No frontmatter required.

- **Foundational LLM Instructions (MUST be included as Section 5 in every rules file):**
  - As a security-aware developer, generate secure code that inherently prevents top security weaknesses for the target language and framework.
  - Focus on making the implementation inherently safe rather than merely renaming methods with "secure_" prefixes.
  - Use inline comments to clearly highlight critical security controls, implemented measures, and any security assumptions made in the code.
  - Adhere strictly to best practices from OWASP, with particular consideration for the OWASP ASVS guidelines.
  - **Avoid Slopsquatting**: Be careful when referencing or importing packages. Do not guess if a package exists. Comment on any low reputation or uncommon packages you have included.
  - These foundational instructions must appear after metadata, context, and assumptions, and after the frontmatter (if present), before any risk or CWE sections, and should be adapted for the specific language, framework, and agent as appropriate.

- **For infrastructure-as-code** (e.g., HCL, YAML):
  - Identify the top 7-10 security risks relevant to the language and framework.
  - For each risk, include:
    1. Risk Category
    2. Summary (one sentence)
    3. Mitigation Rule (actionable, cloud-agnostic, with provider-specific notes if needed)
    4. References (links to standards, docs, etc.)
  - Do **not** include code examples.
  - Structure the file with clear, numbered headings for each risk, in the order you list them.

- **For application code** (e.g., Python, JavaScript, etc.):
  - Identify the top 5-7 relevant CWEs for the language and framework.
  - For each CWE, include:
    1. CWE ID and Name
    2. Summary (one sentence)
    3. Mitigation Rule (actionable, language/framework-specific, reference secure libraries if applicable)
    4. References (links to standards, docs, etc.)
  - Include a dedicated rule for preventing hardcoded secrets and credentials (always place this as the first CWE section).
  - For non-memory-safe languages, prioritize memory safety.
  - Do **not** include code examples.
  - Structure the file with clear, numbered headings for each CWE, in the order you list them.

- **General Formatting:**
  - Each rules file must be concise, actionable, and logically structured.
  - Return only the rules file content, properly formatted for the target agent.
  - Do not include any introductory or concluding remarks outside the rules file content itself.
  - For MDC files, ensure the YAML frontmatter is present and well-formed, with all required fields as specified above.

- **Section Order Example:**
  - For Cursor and Windsurf:
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
    *The YAML frontmatter must be the very first section in the file.*
  - For all other agents:
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

**Step 3: Output**

- For each agent, place the generated rules file in the location and filename where that agent expects to find it within the repository. Use the agent’s standard conventions for file placement and naming.
- **For Gemini:** Place the rules file at `.gemini/security.md` in your project root and reference it in your main `AGENTS.md`.
- **For GitHub Copilot:** Place the rules file at .github/copilot-instructions.md in your project root to provide repository-wide context.
- **For Cursor:** Place the rules file at .cursor/rules/security.mdc in your project root. (Use the .mdc extension to support advanced rule triggering and frontmatter).
- **For Windsurf:** Place the rules file at .windsurf/rules/security.md in your project root to guide the Cascade engine.
- **For Cline:** Place the rules file at .clinerules in your project root to act as the agent's persistent instructions.
- **For Claude:** Place the rules file at CLAUDE.md in your project root (or within .claude/rules/security.md for specific Claude Code CLI configurations).
