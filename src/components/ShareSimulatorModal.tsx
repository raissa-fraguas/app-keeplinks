import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Smartphone, 
  ExternalLink, 
  Check, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { detectPlatform, PLATFORM_METAS } from '../services/platformDetector';
import { ShareDataInput } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ShareSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateShare: (data: ShareDataInput) => void;
}

const PRESET_SHARES = [
  {
    platform: 'instagram' as const,
    label: 'Instagram Reel',
    url: 'https://www.instagram.com/reel/C8qL95kvX7B/',
    title: 'Massa cremosa com molho de queijo artesanal em 15min',
    text: 'Olha que incrível essa receita rápida para fazer no jantar!',
    color: '#E1306C',
  },
  {
    platform: 'tiktok' as const,
    label: 'TikTok Video',
    url: 'https://www.tiktok.com/@techtrends/video/7382910482919',
    title: '5 Ferramentas de IA para dobrar sua produtividade no trabalho',
    text: 'Dica de ouro que aprendi no TikTok hoje',
    color: '#00f2fe',
  },
  {
    platform: 'twitter' as const,
    label: 'X (Twitter) Thread',
    url: 'https://x.com/design_digest/status/18129482918471',
    title: 'Thread completa com 10 dicas essenciais de UI/UX em 2026',
    text: 'Imperdível para quem desenvolve apps e produtos digitais',
    color: '#1da1f2',
  },
  {
    platform: 'threads' as const,
    label: 'Threads Post',
    url: 'https://threads.net/@viajantes_br/post/C9W483k9',
    title: 'Roteiro de 4 dias no Jalapão gastando pouco: onde ficar e fervedouros',
    text: 'Dicas práticas de viagem que salvei para as próximas férias',
    color: '#ffffff',
  },
  {
    platform: 'bluesky' as const,
    label: 'Bluesky Post',
    url: 'https://bsky.app/profile/devbr.bsky.social/post/3kqj2m9s81a',
    title: 'Novidades do ecossistema TypeScript e React 19',
    text: 'Discussão muito boa sobre os novos padrões web',
    color: '#1185fe',
  },
];

export const ShareSimulatorModal: React.FC<ShareSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSimulateShare,
}) => {
  const { t } = useLanguage();
  const [customUrl, setCustomUrl] = useState('');
  const [customText, setCustomText] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<'android' | 'ios'>('android');

  if (!isOpen) return null;

  const handleRunPreset = (preset: typeof PRESET_SHARES[0]) => {
    onSimulateShare({
      url: preset.url,
      title: preset.title,
      text: preset.text,
      platform: preset.platform,
    });
    onClose();
  };

  const handleRunCustom = () => {
    if (!customUrl.trim()) return;
    const detected = detectPlatform(customUrl);
    onSimulateShare({
      url: customUrl.trim(),
      text: customText.trim(),
      platform: detected,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t('sim_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('sim_subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Device Tutorial Explainer */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>{t('sim_how_it_works')}</span>
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-700/60 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedDevice('android')}
                className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                  selectedDevice === 'android' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Android
              </button>
              <button
                type="button"
                onClick={() => setSelectedDevice('ios')}
                className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                  selectedDevice === 'ios' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                iPhone (iOS)
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
            {selectedDevice === 'android' ? t('sim_android_step') : t('sim_ios_step')}
          </p>
        </div>

        {/* Quick Simulation Presets */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('sim_presets_title')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_SHARES.map((preset) => (
              <button
                key={preset.platform}
                onClick={() => handleRunPreset(preset)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-slate-900 transition group text-left"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      {preset.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {preset.title}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom URL Simulator */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {t('sim_custom_title')}
          </h3>
          <div className="space-y-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/... ou https://x.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={handleRunCustom}
              disabled={!customUrl.trim()}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('sim_custom_btn')}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
