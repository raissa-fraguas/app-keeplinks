import React from 'react';
import { Crown, Sparkles, RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';
import { UserSubscription } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface StatsBannerProps {
  subscription: UserSubscription;
  totalLinksCount: number;
  totalFoldersCount: number;
  onOpenSubscriptionModal: () => void;
  onSimulateAddLink: () => void;
  onResetDailyCount: () => void;
  onTogglePlan: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  subscription,
  totalLinksCount,
  totalFoldersCount,
  onOpenSubscriptionModal,
  onSimulateAddLink,
  onResetDailyCount,
  onTogglePlan,
}) => {
  const { t } = useLanguage();
  const isPro = subscription.plan === 'pro';
  const count = subscription.todaySavedCount;
  const limit = subscription.dailyLimit;
  const percentage = isPro ? 100 : Math.min(100, Math.round((count / limit) * 100));
  const isAtLimit = !isPro && count >= limit;
  const remaining = Math.max(0, limit - count);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-4 sm:p-6 shadow-xl">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Main Status & Progress */}
        <div className="space-y-2 max-w-xl w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              {isPro ? t('account_label') : t('daily_limit_label')}
            </span>
            {isPro ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {t('pro_active_banner')}
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAtLimit 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              }`}>
                {isAtLimit ? <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                {t('free_plan_banner', { count, limit })}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-300">
            {isPro ? (
              <span>{t('pro_description')}</span>
            ) : isAtLimit ? (
              <span className="text-rose-300 font-medium">
                {t('limit_reached_desc', { limit })}
              </span>
            ) : (
              <span>
                {t('limit_remaining_desc', { remaining, limit })}
              </span>
            )}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mt-1 border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPro
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300'
                  : isAtLimit
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
            <span>📦 {t('total_saved')} <strong className="text-white">{totalLinksCount}</strong> {t('links_word')}</span>
            <span>📁 {t('thematic_folders_count')} <strong className="text-white">{totalFoldersCount}</strong></span>
          </div>
        </div>

        {/* Action Controls & Testing Tools */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          
          {/* Upgrade CTA if Free */}
          {!isPro && (
            <button
              onClick={onOpenSubscriptionModal}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 active:scale-95 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Crown className="w-4 h-4 fill-slate-900 text-slate-900" />
              <span>{t('unlimited_cta')}</span>
            </button>
          )}

          {/* Tester Helper Menu */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 self-start sm:self-auto text-xs text-slate-400">
            <span className="px-2 text-[10px] font-semibold tracking-wider uppercase text-slate-500 hidden sm:inline">
              {t('tests_label')}
            </span>
            <button
              onClick={onSimulateAddLink}
              title="Simular salvar 1 link"
              className="px-2 py-1 rounded-lg hover:bg-slate-700 hover:text-white transition flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('simulate_add')}</span>
            </button>
            <button
              onClick={onResetDailyCount}
              title="Zerar contador diário"
              className="px-2 py-1 rounded-lg hover:bg-slate-700 hover:text-white transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('reset_counter')}</span>
            </button>
            <button
              onClick={onTogglePlan}
              title="Alternar entre Grátis e Pro"
              className="px-2 py-1 rounded-lg hover:bg-slate-700 hover:text-white transition font-medium text-slate-300"
            >
              {isPro ? t('mode_free') : t('activate_pro')}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
