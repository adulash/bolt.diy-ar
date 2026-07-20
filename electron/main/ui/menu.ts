import { BrowserWindow, Menu } from 'electron';

type MenuLocale = 'ar' | 'en';

/*
 * The renderer's react-i18next instance is not available in the main process,
 * so the native menu uses its own minimal dictionary. Arabic is the app
 * default; the persisted renderer locale (localStorage.bolt_locale) is read
 * once the page has loaded and the menu is rebuilt on change.
 */
const MENU_LABELS: Record<MenuLocale, { go: string; back: string; forward: string }> = {
  ar: { go: 'تنقّل', back: 'رجوع', forward: 'تقدّم' },
  en: { go: 'Go', back: 'Back', forward: 'Forward' },
};

function buildMenu(win: BrowserWindow, locale: MenuLocale): void {
  const app = Menu.getApplicationMenu();
  const labels = MENU_LABELS[locale];

  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      ...(app ? app.items : []),
      {
        label: labels.go,
        submenu: [
          {
            label: labels.back,
            accelerator: 'CmdOrCtrl+[',
            click: () => {
              win?.webContents.navigationHistory.goBack();
            },
          },
          {
            label: labels.forward,
            accelerator: 'CmdOrCtrl+]',
            click: () => {
              win?.webContents.navigationHistory.goForward();
            },
          },
        ],
      },
    ]),
  );
}

async function detectLocale(win: BrowserWindow): Promise<MenuLocale> {
  try {
    const stored = await win.webContents.executeJavaScript("localStorage.getItem('bolt_locale')", true);
    return stored === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar';
  }
}

export function setupMenu(win: BrowserWindow): void {
  buildMenu(win, 'ar');

  const refresh = async () => {
    buildMenu(win, await detectLocale(win));
  };

  win.webContents.on('did-finish-load', refresh);
  void refresh();
}
