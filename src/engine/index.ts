import { nanoid } from '../utils/nanoid';
import {
  AppDefinition,
  DesktopState,
  FileEntry,
  FileSystemEntry,
  FolderEntry,
  LicenseStatus,
  NotificationItem,
  ProcessInfo,
  SessionState,
  SettingsState,
  TaskbarState,
  UserPreferences,
  UserProfile,
  WindowInfo,
} from './types';

const LICENSE_POOL = [
  'SIM-WIN-AAAA-1111-TEST-01',
  'SIM-WIN-BBBB-2222-TEST-02',
  'SIM-WIN-CCCC-3333-TEST-03',
  'SIM-WIN-DDDD-4444-TEST-04',
  'SIM-WIN-EEEE-5555-TEST-05',
];

const DEFAULT_PREFERENCES: UserPreferences = {
  wallpaper: 'gradient-1',
  theme: 'light',
  accent: '#4f46e5',
  pinnedApps: ['explorer', 'settings', 'notepad', 'task-manager', 'app-store', 'game-hub'],
  soundEnabled: true,
};

const APPS: AppDefinition[] = [
  { id: 'explorer', name: 'File Explorer', icon: '🗂️', defaultSize: { width: 960, height: 640 }, singleInstance: true },
  { id: 'settings', name: 'Settings', icon: '⚙️', defaultSize: { width: 960, height: 640 }, singleInstance: true },
  { id: 'task-manager', name: 'Task Manager', icon: '📊', defaultSize: { width: 840, height: 560 }, singleInstance: true },
  { id: 'notepad', name: 'Notepad', icon: '📝', defaultSize: { width: 720, height: 520 } },
  { id: 'browser', name: 'Offline Browser', icon: '🌐', defaultSize: { width: 1080, height: 720 } },
  { id: 'app-store', name: 'Sim Store', icon: '🏪', defaultSize: { width: 900, height: 620 }, singleInstance: true },
  { id: 'game-hub', name: 'Arcade Hub', icon: '🎮', defaultSize: { width: 940, height: 620 } },
];

export class OSEngine {
  private sessionState: SessionState = 'booting';
  private licenseStatus: LicenseStatus = { state: 'NOT_ACTIVATED' };
  private consumedKeys = new Set<string>();
  private users: UserProfile[] = [];
  private currentUserId: string | null = null;
  private filesystem = new Map<string, FileSystemEntry>();
  private processes = new Map<number, ProcessInfo>();
  private windows = new Map<string, WindowInfo>();
  private notifications: NotificationItem[] = [];
  private clockInterval: number | null = null;
  private zTracker = 1;
  private listeners: (() => void)[] = [];
  private bootTimeout: number | undefined;

  constructor() {
    this.initializeBoot();
  }

