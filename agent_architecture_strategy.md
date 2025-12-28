# High-Performance Agent Architecture: The Orchestrator Pattern

To maximize performance for specific domains (Hardware, n8n, Web Dev) while maintaining a cohesive "learned memory," you should avoid the "Jack of all Trades" approach.

Instead, use the **Orchestrator (Router) Pattern**.

## 1. Why "Jack of all Trades" Fails
- **Context Pollution:** If you feed one agent instructions for hardware specs *and* React code, the prompt becomes huge. The model gets confused.
- **Tool Confusion:** An agent with 50 tools (search, file system, n8n API, hardware db) will often call the wrong tool.
- **KERNEL Violation:** It violates "Narrow Scope."

## 2. The Recommended Architecture: Hub & Spoke

### A. The Router (The "Boss")
This is a lightweight, fast model (e.g., Gemini Flash, GPT-4o-mini).
- **Sole Job:** Classify the user's intent.
- **Input:** "I need a monitor for coding."
- **Logic:** "Is this code? No. Is this automation? No. Is this hardware? Yes."
- **Action:** Route request to the **Hardware Specialist**.

### B. The Specialists (The "Department Heads")
These are heavy, smart models (e.g., Gemini Pro, Claude 3.5 Sonnet) with **specialized system prompts**.

1.  **Hardware Agent:**
    - *System Prompt:* "You are a hardware expert focusing on Mac compatibility and ergonomics..."
    - *Tools:* `web_search`, `price_check`.
2.  **n8n Agent:**
    - *System Prompt:* "You are an automation engineer specializing in n8n nodes and JSON logic..."
    - *Tools:* `read_workflow_json`, `n8n_docs_search`.
3.  **Web Agent (Me):**
    - *System Prompt:* "You are a senior React developer..."
    - *Tools:* `write_file`, `run_terminal`.

### C. The Shared Memory (The "Hippocampus")
This is the secret sauce. All agents must read/write to a **Central Memory Store**.

- **Structure:** A Vector Database (Pinecone/Weaviate) OR a structured file (`user_profile.json`).
- **Workflow:**
    1.  User: "I need a monitor."
    2.  Hardware Agent checks Memory: *finds {"budget": "student", "desk_space": "small"}*.
    3.  Hardware Agent: "Since you have a small desk, I recommend this 27-inch Dell..."
    4.  Hardware Agent saves to Memory: *{"preferred_monitor_size": "27-inch"}*.
    5.  (Later) Web Agent checks Memory: "I see you use a 27-inch monitor, so I'll ensure the website looks good on large desktop viewports."

## 3. Implementation in n8n

Since you use n8n, this is natively supported:

1.  **Start Node:** Triggers on chat message.
2.  **AI Agent (Router):** Uses a "Switch" node or a basic LLM prompt to output a category (Hardware, Code, General).
3.  **Switch Node:** Routes execution to the specific Sub-Workflow.
4.  **Sub-Workflow (Specialist):**
    - Loads Memory (Vector Store Tool).
    - Executes Task.
    - Updates Memory.
5.  **Final Node:** Returns answer to user.

## Summary
To maximize performance:
1.  **Narrow Scope:** Different agents for different domains.
2.  **Shared Context:** Centralized memory file/database.
3.  **Orchestration:** A router to direct traffic.
