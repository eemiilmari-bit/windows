export type LicenseStatus =
  | { state: 'NOT_ACTIVATED' }
  | { state: 'ACTIVATED'; key: string }
  | { state: 'ACTIVATION_FAILED'; reason: string };

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  avatarColor: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  wallpaper: string;
  theme: 'light' | 'dark';
  accent: string;
  pinnedApps: string[];
  soundEnabled: boolean;
}

export type SessionState = 'booting' | 'setup' | 'loggedIn';

export interface FileNodeBase {
  name: string;
  path: string;
  created: number;
  modified: number;
}

export interface FileEntry extends FileNodeBase {
  type: 'file';
  size: number;
  icon: string;
  content: string;
}

export interface FolderEntry extends FileNodeBase {
  type: 'folder';
  icon: string;
  children: string[];
}

export type FileSystemEntry = FileEntry | FolderEntry;

export type ProcessStatus = 'Running' | 'Suspended' | 'NotResponding';

export interface ProcessInfo {
  pid: number;
  appId: string;
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  status: ProcessStatus;
}

export interface WindowInfo {
  windowId: string;
  pid: number;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export interface SoundEvent {
  id: 'os.startup' | 'os.shutdown' | 'ui.notification' | 'ui.error' | 'ui.click';
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  defaultSize: { width: number; height: number };
  singleInstance?: boolean;
}

export interface DesktopState {
  wallpaper: string;
  icons: { title: string; appId?: string; path?: string; icon: string }[];
}

export interface TaskbarState {
  pinned: string[];
  running: number[];
  clock: string;
}

export interface SettingsState {
  theme: 'light' | 'dark';
  accent: string;
  wallpaper: string;
  soundEnabled: boolean;
}
