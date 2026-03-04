"use client";

import { useState } from "react";
import {
  cronogramaEtapas,
  obras,
  obrasTiposServico,
  tiposServico,
  equipes,
} from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusEtapaBadge } from "@/components/ui/Badge";
import type { StatusEtapa } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const statusOptions: StatusEtapa[] = ["Planejado", "Em Execução", "Atrasado", "Concluído"];

export default function CronogramaPage() {
  const [obraFiltro, setObraFiltro] = useState<string>("all");
  const [statusFiltro, setStatusFiltro] = useState<string>("all");

  const obrasAtivas = obras.filter(
    (o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada"
  );

  const etapasFiltradas = cronogramaEtapas.filter((e) => {
    if (obraFiltro !== "all" && e.id_obra !== obraFiltro) return false;
    if (statusFiltro !== "all" && e.status !== statusFiltro) return false;
    return true;
  });

  const etapasAtrasadas = cronogramaEtapas.filter((e) => e.status === "Atrasado").length;
  const etapasEmExecucao = cronogramaEtapas.filter((e) => e.status === "Em Execução").length;
  const etapasConcluidas = cronogramaEtapas.filter((e) => e.status === "Concluído").length;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cronograma</h1>
          <p className="text-gray-500 text-sm mt-1">{cronogramaEtapas.length} etapas cadastradas</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Etapa
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{etapasAtrasadas}</p>
          <p className="text-xs text-red-500 font-medium mt-0.5">Atrasadas</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{etapasEmExecucao}</p>
          <p className="text-xs text-amber-500 font-medium mt-0.5">Em Execução</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{etapasConcluidas}</p>
          <p className="text-xs text-emerald-500 font-medium mt-0.5">Concluídas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={obraFiltro}
          onChange={(e) => setObraFiltro(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="all">Todas as obras</option>
          {obrasAtivas.map((o) => (
            <option key={o.id_obra} value={o.id_obra}>{o.nome_obra}</option>
          ))}
        </select>
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="all">Todos os status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="table-responsive">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Etapa</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Obra</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Serviço</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Equipe</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Início Plan.</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fim Plan.</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Início Real</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prazo (du)</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[120px]">% Execução</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {etapasFiltradas.map((etapa) => {
                const obra = obras.find((o) => o.id_obra === etapa.id_obra);
                const ots = obrasTiposServico.find((o) => o.id_obra_tipo_servico === etapa.id_obra_tipo_servico);
                const ts = tiposServico.find((t) => t.id_tipo_servico === ots?.id_tipo_servico);
                const equipe = equipes.find((e) => e.id_equipe === etapa.id_equipe_responsavel);

                return (
                  <tr
                    key={etapa.id_etapa}
                    className={`hover:bg-gray-50 ${etapa.status === "Atrasado" ? "bg-red-50/30" : ""}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px]">
                      <p className="truncate">{etapa.descricao_etapa}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                      <p className="truncate text-xs">{obra?.nome_obra}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{ts?.descricao ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[160px]">
                      <p className="truncate text-xs">{equipe?.nome_exibicao ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(etapa.data_inicio_planejada)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(etapa.data_fim_planejada)}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {etapa.data_inicio_real ? formatDate(etapa.data_inicio_real) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-center">{etapa.prazo_dias_uteis}du</td>
                    <td className="px-4 py-3 w-36">
                      <ProgressBar value={etapa.percentual_execucao} size="sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusEtapaBadge status={etapa.status} />
                    </td>
                  </tr>
                );
              })}
              {etapasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400 text-sm">
                    Nenhuma etapa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-400" /> Planejado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400" /> Em Execução
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" /> Atrasado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-400" /> Concluído
        </span>
        <span className="text-gray-400">· du = dias úteis</span>
      </div>
    </div>
  );
}
