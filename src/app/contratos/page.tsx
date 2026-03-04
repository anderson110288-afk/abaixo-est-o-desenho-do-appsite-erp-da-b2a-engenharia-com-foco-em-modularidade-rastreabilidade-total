"use client";

import { useState } from "react";
import Link from "next/link";
import {
  contratos,
  obras,
  empreiteiros,
  tiposServico,
  contratoItens,
} from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusContratoBadge } from "@/components/ui/Badge";
import type { StatusContrato } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusOptions: StatusContrato[] = ["Aberto", "Em Medição", "100% Medido", "Encerrado"];

export default function ContratosPage() {
  const [obraFiltro, setObraFiltro] = useState<string>("all");
  const [statusFiltro, setStatusFiltro] = useState<string>("active");
  const [selectedContrato, setSelectedContrato] = useState<string | null>(null);

  const obrasAtivas = obras.filter(
    (o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada"
  );

  const contratosFiltrados = contratos.filter((c) => {
    if (obraFiltro !== "all" && c.id_obra !== obraFiltro) return false;
    if (statusFiltro === "active") {
      return c.status_contrato === "Aberto" || c.status_contrato === "Em Medição";
    }
    if (statusFiltro !== "all" && c.status_contrato !== statusFiltro) return false;
    return true;
  });

  const contratoSelecionado = selectedContrato
    ? contratos.find((c) => c.id_contrato === selectedContrato)
    : null;
  const itensSelecionados = selectedContrato
    ? contratoItens.filter((i) => i.id_contrato === selectedContrato)
    : [];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {contratos.filter((c) => c.status_contrato === "Aberto" || c.status_contrato === "Em Medição").length} contratos em aberto
          </p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Contrato
        </button>
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
            Em Aberto
          </button>
          <button
            onClick={() => setStatusFiltro("all")}
            className={`px-3 py-2 text-sm font-medium transition-colors ${statusFiltro === "all" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}
          >
            Todos
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contracts list */}
        <div className="space-y-3">
          {contratosFiltrados.map((contrato) => {
            const obra = obras.find((o) => o.id_obra === contrato.id_obra);
            const emp = empreiteiros.find((e) => e.id_empreiteiro === contrato.id_empreiteiro);
            const ts = tiposServico.find((t) => t.id_tipo_servico === contrato.id_tipo_servico);
            const saldo = contrato.valor_total_contratado - contrato.valor_total_medido;
            const pct = contrato.valor_total_contratado > 0
              ? Math.round((contrato.valor_total_medido / contrato.valor_total_contratado) * 100)
              : 0;
            const isSelected = selectedContrato === contrato.id_contrato;

            return (
              <button
                key={contrato.id_contrato}
                onClick={() => setSelectedContrato(isSelected ? null : contrato.id_contrato)}
                className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all ${
                  isSelected ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-mono">{contrato.numero_contrato}</p>
                    <p className="font-semibold text-gray-900 text-sm mt-0.5">{emp?.nome_fantasia}</p>
                    <p className="text-xs text-gray-500">{obra?.nome_obra}</p>
                  </div>
                  <StatusContratoBadge status={contrato.status_contrato} />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ts?.descricao}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{contrato.tipo_contrato}</span>
                </div>

                {/* Financial */}
                <div className="grid grid-cols-3 gap-2 text-xs mb-2">
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

                <ProgressBar value={pct} size="sm" />

                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{formatDate(contrato.data_inicio)} → {formatDate(contrato.data_fim)}</span>
                  <span>{pct}% medido</span>
                </div>
              </button>
            );
          })}

          {contratosFiltrados.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
              Nenhum contrato encontrado.
            </div>
          )}
        </div>

        {/* Contract detail panel */}
        {contratoSelecionado && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Itens do Contrato</h3>
              <span className="text-xs text-gray-400 font-mono">{contratoSelecionado.numero_contrato}</span>
            </div>
            <div className="table-responsive">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Un.</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Qtd.</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Vl. Unit.</th>
                    <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {itensSelecionados.map((item) => (
                    <tr key={item.id_item_contrato} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 max-w-[200px]">
                        <p className="truncate">{item.descricao_item}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.unidade_medida}</td>
                      <td className="px-4 py-3 text-gray-600 text-right">{item.quantidade_contratada.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-3 text-gray-600 text-right">
                        {item.valor_unitario ? formatCurrency(item.valor_unitario) : "—"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-right">
                        {formatCurrency(item.valor_total_contratado_item)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-700 text-right">
                      Total Contratado
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                      {formatCurrency(contratoSelecionado.valor_total_contratado)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
              <Link
                href={`/medicoes?contrato=${contratoSelecionado.id_contrato}`}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors text-center"
              >
                Nova Medição
              </Link>
              <button className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Editar Contrato
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
