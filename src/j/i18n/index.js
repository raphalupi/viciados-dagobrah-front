import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LocalStorageHelper from '../utils/LocalStorageHelper';
import { PREFERED_LANG_CODE } from '../utils/LocalStorageKeys';
import resources from './resources';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: LocalStorageHelper.get(PREFERED_LANG_CODE) || 'en-us',
    fallbackLng: 'en-us',
    keySeparator: '.',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    },
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;
