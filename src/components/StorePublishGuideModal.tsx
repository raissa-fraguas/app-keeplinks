import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Layers,
  Apple,
  Globe
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface StorePublishGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorePublishGuideModal: React.FC<StorePublishGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'playstore' | 'appstore' | 'config'>('playstore');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const assetLinksJson = JSON.stringify(
    [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: 'com.keeplinks.app',
          sha256_cert_fingerprints: [
            '14:6D:E9:7F:0F:52:EA:CB:5B:3E:99:04:53:82:92:02:66:32:4F:FB:25:E0:85:93:4A:4E:97:00:1E:83:7D:7E',
          ],
        },
      },
    ],
    null,
    2
  );

  const capacitorConfig = JSON.stringify(
    {
      appId: 'com.keeplinks.app',
      appName: 'KeepLinks',
      webDir: 'dist',
      bundledWebRuntime: false,
      plugins: {
        SplashScreen: {
          launchShowDuration: 1500,
          backgroundColor: '#0f172a',
        },
      },
    },
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-100 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t('store_guide_title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {t('store_guide_subtitle')}
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('playstore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'playstore'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>{t('tab_playstore')}</span>
          </button>

          <button
            onClick={() => setActiveTab('appstore')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'appstore'
                ? 'bg-sky-600/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Apple className="w-4 h-4 text-sky-400" />
            <span>{t('tab_appstore')}</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'config'
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>{t('tab_config')}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="mt-4 space-y-6 overflow-y-auto pr-2 text-sm text-slate-300">
          
          {/* TAB 1: GOOGLE PLAY STORE */}
          {activeTab === 'playstore' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Visão Geral: TWA (Trusted Web Activity)
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  O Google Play permite empacotar PWAs como aplicativos nativos Android utilizando a tecnologia oficial <strong>Trusted Web Activity (TWA)</strong>. O app roda em tela cheia com desempenho nativo, suporte à barra de notificações e integração com o menu de compartilhamento do sistema Android.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Passo a Passo para a Play Store:</h4>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-emerald-400 text-xs">MÉTODO RECOMENDADO: PWABuilder (Sem codificar Java/Kotlin)</span>
                  <p className="text-xs text-slate-300">
                    1. Acesse <strong>pwabuilder.com</strong>.<br />
                    2. Cole a URL pública do seu app LinkKeep.<br />
                    3. Clique em <strong>"Package for Android"</strong>.<br />
                    4. O PWABuilder gera o arquivo <code>.aab</code> (Android App Bundle) pronto e assinado para você enviar para o Google Play Console!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-400 text-xs">MÉTODO AVANÇADO: Bubblewrap CLI Oficial do Google</span>
                  <p className="text-xs text-slate-300">
                    Execute no seu terminal para gerar o APK / AAB localmente:
                  </p>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 overflow-x-auto">
                    npm install -g @bubblewrap/cli<br />
                    bubblewrap init --manifest=https://seu-dominio/manifest.json<br />
                    bubblewrap build
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 text-xs">O QUE VOCÊ PRECISA PARA PUBLICAR:</span>
                  <ul className="text-xs space-y-1 list-disc list-inside text-slate-300">
                    <li>Conta de Desenvolvedor Google Play Console (taxa única de $25).</li>
                    <li>Política de Privacidade hospedada (link acessível).</li>
                    <li>Ícone de alta resolução (512x512) e screenshots do app.</li>
                    <li>Arquivo <code>assetlinks.json</code> hospedado no seu domínio em <code>/.well-known/assetlinks.json</code> para remover a barra de endereço.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLE APP STORE */}
          {activeTab === 'appstore' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Visão Geral: Capacitor ou PWABuilder iOS
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  A Apple exige que aplicativos na App Store sejam empacotados como pacotes nativos iOS (arquivos <code>.ipa</code>) compilados pelo Xcode. O padrão mais utilizado pela indústria é o <strong>Capacitor (da equipe do Ionic)</strong> ou o gerador de projeto Xcode do <strong>PWABuilder</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Passo a Passo com Capacitor (Nativo iOS):</h4>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-sky-400 text-xs">COMANDOS NO TERMINAL DO PROJETO:</span>
                  <pre className="p-2.5 rounded-lg bg-slate-900 text-xs font-mono text-sky-300 overflow-x-auto">
                    npm install @capacitor/core @capacitor/cli @capacitor/ios<br />
                    npx cap init LinkKeep com.linkkeep.app --web-dir=dist<br />
                    npm run build<br />
                    npx cap add ios<br />
                    npx cap open ios
                  </pre>
                  <p className="text-xs text-slate-400">
                    O Xcode abrirá automaticamente o projeto. Conecte seu iPhone ou selecione o simulador para testar!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-indigo-400 text-xs">MENU DE COMPARTILHAMENTO NATIVO DO IOS:</span>
                  <p className="text-xs text-slate-300">
                    Para que o LinkKeep apareça na folha de compartilhamento nativa do iOS (ao lado do WhatsApp e Mensagens no iPhone), você adiciona um <strong>Share Extension</strong> no Xcode em <em>File &gt; New &gt; Target &gt; Share Extension</em>. Ele repassa o link compartilhado diretamente para o banco de dados do app!
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-400 text-xs">REQUISITOS DA APPLE:</span>
                  <ul className="text-xs space-y-1 list-disc list-inside text-slate-300">
                    <li>Conta Apple Developer Program ($99/ano).</li>
                    <li>Um computador Mac com macOS e Xcode instalado para compilação.</li>
                    <li>Seguir as Diretrizes de Design da App Store (o app já possui interface moderna e responsiva pronta).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIG FILES */}
          {activeTab === 'config' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    /.well-known/assetlinks.json (Google Play TWA)
                  </span>
                  <button
                    onClick={() => copyToClipboard(assetLinksJson, 'assetlinks')}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedCode === 'assetlinks' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'assetlinks' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-48">
                  {assetLinksJson}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    capacitor.config.json (Apple App Store & Capacitor)
                  </span>
                  <button
                    onClick={() => copyToClipboard(capacitorConfig, 'capacitor')}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedCode === 'capacitor' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'capacitor' ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto max-h-48">
                  {capacitorConfig}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <strong className="text-white">Web App Manifest Já Configurado</strong>
                  <p className="text-slate-400 mt-0.5">
                    Inclui suporte a <code>share_target</code>, ícones 192px/512px e service worker.
                  </p>
                </div>
                <a
                  href="/manifest.json"
                  target="_blank"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Ver manifest.json
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            LinkKeep v1.0 • PWA Compliance 100%
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            {t('close_guide')}
          </button>
        </div>

      </div>
    </div>
  );
};
