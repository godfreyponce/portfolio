# Portfolio Building Strategy: Choosing Your Workflow

This document outlines three distinct approaches to building your portfolio website inspired by `lduy.dev` and `karpathy.ai`.

## Option A: The "Agent" Approach (Gemini CLI)

**Concept:** You act as the Project Manager; the AI acts as the Lead Engineer. You provide the architecture and constraints (KERNEL prompt), and the AI executes the file creation, configuration, and build verification.

- **Pros:**
  - **Speed:** Instant setup of complex boilerplate (Next.js + Tailwind + Three.js).
  - **Correctness:** The AI verifies that the build compiles before finishing.
  - **Structure:** Guarantees a clean, industry-standard folder structure from the start.
- **Cons:**
  - **Less Muscle Memory:** You aren't physically typing every import statement, which can reduce retention for absolute beginners.
- **Best For:** 
  - Getting from "Zero" to "Working Prototype" immediately.
  - Handling the complex configuration of 3D libraries (React Three Fiber).

## Option B: The "IDE Assistant" Approach (Cursor + Claude)

**Concept:** You act as the Engineer; the AI acts as the Pair Programmer. You write the code in your editor, and the AI suggests completions or refactors specific blocks on command.

- **Pros:**
  - **Control:** You have granular control over every line of code as it's written.
  - **Learning:** Forces you to read and accept/reject changes line-by-line.
  - **Polishing:** Unbeatable for tweaking CSS values, animations, or specific text once the project exists.
- **Cons:**
  - **Slower Setup:** You must manually create files, folders, and install dependencies.
  - **Context Switching:** You have to manage the terminal and file system yourself.
- **Best For:** 
  - The "Polishing" phase.
  - Refactoring specific components.
  - Writing content/copy.

## Option C: The "Tutorial" Approach (YouTube)

**Concept:** You follow a video guide step-by-step.

- **Pros:**
  - **Visual Context:** You see the "why" and "how" of the creator's decision-making.
- **Cons:**
  - **Version Mismatches:** Next.js and React Three Fiber update frequently. Tutorials are often broken by the time you watch them.
  - **"Tutorial Hell":** You end up with a project you don't fully understand how to extend or customize.
  - **Generic Result:** Your site looks exactly like the tutorial, lacking your specific "soccer" or "lab" customizations.
- **Best For:** 
  - Learning specific concepts (e.g., "How does useFrame work in Three.js?") in isolation, not for building the whole project.

---

## Recommendation: The Hybrid Path

1.  **Phase 1 (Foundation):** Use **Option A (Gemini CLI)** to scaffold the project.
    - *Why?* It handles the boring setup (Tailwind config, Three.js canvas setup, file structure) instantly and error-free.
    - *Outcome:* A running local server with a working 3D element and placeholder sections.

2.  **Phase 2 (Polish):** Open the folder in **Cursor (Option B)**.
    - *Why?* Use Cursor to tweak the colors, write your actual bio, paste in your resume data, and play with the 3D model parameters.

3.  **Phase 3 (Reference):** Use **Option C (YouTube)** only if you get stuck on a specific 3D math concept or deployment issue.