  private initializeBoot() {
    if (typeof setTimeout !== 'undefined') {
      this.bootTimeout = setTimeout(() => {
        this.sessionState = 'setup';
        this.emit();
      }, 750) as unknown as number;
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit() {
    this.listeners.forEach((l) => l());
  }

  getSessionState(): SessionState {
    return this.sessionState;
  }

  getLicenseStatus(): LicenseStatus {
    return this.licenseStatus;
  }

  activateWithKey(key: string): LicenseStatus {
    const normalized = key.trim().toUpperCase();
    const pattern = /^SIM-WIN-[A-Z]{4}-\d{4}-TEST-\d{2}$/;
    if (!pattern.test(normalized)) {
      this.licenseStatus = { state: 'ACTIVATION_FAILED', reason: 'Invalid key format' };
      this.emit();
      return this.licenseStatus;
    }

    if (!LICENSE_POOL.includes(normalized)) {
      this.licenseStatus = { state: 'ACTIVATION_FAILED', reason: 'Key not recognized' };
      this.emit();
      return this.licenseStatus;
    }

    if (this.consumedKeys.has(normalized)) {
      this.licenseStatus = { state: 'ACTIVATION_FAILED', reason: 'This key is already in use.' };
      this.emit();
      return this.licenseStatus;
    }

    this.consumedKeys.add(normalized);
    this.licenseStatus = { state: 'ACTIVATED', key: normalized };
    this.emit();
    return this.licenseStatus;
  }

  createUserAccount(username: string, password: string | undefined, avatarColor: string) {
    if (this.users.find((u) => u.username === username)) {
      throw new Error('User already exists');
    }
    const id = nanoid();
    const profile: UserProfile = {
      id,
      username,
      password,
      avatarColor,
      preferences: { ...DEFAULT_PREFERENCES },
    };
    this.users.push(profile);
    this.currentUserId = id;
    this.sessionState = 'loggedIn';
    this.seedFileSystemForUser(profile.username);
    this.startClock();
    this.emit();
  }

  listUsers() {
    return [...this.users];
  }

  switchUser(id: string) {
    if (!this.users.find((u) => u.id === id)) return;
    this.currentUserId = id;
    this.sessionState = 'loggedIn';
    this.startClock();
    this.emit();
  }

  logout() {
    this.currentUserId = null;
    this.sessionState = 'setup';
    this.stopClock();
    this.emit();
  }

  getCurrentUser(): UserProfile | null {
    return this.users.find((u) => u.id === this.currentUserId) ?? null;
  }

  getSettings(): SettingsState {
    const user = this.getCurrentUser();
    const prefs = user?.preferences ?? DEFAULT_PREFERENCES;
    return {
      theme: prefs.theme,
      accent: prefs.accent,
      wallpaper: prefs.wallpaper,
      soundEnabled: prefs.soundEnabled,
    };
  }

  updateSettings(partial: Partial<SettingsState>) {
    const user = this.getCurrentUser();
    if (!user) return;
    user.preferences = { ...user.preferences, ...partial };
    this.emit();
  }

  private seedFileSystemForUser(username: string) {
    const base = `C:/Users/${username}`;
    const desktop: FolderEntry = {
      type: 'folder',
      name: 'Desktop',
      path: `${base}/Desktop`,
      icon: '🖥️',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    };
    const documents: FolderEntry = {
      type: 'folder',
      name: 'Documents',
      path: `${base}/Documents`,
      icon: '📄',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    };
    const programFiles: FolderEntry = {
      type: 'folder',
      name: 'Program Files',
      path: 'C:/Program Files',
      icon: '📦',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    };
    const readme: FileEntry = {
      type: 'file',
      name: 'Welcome.txt',
      path: `${base}/Desktop/Welcome.txt`,
      icon: '📝',
      created: Date.now(),
      modified: Date.now(),
      size: 120,
      content: 'Welcome to the simulator! Open apps from the start menu to explore.',
    };

    [desktop, documents, programFiles, readme].forEach((entry) => {
      this.filesystem.set(entry.path, entry);
    });
    desktop.children.push(readme.path);
  }

  listDirectory(path: string): FileSystemEntry[] {
    const folder = this.filesystem.get(path);
    if (!folder || folder.type !== 'folder') return [];
    return folder.children.map((p) => this.filesystem.get(p)).filter(Boolean) as FileSystemEntry[];
  }

  createFolder(path: string, name: string): FolderEntry {
    const folder = this.filesystem.get(path);
    if (!folder || folder.type !== 'folder') throw new Error('Invalid parent');
    const newPath = `${path}/${name}`;
    const entry: FolderEntry = {
      type: 'folder',
      name,
      path: newPath,
      icon: '📁',
      created: Date.now(),
      modified: Date.now(),
      children: [],
    };
    folder.children.push(newPath);
    this.filesystem.set(newPath, entry);
    this.emit();
    return entry;
  }

  createFile(path: string, name: string, content = ''): FileEntry {
    const folder = this.filesystem.get(path);
    if (!folder || folder.type !== 'folder') throw new Error('Invalid parent');
    const newPath = `${path}/${name}`;
    const entry: FileEntry = {
      type: 'file',
      name,
      path: newPath,
      icon: '📄',
      created: Date.now(),
      modified: Date.now(),
      size: content.length,
      content,
    };
    folder.children.push(newPath);
    this.filesystem.set(newPath, entry);
    this.emit();
    return entry;
  }

  updateFile(path: string, content: string) {
    const entry = this.filesystem.get(path);
    if (!entry || entry.type !== 'file') throw new Error('Not a file');
    entry.content = content;
    entry.modified = Date.now();
    entry.size = content.length;
    this.emit();
  }

  renameEntry(path: string, newName: string) {
    const entry = this.filesystem.get(path);
    if (!entry) throw new Error('Entry missing');
    const newPath = path.split('/').slice(0, -1).concat(newName).join('/');
    entry.name = newName;
    this.filesystem.delete(path);
    this.filesystem.set(newPath, entry);
    this.emit();
  }

  deleteEntry(path: string) {
    const entry = this.filesystem.get(path);
    if (!entry) return;
    this.filesystem.delete(path);
    const parentPath = path.split('/').slice(0, -1).join('/');
    const parent = this.filesystem.get(parentPath);
    if (parent && parent.type === 'folder') {
      parent.children = parent.children.filter((c) => c !== path);
    }
    if (entry.type === 'folder') {
      entry.children.forEach((child) => this.deleteEntry(child));
    }
    this.emit();
  }

  getDesktopState(): DesktopState {
    const user = this.getCurrentUser();
    const wallpaper = user?.preferences.wallpaper ?? DEFAULT_PREFERENCES.wallpaper;
    const base = user ? `C:/Users/${user.username}/Desktop` : 'C:/Users/Default/Desktop';
    const desktopFolder = this.filesystem.get(base);
    const children: FileSystemEntry[] = desktopFolder && desktopFolder.type === 'folder'
      ? desktopFolder.children.map((p) => this.filesystem.get(p)).filter(Boolean) as FileSystemEntry[]
      : [];
    const icons = [
      { title: 'This PC', appId: 'explorer', icon: '💻' },
      { title: 'Recycle Bin', icon: '🗑️' },
      { title: 'Settings', appId: 'settings', icon: '⚙️' },
      { title: 'User Files', appId: 'explorer', path: base, icon: '📁' },
      ...children.map((entry) => ({ title: entry.name, icon: entry.icon, path: entry.path, appId: entry.type === 'file' ? 'notepad' : 'explorer' })),
    ];
    return { wallpaper, icons };
  }

  getTaskbarState(): TaskbarState {
    const prefs = this.getCurrentUser()?.preferences ?? DEFAULT_PREFERENCES;
    const running = Array.from(this.processes.values()).map((p) => p.pid);
    const now = new Date();
    const clock = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { pinned: prefs.pinnedApps, running, clock };
  }

  getProcesses(): ProcessInfo[] {
    return Array.from(this.processes.values());
  }

  getWindows(): WindowInfo[] {
    return Array.from(this.windows.values()).sort((a, b) => a.zIndex - b.zIndex);
  }

  launchApp(appId: string): { pid: number; windowId: string } {
    const app = APPS.find((a) => a.id === appId);
    if (!app) throw new Error('Unknown app');
    if (app.singleInstance) {
      const existing = Array.from(this.processes.values()).find((p) => p.appId === appId);
      if (existing) {
        const existingWindow = Array.from(this.windows.values()).find((w) => w.pid === existing.pid);
        if (existingWindow) this.focusWindow(existingWindow.windowId);
        return { pid: existing.pid, windowId: existingWindow?.windowId ?? '' };
      }
    }
    const pid = Math.floor(Math.random() * 100000);
    const process: ProcessInfo = {
      pid,
      appId,
      name: app.name,
      cpuUsage: Math.random() * 10,
      memoryUsage: Math.random() * 40 + 60,
      status: 'Running',
    };
    this.processes.set(pid, process);
    const windowId = nanoid();
    this.windows.set(windowId, {
      windowId,
      pid,
      appId,
      title: app.name,
      position: { x: 160 + Math.random() * 120, y: 120 + Math.random() * 80 },
      size: app.defaultSize,
      zIndex: ++this.zTracker,
      isMinimized: false,
      isMaximized: false,
    });
    this.pushNotification({ title: `${app.name} launched`, body: 'The app is now running.' });
    this.emit();
    return { pid, windowId };
  }

  endProcess(pid: number) {
    this.processes.delete(pid);
    Array.from(this.windows.values())
      .filter((w) => w.pid === pid)
      .forEach((w) => this.windows.delete(w.windowId));
    this.emit();
  }

  closeWindow(windowId: string) {
    const window = this.windows.get(windowId);
    if (!window) return;
    this.windows.delete(windowId);
    this.processes.delete(window.pid);
    this.emit();
  }

  minimizeWindow(windowId: string) {
    const window = this.windows.get(windowId);
    if (!window) return;
    window.isMinimized = true;
    this.emit();
  }

  toggleMaximize(windowId: string) {
    const window = this.windows.get(windowId);
    if (!window) return;
    window.isMaximized = !window.isMaximized;
    this.emit();
  }

  focusWindow(windowId: string) {
    const window = this.windows.get(windowId);
    if (!window) return;
    window.isMinimized = false;
    window.zIndex = ++this.zTracker;
    this.emit();
  }

  getNotifications() {
    return this.notifications;
  }

  pushNotification(item: { title: string; body: string }) {
    const notification: NotificationItem = {
      id: nanoid(),
      title: item.title,
      body: item.body,
      timestamp: Date.now(),
      read: false,
    };
    this.notifications = [notification, ...this.notifications].slice(0, 5);
    this.emit();
  }

  markNotificationRead(id: string) {
    this.notifications = this.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.emit();
  }

  getApps() {
    return APPS;
  }

  private startClock() {
    if (typeof setInterval === 'undefined') return;
    this.stopClock();
    this.clockInterval = setInterval(() => this.emit(), 30_000) as unknown as number;
  }

  private stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }
}

export const engine = new OSEngine();
