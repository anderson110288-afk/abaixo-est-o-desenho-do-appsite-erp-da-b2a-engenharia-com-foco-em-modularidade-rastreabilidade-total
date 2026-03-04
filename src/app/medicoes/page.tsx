"use client";

import { useState } from "react";
import {
  medicoes,
  contratos,
  obras,
  empreiteiros,
  contratoItens,
} from "@/lib/mock-data";
import { StatusMedicaoBadge, StatusContratoBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { StatusMedicao } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusOptions: StatusMedicao[] = ["Rascunho", "Aprovada Engenheiro", "Enviada Financeiro", "Paga"];

export default function MedicoesPage() {
  const [statusFiltro, setStatusFiltro] = useState<string>("all");
  const [obraFiltro, setObraFiltro] = useState<string>("all");
  const [selectedMedicao, setSelectedMedicao] = useState<string | null>(null);

  const obrasAtivas = obras.filter(
    (o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada"
  );

  const medicoesFiltradas = medicoes.filter((m) => {
    const contrato = contratos.find((c) => c.id_contrato === m.id_contrato);
    if (obraFiltro !== "all" && contrato?.id_obra !== obraFiltro) return false;
    if (statusFiltro !== "all" && m.status_medicao !== statusFiltro) return false;
    return true;
  });

  const medicaoSelecionada = selectedMedicao
    ? medicoes.find((m) => m.id_medicao === selectedMedicao)
    : null;

  const contratoMedicao = medicaoSelecionada
    ? contratos.find((c) => c.id_contrato === medicaoSelecionada.id_contrato)
    : null;

  const itensMedicao = contratoMedicao
    ? contratoItens.filter((i) => i.id_contrato === contratoMedicao.id_contrato)
    : [];

  // Summary stats
  const totalPendente = medicoes
    .filter((m) => m.status_medicao === "Aprovada Engenheiro" || m.status_medicao === "Enviada Financeiro")
    .reduce((acc, m) => acc + m.valor_total, 0);

  const totalPago = medicoes
    .filter((m) => m.status_medicao === "Paga")
    .reduce((acc, m) => acc + m.valor_total, 0);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medições</h1>
          <p className="text-gray-500 text-sm mt-1">{medicoes.length} medições registradas</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Medição
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <p className="text-xs text-amber-600 font-medium uppercase tracking-wide">Pendente de Pagamento</p>
          <p className="text-xl font-bold text-amber-700 mt-1">{formatCurrency(totalPendente)}</p>
          <p className="text-xs text-amber-500 mt-0.5">
            {medicoes.filter((m) => m.status_medicao === "Aprovada Engenheiro" || m.status_medicao === "Enviada Financeiro").length} medições
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Total Pago</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(totalPago)}</p>
          <p className="text-xs text-emerald-500 mt-0.5">
            {medicoes.filter((m) => m.status_medicao === "Paga").length} medições
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Medicoes list */}
        <div className="space-y-3">
          {medicoesFiltradas.map((medicao) => {
            const contrato = contratos.find((c) => c.id_contrato === medicao.id_contrato);
            const obra = obras.find((o) => o.id_obra === contrato?.id_obra);
            const emp = empreiteiros.find((e) => e.id_empreiteiro === contrato?.id_empreiteiro);
            const isSelected = selectedMedicao === medicao.id_medicao;

            return (
              <button
                key={medicao.id_medicao}
                onClick={() => setSelectedMedicao(isSelected ? null : medicao.id_medicao)}
                className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all ${
                  isSelected ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-mono">
                      {contrato?.numero_contrato} · Medição #{medicao.numero_medicao}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{emp?.nome_fantasia}</p>
                    <p className="text-xs text-gray-500">{obra?.nome_obra}</p>
                  </div>
                  <StatusMedicaoBadge status={medicao.status_medicao} />
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Período: {formatDate(medicao.periodo_inicio)} → {formatDate(medicao.periodo_fim)}
                  </div>
                  <p className="text-base font-bold text-gray-900">{formatCurrency(medicao.valor_total)}</p>
                </div>

                <p className="text-xs text-gray-400 mt-1">Data medição: {formatDate(medicao.data_medicao)}</p>

                {/* Action buttons based on status */}
                {medicao.status_medicao === "Rascunho" && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                      Aprovar (Engenheiro)
                    </button>
                    <button className="flex-1 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                      Editar
                    </button>
                  </div>
                )}
                {medicao.status_medicao === "Aprovada Engenheiro" && (
                  <div className="mt-3">
                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                      Enviar ao Financeiro
                    </button>
                  </div>
                )}
                {medicao.status_medicao === "Enviada Financeiro" && (
                  <div className="mt-3">
                    <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                      Registrar Pagamento
                    </button>
                  </div>
                )}
              </button>
            );
          })}

          {medicoesFiltradas.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              Nenhuma medição encontrada.
            </div>
          )}
        </div>

        {/* Medicao detail panel */}
        {medicaoSelecionada && contratoMedicao && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Detalhes da Medição</h3>
                <StatusMedicaoBadge status={medicaoSelecionada.status_medicao} />
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                {contratoMedicao.numero_contrato} · Medição #{medicaoSelecionada.numero_medicao}
              </p>
            </div>

            {/* Contract summary */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Status do Contrato</span>
                <StatusContratoBadge status={contratoMedicao.status_contrato} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Contratado</p>
                  <p className="font-semibold text-gray-700">{formatCurrency(contratoMedicao.valor_total_contratado)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Medido</p>
                  <p className="font-semibold text-emerald-600">{formatCurrency(contratoMedicao.valor_total_medido)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Saldo</p>
                  <p className="font-semibold text-amber-600">
                    {formatCurrency(contratoMedicao.valor_total_contratado - contratoMedicao.valor_total_medido)}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={Math.round((contratoMedicao.valor_total_medido / contratoMedicao.valor_total_contratado) * 100)}
                  size="sm"
                />
              </div>
            </div>

            {/* Items */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Itens do Contrato</p>
              <div className="space-y-3">
                {itensMedicao.map((item) => {
                  // Simulate measured percentage for this item
                  const pctMedido = Math.round((contratoMedicao.valor_total_medido / contratoMedicao.valor_total_contratado) * 100);
                  return (
                    <div key={item.id_item_contrato} className="border border-gray-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800">{item.descricao_item}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <p className="text-gray-400">Qtd. Contratada</p>
                          <p className="font-semibold text-gray-700">{item.quantidade_contratada.toLocaleString("pt-BR")} {item.unidade_medida}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Valor Total</p>
                          <p className="font-semibold text-gray-700">{formatCurrency(item.valor_total_contratado_item)}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-400">Medido acumulado</span>
                          <span className="text-xs font-semibold text-gray-600">{pctMedido}%</span>
                        </div>
                        <ProgressBar value={pctMedido} size="sm" showLabel={false} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total */}
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total desta Medição</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(medicaoSelecionada.valor_total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
