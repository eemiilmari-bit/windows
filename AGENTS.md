# AGENTS

This file defines the roles and responsibilities of a multi-agent system that collaboratively builds and maintains a **Windows-style OS simulator**. The simulator is purely virtual and does **not** ship or reuse proprietary Microsoft assets; it only mimics familiar patterns.

---

## 1. Product Architect Agent

**Primary Goal**  
Define the overall scope, features, constraints, and UX principles of the simulator.

**Responsibilities**
- Specify the core user journeys:
  - First boot → setup wizard → license key → account creation → desktop.
  - Everyday use: opening apps, managing windows, personalizing settings, checking Task Manager.
  - License management: entering keys, showing activation status, handling invalid/used keys.
- Decide feature scope for:
  - Desktop, taskbar, start menu / app launcher.
  - File explorer, settings, task manager, notifications.
  - Personalization: themes, wallpapers, accent color, sounds.
- Define realism level (Windows-inspired, not pixel-perfect clone).
- Define non-goals:
  - No real hardware access.
  - No real system calls; everything is simulated in memory.
  - No real Windows branding, assets, or copyrighted icons.

**Inputs**
- High-level user requirements.
- This AGENTS specification.

**Outputs**
- A structured specification document (e.g., `SPEC.md`) with:
  - Feature list and priorities.
  - User flows and state diagrams (textual).
  - Constraints and non-goals.

---

## 2. OS Simulation Engine Agent

**Primary Goal**  
Design and implement the **core simulation state and logic** (no UI), including windows, processes, license keys, and user accounts.

**Responsibilities**
- Model the OS state:
  - Current user and profile.
  - Installed/simulated apps.
  - Running processes and windows.
  - Virtual filesystem (folders, files, metadata).
  - Settings: theme, sounds, wallpaper, language.
- Implement license key logic:
  - Maintain a pool of **fake simulator keys**:
    - `SIM-WIN-AAAA-1111-TEST-01`
    - `SIM-WIN-BBBB-2222-TEST-02`
    - `SIM-WIN-CCCC-3333-TEST-03`
    - `SIM-WIN-DDDD-4444-TEST-04`
    - `SIM-WIN-EEEE-5555-TEST-05`
  - Keys can be used **once** each.
  - Store activation status:
    - Not activated
    - Activated with key `X`
    - Activation failed (invalid or already used)
  - Reject any keys not in the pool.
- Implement process & window management:
  - Open/close apps: Notepad-like editor, file explorer, settings, browser stub, task manager.
  - Track processes with:
    - pid, name, CPU%, memory%, status (Running, Suspended, Not Responding).
  - Allow “End task” to kill process and close its windows.
- Implement account system:
  - First-time setup:
    - Create a local account: username, optional password, profile color/icon.
  - Support multiple user profiles in the simulation (switch user / log out).
  - Store per-user settings (wallpaper, theme, pinned apps).
- Provide a clean API for the UI layer:
  - Query state: `getDesktopState`, `getTaskbarState`, `getProcesses`, `getLicensingStatus`, etc.
  - Mutations: `activateWithKey(key)`, `createUserAccount(...)`, `launchApp("explorer")`, `setTheme(settings)`.

**Inputs**
- Product specification.
- List of demo license keys (above).

**Outputs**
- Core engine implementation (modules/classes).
- Documentation of public API for the UI layer.

---

## 3. UI / UX Agent

**Primary Goal**  
Design the **visual layer** and user interactions for a Windows-inspired interface.

**Responsibilities**
- Create a desktop UI:
  - Background wallpaper.
  - Desktop icons (generic, non-branded).
  - Selection rectangle, drag & drop for icons (nice-to-have).
- Taskbar and start launcher:
  - Left area: “start” button (abstract icon), pinned apps.
  - Middle: open app thumbnails / window groups.
  - Right: clock, network/status icons, notifications entry point.
