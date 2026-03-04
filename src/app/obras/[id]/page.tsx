import Link from "next/link";
import { notFound } from "next/navigation";
import {
  obras,
  pendencias,
  contratos,
  cronogramaEtapas,
  obrasTiposServico,
  tiposServico,
  equipes,
  empreiteiros,
  medicoes,
} from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiscoBadge, StatusObraBadge, StatusEtapaBadge, StatusContratoBadge } from "@/components/ui/Badge";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ObraDetailPage({ params }: { params: { id: string } }) {
  const obra = obras.find((o) => o.id_obra === params.id);
  if (!obra) notFound();

  const obraServicos = obrasTiposServico.filter((ots) => ots.id_obra === obra.id_obra);
  const etapas = cronogramaEtapas.filter((e) => e.id_obra === obra.id_obra);
  const contratosObra = contratos.filter((c) => c.id_obra === obra.id_obra);
  const pendenciasObra = pendencias.filter(
    (p) => p.id_obra === obra.id_obra && (p.status === "Aberto" || p.status === "Em Análise")
  );

  const valorTotalContratado = contratosObra.reduce((acc, c) => acc + c.valor_total_contratado, 0);
  const valorTotalMedido = contratosObra.reduce((acc, c) => acc + c.valor_total_medido, 0);

  const diasRestantes = Math.ceil(
    (new Date(obra.data_fim_prevista).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/obras" className="hover:text-orange-600">Obras</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{obra.nome_obra}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-mono">{obra.id_obra}</p>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{obra.nome_obra}</h1>
            <p className="text-sm text-gray-500 mt-1">{obra.gerente_obra}</p>
            {obra.endereco && <p className="text-xs text-gray-400 mt-0.5">{obra.endereco}</p>}
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <StatusObraBadge status={obra.status_obra} />
            <RiscoBadge risco={obra.risco_obra} />
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-gray-700">Progresso Físico Geral</span>
          </div>
          <ProgressBar value={obra.percentual_fisico_atual} size="lg" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Início Previsto</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatDate(obra.data_inicio_prevista)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Prazo Final</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatDate(obra.data_fim_prevista)}</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${diasRestantes < 0 ? "bg-red-50" : diasRestantes < 30 ? "bg-amber-50" : "bg-gray-50"}`}>
            <p className="text-xs text-gray-400">Dias Restantes</p>
            <p className={`text-sm font-bold mt-0.5 ${diasRestantes < 0 ? "text-red-600" : diasRestantes < 30 ? "text-amber-600" : "text-gray-800"}`}>
              {diasRestantes < 0 ? `${Math.abs(diasRestantes)}d atrasado` : `${diasRestantes}d`}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-400">Serviços</p>
            <p className="text-sm font-semibold text-gray-800 mt-0.5">{obraServicos.length} tipos</p>
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Contratado</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(valorTotalContratado)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Total Medido</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(valorTotalMedido)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Saldo a Medir</p>
          <p className="text-xl font-bold text-amber-600 mt-1">{formatCurrency(valorTotalContratado - valorTotalMedido)}</p>
        </div>
      </div>

      {/* Cronograma de etapas */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Cronograma de Etapas</h2>
          <Link href={`/cronograma?obra=${obra.id_obra}`} className="text-sm text-orange-600 font-medium hover:text-orange-700">
            Ver completo →
          </Link>
        </div>
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Etapa</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Serviço</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipe</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Início Plan.</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fim Plan.</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">% Exec.</th>
                <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {etapas.map((etapa) => {
                const ots = obraServicos.find((o) => o.id_obra_tipo_servico === etapa.id_obra_tipo_servico);
                const ts = tiposServico.find((t) => t.id_tipo_servico === ots?.id_tipo_servico);
                const equipe = equipes.find((e) => e.id_equipe === etapa.id_equipe_responsavel);
                return (
                  <tr key={etapa.id_etapa} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                      <p className="truncate">{etapa.descricao_etapa}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{ts?.descricao ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                      <p className="truncate text-xs">{equipe?.nome_exibicao ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(etapa.data_inicio_planejada)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(etapa.data_fim_planejada)}</td>
                    <td className="px-4 py-3 w-32">
                      <ProgressBar value={etapa.percentual_execucao} size="sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusEtapaBadge status={etapa.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contratos */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-4">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Contratos</h2>
          <Link href={`/contratos?obra=${obra.id_obra}`} className="text-sm text-orange-600 font-medium hover:text-orange-700">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {contratosObra.map((contrato) => {
            const emp = empreiteiros.find((e) => e.id_empreiteiro === contrato.id_empreiteiro);
            const ts = tiposServico.find((t) => t.id_tipo_servico === contrato.id_tipo_servico);
            const saldo = contrato.valor_total_contratado - contrato.valor_total_medido;
            const pct = contrato.valor_total_contratado > 0
              ? Math.round((contrato.valor_total_medido / contrato.valor_total_contratado) * 100)
              : 0;
            return (
              <div key={contrato.id_contrato} className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-mono">{contrato.numero_contrato}</p>
                    <p className="font-medium text-gray-800 text-sm mt-0.5">{emp?.nome_fantasia}</p>
                    <p className="text-xs text-gray-500">{ts?.descricao} · {contrato.tipo_contrato}</p>
                  </div>
                  <StatusContratoBadge status={contrato.status_contrato} />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Contratado</p>
                    <p className="font-semibold text-gray-700">{formatCurrency(contrato.valor_total_contratado)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Medido</p>
                    <p className="font-semibold text-emerald-600">{formatCurrency(contrato.valor_total_medido)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Saldo</p>
                    <p className={`font-semibold ${saldo > 0 ? "text-amber-600" : "text-gray-400"}`}>{formatCurrency(saldo)}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={pct} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pendências abertas */}
      {pendenciasObra.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              Pendências Abertas ({pendenciasObra.length})
            </h2>
            <Link href={`/pendencias?obra=${obra.id_obra}`} className="text-sm text-orange-600 font-medium hover:text-orange-700">
              Ver todas →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {pendenciasObra.slice(0, 5).map((p) => {
              const isVencida = new Date(p.data_limite) < new Date();
              return (
                <div key={p.id_pendencia} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-800 line-clamp-2">{p.descricao}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                        p.criticidade === "Alta"
                          ? "bg-red-100 text-red-700"
                          : p.criticidade === "Média"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.criticidade}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {p.responsavel} · Limite: {formatDate(p.data_limite)}
                    {isVencida && <span className="text-red-500 font-medium ml-1">⚠ Vencida</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
