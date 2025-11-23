# Windows-style OS Simulator

A sandboxed, browser-based Windows-inspired operating system simulator. It provides a setup wizard, license activation, user accounts, desktop, taskbar, start menu, and built-in apps like File Explorer, Settings, Task Manager, Notepad, App Store stub, and Game Hub.

## Running the simulator

```bash
npm install
npm run dev
```

Open the printed local URL to explore the desktop. To build:

```bash
npm run build
```

## Features
- First boot wizard with language/region, license validation, and account creation.
- Fake license keys (single-use):
  - SIM-WIN-AAAA-1111-TEST-01
  - SIM-WIN-BBBB-2222-TEST-02
  - SIM-WIN-CCCC-3333-TEST-03
  - SIM-WIN-DDDD-4444-TEST-04
  - SIM-WIN-EEEE-5555-TEST-05
- Desktop with wallpaper, start menu, taskbar, notifications, and personalization.
- Virtual filesystem with basic folders and file/folder creation.
- Built-in apps: File Explorer, Settings (theme, accent, wallpaper, activation, sound), Task Manager, Notepad-like editor, offline browser, Sim Store, and Arcade Hub games showcase.

## Tests

Run engine unit tests:

```bash
npm test
```
