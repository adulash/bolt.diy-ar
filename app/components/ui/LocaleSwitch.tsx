import { useStore } from '@nanostores/react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localeStore, setLocale } from '~/lib/stores/locale';
import { IconButton } from './IconButton';

interface LocaleSwitchProps {
  className?: string;
}

export const LocaleSwitch = memo(({ className }: LocaleSwitchProps) => {
  const locale = useStore(localeStore);
  const { t } = useTranslation('common');
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <IconButton
        className={className}
        icon="i-ph:translate-duotone"
        size="xl"
        title={t('language.switchTo')}
        onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
      />
    )
  );
});
