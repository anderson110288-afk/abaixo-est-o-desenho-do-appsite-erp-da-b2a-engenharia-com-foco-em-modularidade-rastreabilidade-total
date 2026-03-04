"use client";

import { useState } from "react";
import { pendencias, obras } from "@/lib/mock-data";
import { StatusPendenciaBadge, CriticidadeBadge } from "@/components/ui/Badge";
import type { StatusPendencia, CriticidadePendencia, TipoPendencia } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

const statusOptions: StatusPendencia[] = ["Aberto", "Em Análise", "Resolvido", "Encerrado"];
const criticidadeOptions: CriticidadePendencia[] = ["Baixa", "Média", "Alta"];
const tipoOptions: TipoPendencia[] = ["Técnica", "Tarefa combinada", "Ajuste", "Material", "Problema"];

const tipoIcons: Record<TipoPendencia, string> = {
  Técnica: "🔧",
  "Tarefa combinada": "📋",
  Ajuste: "✏️",
  Material: "📦",
  Problema: "⚠️",
};

export default function PendenciasPage() {
  const [obraFiltro, setObraFiltro] = useState<string>("all");
  const [statusFiltro, setStatusFiltro] = useState<string>("active");
  const [criticidadeFiltro, setCriticidadeFiltro] = useState<string>("all");
  const [selectedPendencia, setSelectedPendencia] = useState<string | null>(null);

  const obrasAtivas = obras.filter(
    (o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada"
  );

  const pendenciasFiltradas = pendencias.filter((p) => {
    if (obraFiltro !== "all" && p.id_obra !== obraFiltro) return false;
    if (statusFiltro === "active") {
      return p.status === "Aberto" || p.status === "Em Análise";
    }
    if (statusFiltro !== "all" && p.status !== statusFiltro) return false;
    if (criticidadeFiltro !== "all" && p.criticidade !== criticidadeFiltro) return false;
    return true;
  });

  const pendenciaSelecionada = selectedPendencia
    ? pendencias.find((p) => p.id_pendencia === selectedPendencia)
    : null;

  // Stats
  const abertas = pendencias.filter((p) => p.status === "Aberto").length;
  const emAnalise = pendencias.filter((p) => p.status === "Em Análise").length;
  const criticas = pendencias.filter((p) => p.criticidade === "Alta" && (p.status === "Aberto" || p.status === "Em Análise")).length;
  const vencidas = pendencias.filter((p) => {
    return (p.status === "Aberto" || p.status === "Em Análise") && new Date(p.data_limite) < new Date();
  }).length;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pendências</h1>
          <p className="text-gray-500 text-sm mt-1">Checklist e rastreamento de problemas</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Pendência
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{criticas}</p>
          <p className="text-xs text-red-500 font-medium mt-0.5">Críticas</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-orange-600">{vencidas}</p>
          <p className="text-xs text-orange-500 font-medium mt-0.5">Vencidas</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{abertas}</p>
          <p className="text-xs text-blue-500 font-medium mt-0.5">Abertas</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{emAnalise}</p>
          <p className="text-xs text-amber-500 font-medium mt-0.5">Em Análise</p>
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
        <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
          <button
            onClick={() => setStatusFiltro("active")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${statusFiltro === "active" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Abertas
          </button>
          <button
            onClick={() => setStatusFiltro("all")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${statusFiltro === "all" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Todas
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFiltro(s)}
              className={`px-3 py-2 text-sm font-medium transition-colors ${statusFiltro === s ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={criticidadeFiltro}
          onChange={(e) => setCriticidadeFiltro(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="all">Todas criticidades</option>
          {criticidadeOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pendencias list */}
        <div className="space-y-3">
          {pendenciasFiltradas.map((p) => {
            const obra = obras.find((o) => o.id_obra === p.id_obra);
            const isVencida = new Date(p.data_limite) < new Date() && (p.status === "Aberto" || p.status === "Em Análise");
            const isSelected = selectedPendencia === p.id_pendencia;

            return (
              <button
                key={p.id_pendencia}
                onClick={() => setSelectedPendencia(isSelected ? null : p.id_pendencia)}
                className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all ${
                  isSelected
                    ? "border-orange-400 ring-2 ring-orange-200"
                    : isVencida
                    ? "border-red-200 bg-red-50/30"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">{tipoIcons[p.tipo_pendencia]}</span>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{p.id_pendencia} · {p.tipo_pendencia}</p>
                      <p className="font-medium text-gray-800 text-sm mt-0.5 line-clamp-2">{p.descricao}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <CriticidadeBadge criticidade={p.criticidade} />
                    <StatusPendenciaBadge status={p.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{obra?.nome_obra}</span>
                  <span className={isVencida ? "text-red-500 font-medium" : ""}>
                    {isVencida ? "⚠ Vencida: " : "Limite: "}{formatDate(p.data_limite)}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">Responsável: {p.responsavel}</p>
              </button>
            );
          })}

          {pendenciasFiltradas.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              Nenhuma pendência encontrada. 🎉
            </div>
          )}
        </div>

        {/* Pendencia detail panel */}
        {pendenciaSelecionada && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Detalhes da Pendência</h3>
                <span className="text-xs text-gray-400 font-mono">{pendenciaSelecionada.id_pendencia}</span>
              </div>
            </div>

            <div className="px-4 py-4 space-y-4">
              {/* Type and criticality */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-2xl">{tipoIcons[pendenciaSelecionada.tipo_pendencia]}</span>
                <span className="text-sm font-medium text-gray-700">{pendenciaSelecionada.tipo_pendencia}</span>
                <CriticidadeBadge criticidade={pendenciaSelecionada.criticidade} />
                <StatusPendenciaBadge status={pendenciaSelecionada.status} />
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Descrição</p>
                <p className="text-sm text-gray-800 leading-relaxed">{pendenciaSelecionada.descricao}</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Obra</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {obras.find((o) => o.id_obra === pendenciaSelecionada.id_obra)?.nome_obra}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Responsável</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{pendenciaSelecionada.responsavel}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">Criada em</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">{formatDate(pendenciaSelecionada.data_criacao)}</p>
                </div>
                <div className={`rounded-lg p-3 ${new Date(pendenciaSelecionada.data_limite) < new Date() ? "bg-red-50" : "bg-gray-50"}`}>
                  <p className="text-xs text-gray-400">Data Limite</p>
                  <p className={`text-sm font-medium mt-0.5 ${new Date(pendenciaSelecionada.data_limite) < new Date() ? "text-red-600" : "text-gray-700"}`}>
                    {formatDate(pendenciaSelecionada.data_limite)}
                  </p>
                </div>
              </div>

              {/* Comment area */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">Adicionar Comentário</p>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  rows={3}
                  placeholder="Descreva a atualização ou comentário..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2 flex-wrap">
              {pendenciaSelecionada.status === "Aberto" && (
                <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                  Em Análise
                </button>
              )}
              {(pendenciaSelecionada.status === "Aberto" || pendenciaSelecionada.status === "Em Análise") && (
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                  Resolver
                </button>
              )}
              {pendenciaSelecionada.status === "Resolvido" && (
                <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                  Encerrar
                </button>
              )}
              <button className="border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
