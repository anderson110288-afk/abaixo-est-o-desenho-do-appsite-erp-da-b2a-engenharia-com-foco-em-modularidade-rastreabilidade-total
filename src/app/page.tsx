import Link from "next/link";
import { obras, pendencias, medicoes, solicitacoes, contratos } from "@/lib/mock-data";
import { KpiCard } from "@/components/ui/KpiCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiscoBadge, StatusObraBadge } from "@/components/ui/Badge";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  // KPI calculations
  const obrasAtivas = obras.filter((o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada");
  const obrasAtrasadas = obras.filter((o) => {
    if (o.status_obra !== "Em Execução") return false;
    const hoje = new Date();
    const fim = new Date(o.data_fim_prevista);
    return fim < hoje || o.risco_obra === "Crítico";
  });

  const pendenciasAbertas = pendencias.filter(
    (p) => p.status === "Aberto" || p.status === "Em Análise"
  );
  const pendenciasCriticas = pendenciasAbertas.filter((p) => p.criticidade === "Alta");

  const medicoesPendentes = medicoes.filter(
    (m) => m.status_medicao === "Aprovada Engenheiro" || m.status_medicao === "Enviada Financeiro"
  );
  const valorMedicoesPendentes = medicoesPendentes.reduce((acc, m) => acc + m.valor_total, 0);

  const comprasAbertas = solicitacoes.filter(
    (s) => s.status_solicitacao === "Aberta" || s.status_solicitacao === "Em Cotação" || s.status_solicitacao === "Aprovada"
  );

  const contratosEmAberto = contratos.filter(
    (c) => c.status_contrato === "Aberto" || c.status_contrato === "Em Medição"
  );

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Geral</h1>
        <p className="text-gray-500 text-sm mt-1">
          Visão consolidada de todas as obras – {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          title="Obras Ativas"
          value={obrasAtivas.length}
          subtitle={`${obrasAtrasadas.length} com risco`}
          trend={obrasAtrasadas.length > 0 ? "up" : "neutral"}
          colorClass="bg-blue-50 text-blue-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <KpiCard
          title="Pendências Abertas"
          value={pendenciasAbertas.length}
          subtitle={`${pendenciasCriticas.length} críticas`}
          trend={pendenciasCriticas.length > 0 ? "up" : "neutral"}
          colorClass="bg-red-50 text-red-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <KpiCard
          title="Medições Pendentes"
          value={medicoesPendentes.length}
          subtitle={formatCurrency(valorMedicoesPendentes)}
          colorClass="bg-amber-50 text-amber-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        <KpiCard
          title="Compras em Aberto"
          value={comprasAbertas.length}
          subtitle={`${contratosEmAberto.length} contratos ativos`}
          colorClass="bg-purple-50 text-purple-600"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
      </div>

      {/* Obras List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Lista de Obras</h2>
          <Link href="/obras" className="text-sm text-orange-600 font-medium hover:text-orange-700">
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {obras.map((obra) => (
            <Link
              key={obra.id_obra}
              href={`/obras/${obra.id_obra}`}
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              {/* Risk indicator */}
              <div
                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  obra.risco_obra === "Crítico"
                    ? "bg-red-500"
                    : obra.risco_obra === "Atenção"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{obra.nome_obra}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{obra.gerente_obra}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusObraBadge status={obra.status_obra} />
                    <RiscoBadge risco={obra.risco_obra} />
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={obra.percentual_fisico_atual} size="sm" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">Prazo: {formatDate(obra.data_fim_prevista)}</span>
                  <span className="text-xs text-gray-500 font-medium">{obra.id_obra}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom grid: Pendências críticas + Medições pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pendências críticas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Pendências Críticas
            </h2>
            <Link href="/pendencias" className="text-sm text-orange-600 font-medium hover:text-orange-700">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendenciasCriticas.slice(0, 4).map((p) => {
              const obra = obras.find((o) => o.id_obra === p.id_obra);
              const isVencida = new Date(p.data_limite) < new Date();
              return (
                <div key={p.id_pendencia} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 font-medium line-clamp-2">{p.descricao}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                        isVencida ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isVencida ? "Vencida" : "Aberta"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{obra?.nome_obra} · Limite: {formatDate(p.data_limite)}</p>
                </div>
              );
            })}
            {pendenciasCriticas.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                Nenhuma pendência crítica 🎉
              </div>
            )}
          </div>
        </div>

        {/* Medições pendentes */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Medições Pendentes
            </h2>
            <Link href="/medicoes" className="text-sm text-orange-600 font-medium hover:text-orange-700">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {medicoesPendentes.map((m) => {
              const contrato = contratos.find((c) => c.id_contrato === m.id_contrato);
              const obra = obras.find((o) => o.id_obra === contrato?.id_obra);
              return (
                <div key={m.id_medicao} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Medição #{m.numero_medicao} – {contrato?.numero_contrato}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{obra?.nome_obra}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(m.valor_total)}</p>
                      <p className="text-xs text-amber-600 font-medium">{m.status_medicao}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {medicoesPendentes.length === 0 && (
              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                Nenhuma medição pendente 🎉
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