- Windows:
  - Title bar with app name, minimize, maximize/restore, close.
  - Resizable, draggable, z-order (bring to front on click).
- Key built-in apps (UI shells):
  - **Setup Wizard** (on first boot):
    - Language & region step (just a form).
    - License key step (input, validation feedback).
    - Account creation step (username, password, avatar color).
  - **Settings** app:
    - Sections: System, Personalization, Accounts, Activation, Sound.
  - **File Explorer**:
    - Sidebar (Quick Access, This PC, user folders).
    - Main pane (grid/list of files with icons).
  - **Task Manager**:
    - Tabs: Processes, Performance (optional simple graphs).
    - CPU/memory usage fake metrics driven by simulation engine.
  - **Notepad-like editor**:
    - Simple text editing & saving to the simulated filesystem.
- Personalization:
  - Theme picker (light/dark).
  - Accent color selection.
  - Wallpaper selection from a small curated set.
- Style & animation guidelines:
  - Flat, modern UI with subtle shadows and rounded corners.
  - Smooth but fast animations:
    - Window open/close: slight fade + scale or slide.
    - Hover states for buttons and taskbar items.
  - Avoid copying actual Windows icons; design simple, generic icons.

**Inputs**
- Engine API.
- Style guidelines from Product Architect.

**Outputs**
- UI layout and interaction design.
- Component hierarchy / design system.
- Implementation of views wired to the engine API.

---

## 4. Audio & Feedback Agent

**Primary Goal**  
Define and wire up **sound design and micro-feedback** for realism.

**Responsibilities**
- Sound events:
  - Startup jingle (short, original chime).
  - Shutdown/logoff sound.
  - Notification sound.
  - Error/beep sound.
  - Click / button press feedback (optional).
- Implementation guidance:
  - Provide abstract sound IDs (e.g., `os.startup`, `os.shutdown`, `ui.notification`, `ui.error`, `ui.click`).
  - UI layer triggers sound IDs; actual sound files are simple placeholders.
  - All sounds must be original or royalty-free, not actual Windows audio.
- Visual feedback:
  - Animated toasts for notifications (slide from bottom-right).
  - Loading spinners or skeleton screens when apps “launch”.

**Inputs**
- Product spec.
- UI event list.

**Outputs**
- Sound event map and guidelines.
- Hooks/utility functions for playing sounds.

---

## 5. QA / Test Agent

**Primary Goal**  
Continuously test the simulator and ensure flows feel coherent and “OS-like”.

**Responsibilities**
- Test scenarios:
  - Fresh install:
    - Boot → setup wizard → try invalid key → see error.
    - Try used key → see “already used” message.
    - Use valid key → activation success.
    - Create first user → auto-login to desktop.
  - Everyday use:
    - Launch multiple apps and switch between windows.
    - Use Task Manager to end frozen apps.
    - Change themes and wallpapers; verify they persist per user.
    - Log out / switch user; verify separation of profiles.
  - Edge cases:
    - Try reusing a consumed license key.
    - Simulate a “Not Responding” app and end it from Task Manager.
- Define automated tests where possible (unit tests for engine, integration tests for basic flows).

**Inputs**
- Built simulator.
- Specs and engine API.

**Outputs**
- Test plans and checklists.
- Bug reports and suggested fixes or simplifications.

---

## 6. Orchestrator Agent

**Primary Goal**  
Coordinate all other agents to converge on a working, coherent simulator.

**Responsibilities**
- Break work into stages:
  1. Draft spec.
  2. Implement core engine.
  3. Implement UI/UX.
  4. Wire sounds & micro-feedback.
  5. QA and polish.
- Ensure interface contracts between engine and UI remain stable.
- Ask for clarifications only when absolutely necessary; otherwise, make reasonable assumptions.

**Inputs**
- This AGENTS definition.
- User’s top-level goal and constraints (platform, tech stack, deadline).

**Outputs**
- Sequenced task plan.
- Final integrated simulator build (or repo).
