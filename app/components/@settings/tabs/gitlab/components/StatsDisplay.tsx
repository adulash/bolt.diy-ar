import React from 'react';
import { formatDateTime } from '~/lib/i18n/format';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/Button';
import type { GitLabStats } from '~/types/GitLab';

interface StatsDisplayProps {
  stats: GitLabStats;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function StatsDisplay({ stats, onRefresh, isRefreshing }: StatsDisplayProps) {
  const { t } = useTranslation('settings');

  return (
    <div className="space-y-4">
      {/* Repository Stats */}
      <div>
        <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">{t('gitlab.repositoryStats')}</h5>
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: t('gitlab.publicRepos'),
              value: stats.publicProjects,
            },
            {
              label: t('gitlab.privateRepos'),
              value: stats.privateProjects,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor"
            >
              <span className="text-xs text-bolt-elements-textSecondary">{stat.label}</span>
              <span className="text-lg font-medium text-bolt-elements-textPrimary">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contribution Stats */}
      <div>
        <h5 className="text-sm font-medium text-bolt-elements-textPrimary mb-2">{t('gitlab.contributionStats')}</h5>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: t('connections.stars'),
              value: stats.stars || 0,
              icon: 'i-ph:star',
              iconColor: 'text-bolt-elements-icon-warning',
            },
            {
              label: t('connections.forks'),
              value: stats.forks || 0,
              icon: 'i-ph:git-fork',
              iconColor: 'text-bolt-elements-icon-info',
            },
            {
              label: t('connections.followers'),
              value: stats.followers || 0,
              icon: 'i-ph:users',
              iconColor: 'text-bolt-elements-icon-success',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="flex flex-col p-3 rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor"
            >
              <span className="text-xs text-bolt-elements-textSecondary">{stat.label}</span>
              <span className="text-lg font-medium text-bolt-elements-textPrimary flex items-center gap-1">
                <div className={`${stat.icon} w-4 h-4 ${stat.iconColor}`} />
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-bolt-elements-borderColor">
        <div className="flex items-center justify-between">
          <span className="text-xs text-bolt-elements-textSecondary">
            {t('connections.lastUpdatedAt', { date: formatDateTime(stats.lastUpdated) })}
          </span>
          {onRefresh && (
            <Button onClick={onRefresh} disabled={isRefreshing} variant="outline" size="sm" className="text-xs">
              {isRefreshing ? t('connections.refreshing') : t('connections.refresh')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
