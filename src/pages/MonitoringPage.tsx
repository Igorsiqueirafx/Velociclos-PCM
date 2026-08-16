import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/LoadingStates';
import { useHealth, useVersion, useMetrics } from '@/hooks/useApi';
import { Activity, Database, Zap, Globe } from 'lucide-react';

export function MonitoringPage() {
  const { health, loading: hl, error: he } = useHealth();
  const { version, loading: vl, error: ve } = useVersion();
  const { metrics, loading: ml, error: me } = useMetrics();

  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-primary to-secondary min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-8">Monitoramento do Sistema</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-secondary/50 rounded-xl p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-green-400" size={24} />
                <h2 className="text-white font-bold text-xl">Status da API</h2>
              </div>
              {hl ? <LoadingSpinner text="Verificando..." /> : he ? <ErrorMessage message={he} /> : health ? (
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-green-400 font-bold">{health.status}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Timestamp</span><span className="text-gray-300 text-sm">{health.timestamp}</span></div>
                </div>
              ) : null}
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="text-blue-400" size={24} />
                <h2 className="text-white font-bold text-xl">Versão</h2>
              </div>
              {vl ? <LoadingSpinner text="Carregando..." /> : ve ? <ErrorMessage message={ve} /> : version ? (
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-400">Versão</span><span className="text-white font-bold">{version.version}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Ambiente</span><span className="text-green-400 font-bold">{version.environment}</span></div>
                </div>
              ) : null}
            </div>

            <div className="bg-secondary/50 rounded-xl p-6 border border-gold/20">
              <div className="flex items-center gap-3 mb-4">
                <Database className="text-purple-400" size={24} />
                <h2 className="text-white font-bold text-xl">Conexão</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Backend</span><span className="text-gray-300">Supabase Functions</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Cache</span><span className="text-green-400">Ativo</span></div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-xl p-6 border border-gold/20 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-teal-400" size={24} />
              <h2 className="text-white font-bold text-xl">Endpoints da API</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-300">GET</span>
                <code className="text-gray-300 text-sm">/api/health</code>
                <span className="text-green-400 text-sm font-medium">● Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-300">GET</span>
                <code className="text-gray-300 text-sm">/api/youtube/playlists</code>
                <span className="text-green-400 text-sm font-medium">● Online</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-300">GET</span>
                <code className="text-gray-300 text-sm">/api/articles</code>
                <span className="text-green-400 text-sm font-medium">● Online</span>
              </div>
            </div>
          </div>

          <MetricsSection metrics={metrics} loading={ml} error={me} />

        </div>
      </main>
      <Footer />
    </>
  );
}

function MetricsSection({ metrics, loading, error }) {
  return (
    <div className="bg-secondary/50 rounded-xl p-6 border border-gold/20 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Zap className="text-amber-400" size={24} />
        <h2 className="text-white font-bold text-xl">Métricas de Performance</h2>
      </div>
      {loading ? <LoadingSpinner text="Carregando..." /> : error ? <ErrorMessage message={error} /> : metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center"><p className="text-3xl font-bold text-gold">{metrics.totalRequests.toLocaleString()}</p><p className="text-gray-400 text-sm">Total Requests</p></div>
          <div className="text-center"><p className="text-3xl font-bold text-blue-400">{metrics.avgResponseTime.toFixed(0)}ms</p><p className="text-gray-500 text-sm">Resposta Média</p></div>
        </div>
      ) : <p className="text-gray-400">Métricas não disponíveis no momento</p>}
    </div>
  );
}
