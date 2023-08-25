export interface CurrentModeContextT {
  darkMode: boolean;
  setDarkMode: (darkMode: string) => void;
  login: () => void;
  children: Element;
}
export interface CurrentUserContextT {
  currentUser: object | null;
  setcurrentUser: (currentUser: string) => void;
}
