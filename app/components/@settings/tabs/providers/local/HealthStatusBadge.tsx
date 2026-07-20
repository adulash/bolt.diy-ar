import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { classNames } from '~/utils/classNames';

interface HealthStatusBadgeProps {
  status: 'healthy' | 'unhealthy' | 'checking' | 'unknown';
  responseTime?: number;
  className?: string;
}

function HealthStatusBadge({ status, responseTime, className }: HealthStatusBadgeProps) {
  const { t } = useTranslation('settings');

  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/10 border-green-500/20',
          Icon: CheckCircle,
          label: t('providers.local.health.healthy'),
        };
      case 'unhealthy':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/10 border-red-500/20',
          Icon: XCircle,
          label: t('providers.local.health.unhealthy'),
        };
      case 'checking':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10 border-blue-500/20',
          Icon: Loader2,
          label: t('providers.local.health.checking'),
        };
      default:
        return {
          color: 'text-bolt-elements-textTertiary',
          bgColor: 'bg-bolt-elements-background-depth-3 border-bolt-elements-borderColor',
          Icon: AlertCircle,
          label: t('providers.local.health.unknown'),
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.Icon;

  return (
    <div
      className={classNames(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
        config.bgColor,
        config.color,
        className,
      )}
    >
      <Icon className={classNames('w-3 h-3', { 'animate-spin': status === 'checking' })} />
      <span>{config.label}</span>
      {responseTime !== undefined && status === 'healthy' && <span className="opacity-75">({responseTime}ms)</span>}
    </div>
  );
}

export default HealthStatusBadge;
