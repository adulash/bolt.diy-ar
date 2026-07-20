import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import arCommon from '~/locales/ar/common.json';
import arChat from '~/locales/ar/chat.json';
import arWorkbench from '~/locales/ar/workbench.json';
import arSettings from '~/locales/ar/settings.json';
import arDeploy from '~/locales/ar/deploy.json';

import enCommon from '~/locales/en/common.json';
import enChat from '~/locales/en/chat.json';
import enWorkbench from '~/locales/en/workbench.json';
import enSettings from '~/locales/en/settings.json';
import enDeploy from '~/locales/en/deploy.json';

import { DEFAULT_LOCALE, localeStore } from '~/lib/stores/locale';

export const I18N_NAMESPACES = ['common', 'chat', 'workbench', 'settings', 'deploy'] as const;

export const resources = {
  ar: {
    common: arCommon,
    chat: arChat,
    workbench: arWorkbench,
    settings: arSettings,
    deploy: arDeploy,
  },
  en: {
    common: enCommon,
    chat: enChat,
    workbench: enWorkbench,
    settings: enSettings,
    deploy: enDeploy,
  },
} as const;

if (!i18n.isInitialized) {
  // Synchronous init with statically bundled resources: no async backend, no flash of raw keys.
  i18n.use(initReactI18next).init({
    resources,
    lng: import.meta.env.SSR ? DEFAULT_LOCALE : localeStore.get(),
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [...I18N_NAMESPACES],
    interpolation: {
      // React already escapes rendered strings.
      escapeValue: false,
    },
    returnEmptyString: false,
    initAsync: false,
  });
}

export default i18n;
