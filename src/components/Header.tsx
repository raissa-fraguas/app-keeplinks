import React from 'react';
import { 
  Bookmark, 
  Plus, 
  Crown, 
  Share2, 
  Store, 
  Sparkles
} from 'lucide-react';
import { UserSubscription } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  subscription: UserSubscription;
  onOpenAddModal: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenStoreGuide: () => void;
  onOpenShareSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  subscription,
  onOpenAddModal,
  onOpenSubscriptionModal,
  onOpenStoreGuide,
  onOpenShareSimulator,
}) => {
  const { t } = useLanguage();
  const isPro = subscription.plan === 'pro';
  const remaining = Math.max(0, subscription.dailyLimit - subscription.todaySavedCount);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 shadow-lg shadow-indigo-500/25">
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white/20" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                  Keep<span className="text-indigo-400">Links</span>
                </span>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30">
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {t('plan_pro')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {t('plan_free')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t('app_subtitle')}
              </p>
            </div>
          </div>

          {/* Center / Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Store Guide Button */}
            <button
              onClick={onOpenStoreGuide}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all hover:text-white"
              title={t('publish_stores')}
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>{t('publish_stores')}</span>
            </button>

            {/* Share Simulator Button */}
            <button
              onClick={onOpenShareSimulator}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-all hover:text-white"
              title={t('test_share')}
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>{t('test_share')}</span>
            </button>

            {/* Plan / Subscription Trigger */}
            <button
              onClick={onOpenSubscriptionModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isPro
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/20'
              }`}
            >
              {isPro ? (
                <>
                  <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold hidden sm:inline">{t('pro_active')}</span>
                  <span className="text-[11px] text-amber-400/80">{subscription.price}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="hidden sm:inline">{t('plan_free')}:</span>
                  <span className="font-semibold text-white">
                    {remaining} / {subscription.dailyLimit} {t('today_count')}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500 text-white font-semibold">
                    {t('upgrade')}
                  </span>
                </>
              )}
            </button>

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {/* In-app PWA install button */}
            <PWAInstallButton />

            {/* Primary Action: Add Link */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{t('save_link')}</span>
              <span className="sm:hidden">{t('save_link').split(' ')[0]}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
