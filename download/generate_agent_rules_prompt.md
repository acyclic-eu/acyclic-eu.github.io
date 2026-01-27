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

- Gemini Code
- GitHub Copilot
- Claude
- Cursor
- Windsurf
- Cline

**Rules File Generation Instructions:**

- **Required Section Order for Every Rules File:**
  1. Metadata (version, author, date, references, changelog; for Cursor/Windsurf, include as YAML frontmatter and place as the very first section in the file)
  2. Security Context / Threat Model
  3. Assumptions and Limitations
  4. Foundational LLM Instructions (see below)
  5. General Security Considerations (tailored to the tech stack; see example below)
  6. Security Risks (for IaC) or CWEs (for application code), each with required subfields, in the order listed
  7. (Optional) Additional agent-specific requirements

- **Section Order Example:**
    ```
      ---
    # (YAML frontmatter with metadata where applicable)
    ---
    ### Metadata
    - version: 1.0
    - author: Your Name
    - date: 2026-01-27 (date of generation)
    - references: [https://owasp.org/ASVS/]
    - changelog: [2026-01-27: Initial version] (add today.. keep previus)
    ## Security Context / Threat Model
    (context)
    ## Assumptions and Limitations
    (assumptions)
    ## Foundational LLM Instructions
    (instructions)
    ## General Security Considerations
    (general security principles)
    ## Security Risks / CWEs
    (risk/CWE sections)
    ```

- **General Security Considerations Section:**
  - This section should summarize high-level security principles relevant to the tech stack.
  - Example for JavaScript:
    ```markdown
    ## General Security Considerations
    *   **Memory Safety**: JavaScript is a garbage-collected, memory-safe language. Focus on preventing logical vulnerabilities rather than low-level memory errors.
    *   **Defense-in-Depth**: Implement security controls at multiple layers (frontend, backend, network) to provide comprehensive protection.
    *   **Least Privilege**: Design components and user roles with the minimum necessary permissions to perform their functions.
    *   **Secure by Default**: Choose libraries, frameworks, and configurations that prioritize security and safe defaults.
    ```
  - Adapt this section for each language/framework as appropriate.

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
  - The rules file must be a well-formed Markdown (.md) file.
  - Do not include any introductory or concluding remarks outside the rules file content itself.

**Step 3: Output**

- For all agents, rely on the common standard above for shared instructions and structure.
- For each agent, here follow a clear section with only the instructions that differ from the standard.

**Agent-Specific Formatting Requirements:**

- **Gemini Code:**
  - Place the generated rules file at `.gemini/security.md` in your project root and reference it in your main `AGENTS.md`.

- **GitHub Copilot:**
  - Place the generated rules file at `.github/copilot-instructions.md` in your project root to provide repository-wide context.

- **Claude:**
  - Place the generated rules file at `CLAUDE.md` in your project root (or within `.claude/rules/security.md` for specific Claude Code CLI configurations).

- **Cursor:**
  - The rules file must be a well-formed MDC (.mdc) file.
    -   Ensure the YAML frontmatter is present, first and well-formed, with all required fields:
      - description: "Critical security protocols and best practices for all code changes, dependency management, and repository operations."
      - alwaysApply: true
  - Place the generated rules file at `.cursor/rules/security.mdc` in your project root. (Use the .mdc extension to support advanced rule triggering and frontmatter).

- **Windsurf:**
  - The rules file must be a Markdown (.md) file.
    - Ensure the YAML frontmatter is present, first and well-formed, with all required fields:
      - description: "Critical security protocols and best practices for all code changes, dependency management, and repository operations."
      - always_on: true
  - Place the generated rules file at `.windsurf/rules/security.md` in your project root to guide the Cascade engine.

- **Cline:**
  - The rules file must be a well-formed Markdown (.md) file. No frontmatter required.
  - Place the generated rules file at `.clinerules` in your project root to act as the agent's persistent instructions.
