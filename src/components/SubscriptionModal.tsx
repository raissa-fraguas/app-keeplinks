import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Check, 
  Sparkles, 
  QrCode, 
  CreditCard, 
  Copy, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserSubscription } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: UserSubscription;
  onUpgrade: (method: 'pix' | 'credit_card') => void;
  onDowngrade: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onUpgrade,
  onDowngrade,
}) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<'pix' | 'credit_card'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState('NOME DO TITULAR');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const isPro = subscription.plan === 'pro';
  const simulatedPixCode = '00020126580014BR.GOV.BCB.PIX0136linkkeep-pay@ais.app52040000530398654044.995802BR5920LinkKeep Assinatura6009Sao Paulo62070503***6304ABCD';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(simulatedPixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onUpgrade(selectedMethod);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {}
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{t('sub_title')}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t('sub_price_tag')}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('sub_subtitle')}
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

        {/* Success screen upon payment */}
        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">{t('congrats_pro')}</h3>
            <p className="text-sm text-slate-300 max-w-md">
              {t('congrats_pro_desc')}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            
            {/* Comparison Cards: Grátis vs Pro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Grátis */}
              <div className={`p-5 rounded-2xl border transition-all ${
                !isPro 
                  ? 'bg-slate-950/80 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/30' 
                  : 'bg-slate-950/40 border-slate-800 opacity-80'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{t('free_plan_card_title')}</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {t('free_plan_tag')}
                  </span>
                </div>
                <div className="text-2xl font-black text-white mb-4">
                  {t('free_price')} <span className="text-xs font-normal text-slate-400">{t('free_period')}</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>{t('free_benefit_1')}</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('free_benefit_2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t('free_benefit_3')}</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <X className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>{t('free_benefit_unlimited')}</span>
                  </li>
                </ul>

                {isPro && (
                  <button
                    type="button"
                    onClick={onDowngrade}
                    className="mt-5 w-full py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                  >
                    {t('downgrade_to_free')}
                  </button>
                )}
              </div>

              {/* PRO */}
              <div className={`relative p-5 rounded-2xl border transition-all ${
                isPro 
                  ? 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-amber-500/60 shadow-xl ring-2 ring-amber-500/40' 
                  : 'bg-gradient-to-br from-amber-950/20 via-slate-900 to-indigo-950/20 border-amber-500/40 hover:border-amber-500'
              }`}>
                {/* Popular Badge */}
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md">
                  {t('pro_recommended')}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <h3 className="text-base font-bold text-amber-300">{t('pro_plan_card_title')}</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {t('pro_unlimited_tag')}
                  </span>
                </div>

                <div className="text-2xl font-black text-white mb-4">
                  {t('pro_price')} <span className="text-xs font-normal text-slate-400">{t('pro_period')}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>{t('pro_benefit_1')}</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('pro_benefit_2')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('pro_benefit_3')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('pro_benefit_4')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('pro_benefit_5')}</span>
                  </li>
                </ul>

                {isPro && (
                  <div className="mt-4 p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-center text-xs text-amber-300 font-bold">
                    {t('active_subscription_tag')}
                  </div>
                )}
              </div>

            </div>

            {/* Checkout Area if not subscribed */}
            {!isPro && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {t('payment_method_title')}
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {t('secure_payment')}
                  </span>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('pix')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition ${
                      selectedMethod === 'pix'
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>{t('pix_method')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition ${
                      selectedMethod === 'credit_card'
                        ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>{t('card_method')}</span>
                  </button>
                </div>

                {/* PIX Panel */}
                {selectedMethod === 'pix' ? (
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated QR Code Graphic */}
                    <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                      <div className="w-full h-full border-4 border-slate-950 flex flex-col justify-between p-1 bg-white">
                        <div className="flex justify-between">
                          <div className="w-5 h-5 bg-slate-950" />
                          <div className="w-5 h-5 bg-slate-950" />
                        </div>
                        <div className="text-[8px] font-mono text-center font-bold text-slate-900">
                          PIX R$4,99
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="w-5 h-5 bg-slate-950" />
                          <div className="w-4 h-4 bg-emerald-500 rounded" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                      <p className="text-xs text-slate-300">
                        {t('pix_instructions')}
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={simulatedPixCode}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-400 font-mono select-all truncate"
                        />
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                        >
                          {pixCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{pixCopied ? t('copied') : t('copy')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Credit Card Panel */
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t('card_number')}
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          {t('card_expiry')}
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          {t('card_cvv')}
                        </label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Crown className="w-4 h-4 fill-slate-950" />
                      <span>{t('confirm_pro_sub')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
