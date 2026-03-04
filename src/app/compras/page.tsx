"use client";

import { useState } from "react";
import {
  solicitacoes,
  obras,
  materiais,
  cotacoes,
  cotacoesItensFornecedor,
  fornecedores,
  pedidosCompra,
} from "@/lib/mock-data";
import { StatusSolicitacaoBadge, UrgenciaBadge } from "@/components/ui/Badge";
import type { StatusSolicitacao } from "@/lib/types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusOptions: StatusSolicitacao[] = ["Aberta", "Em Cotação", "Aprovada", "Pedido Emitido", "Entregue", "Cancelada"];

export default function ComprasPage() {
  const [tab, setTab] = useState<"solicitacoes" | "cotacoes" | "pedidos">("solicitacoes");
  const [obraFiltro, setObraFiltro] = useState<string>("all");
  const [statusFiltro, setStatusFiltro] = useState<string>("active");
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<string | null>(null);
  const [selectedCotacao, setSelectedCotacao] = useState<string | null>(null);

  const obrasAtivas = obras.filter(
    (o) => o.status_obra === "Em Execução" || o.status_obra === "Planejada"
  );

  const solicitacoesFiltradas = solicitacoes.filter((s) => {
    if (obraFiltro !== "all" && s.id_obra !== obraFiltro) return false;
    if (statusFiltro === "active") {
      return s.status_solicitacao === "Aberta" || s.status_solicitacao === "Em Cotação" || s.status_solicitacao === "Aprovada";
    }
    if (statusFiltro !== "all" && s.status_solicitacao !== statusFiltro) return false;
    return true;
  });

  // Cotação detail
  const cotacaoSelecionada = selectedCotacao
    ? cotacoes.find((c) => c.id_cotacao === selectedCotacao)
    : null;

  const itensCotacao = cotacaoSelecionada
    ? cotacoesItensFornecedor.filter((i) => i.id_cotacao === cotacaoSelecionada.id_cotacao)
    : [];

  // Group items by fornecedor for comparison
  const fornecedoresNaCotacao = [...new Set(itensCotacao.map((i) => i.id_fornecedor))];
  const totalPorFornecedor = fornecedoresNaCotacao.map((fId) => ({
    id: fId,
    nome: fornecedores.find((f) => f.id_fornecedor === fId)?.nome ?? fId,
    total: itensCotacao.filter((i) => i.id_fornecedor === fId).reduce((acc, i) => acc + i.valor_total_item, 0),
  }));
  const melhorFornecedor = totalPorFornecedor.reduce(
    (best, f) => (f.total < best.total ? f : best),
    totalPorFornecedor[0]
  );

  // Stats
  const abertas = solicitacoes.filter((s) => s.status_solicitacao === "Aberta").length;
  const emCotacao = solicitacoes.filter((s) => s.status_solicitacao === "Em Cotação").length;
  const criticas = solicitacoes.filter((s) => s.urgencia === "Crítico" && s.status_solicitacao !== "Entregue" && s.status_solicitacao !== "Cancelada").length;

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compras</h1>
          <p className="text-gray-500 text-sm mt-1">Solicitações, cotações e pedidos</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Solicitação
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-600">{criticas}</p>
          <p className="text-xs text-red-500 font-medium mt-0.5">Urgência Crítica</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{abertas}</p>
          <p className="text-xs text-blue-500 font-medium mt-0.5">Abertas</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{emCotacao}</p>
          <p className="text-xs text-amber-500 font-medium mt-0.5">Em Cotação</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white mb-4 w-fit">
        {(["solicitacoes", "cotacoes", "pedidos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "solicitacoes" ? "Solicitações" : t === "cotacoes" ? "Cotações" : "Pedidos"}
          </button>
        ))}
      </div>

      {/* ---- SOLICITAÇÕES TAB ---- */}
      {tab === "solicitacoes" && (
        <>
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
                Todas
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="table-responsive">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Obra</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Material</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Qtd.</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Un.</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Urgência</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {solicitacoesFiltradas.map((s) => {
                    const obra = obras.find((o) => o.id_obra === s.id_obra);
                    return (
                      <tr key={s.id_solicitacao} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{s.id_solicitacao}</td>
                        <td className="px-4 py-3 text-gray-700 max-w-[140px]">
                          <p className="truncate text-xs">{obra?.nome_obra}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium max-w-[180px]">
                          <p className="truncate">{s.descricao_material_livre}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700 text-right">{s.quantidade.toLocaleString("pt-BR")}</td>
                        <td className="px-4 py-3 text-gray-600">{s.unidade}</td>
                        <td className="px-4 py-3">
                          <UrgenciaBadge urgencia={s.urgencia} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusSolicitacaoBadge status={s.status_solicitacao} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(s.data_criacao)}</td>
                        <td className="px-4 py-3">
                          {s.status_solicitacao === "Aberta" && (
                            <button className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-200 transition-colors font-medium">
                              Cotar
                            </button>
                          )}
                          {s.status_solicitacao === "Em Cotação" && (
                            <button
                              onClick={() => { setTab("cotacoes"); }}
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                            >
                              Ver Cotação
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {solicitacoesFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                        Nenhuma solicitação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ---- COTAÇÕES TAB ---- */}
      {tab === "cotacoes" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Cotações list */}
          <div className="space-y-3">
            {cotacoes.map((cotacao) => {
              const sol = solicitacoes.find((s) => s.id_solicitacao === cotacao.id_solicitacao);
              const obra = obras.find((o) => o.id_obra === sol?.id_obra);
              const isSelected = selectedCotacao === cotacao.id_cotacao;

              return (
                <button
                  key={cotacao.id_cotacao}
                  onClick={() => setSelectedCotacao(isSelected ? null : cotacao.id_cotacao)}
                  className={`w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all ${
                    isSelected ? "border-orange-400 ring-2 ring-orange-200" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-400 font-mono">{cotacao.id_cotacao}</p>
                      <p className="font-semibold text-gray-900 text-sm mt-0.5">{sol?.descricao_material_livre}</p>
                      <p className="text-xs text-gray-500">{obra?.nome_obra}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        cotacao.status_cotacao === "Concluída"
                          ? "bg-emerald-100 text-emerald-700"
                          : cotacao.status_cotacao === "Em Análise"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {cotacao.status_cotacao}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Aberta em: {formatDate(cotacao.data_abertura)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {itensCotacao.length > 0 ? `${fornecedoresNaCotacao.length} fornecedores` : "Aguardando cotações"}
                  </p>
                </button>
              );
            })}
            {cotacoes.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
                Nenhuma cotação em andamento.
              </div>
            )}
          </div>

          {/* Cotação comparison panel */}
          {cotacaoSelecionada && itensCotacao.length > 0 && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Comparativo de Cotação</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{cotacaoSelecionada.id_cotacao}</p>
              </div>

              {/* Comparison table */}
              <div className="table-responsive">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b border-gray-100">
                      <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Qtd.</th>
                      {fornecedoresNaCotacao.map((fId) => {
                        const forn = fornecedores.find((f) => f.id_fornecedor === fId);
                        const isMelhor = melhorFornecedor?.id === fId;
                        return (
                          <th key={fId} className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-right ${isMelhor ? "text-emerald-600" : "text-gray-500"}`}>
                            {forn?.nome ?? fId}
                            {isMelhor && <span className="ml-1">👑</span>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* Group by item description */}
                    {[...new Set(itensCotacao.map((i) => i.descricao_item))].map((desc) => {
                      const itemsForDesc = itensCotacao.filter((i) => i.descricao_item === desc);
                      const minUnitPrice = Math.min(...itemsForDesc.map((i) => i.valor_unitario));

                      return (
                        <tr key={desc} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-medium max-w-[160px]">
                            <p className="truncate">{desc}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-right">
                            {itemsForDesc[0]?.quantidade} {itemsForDesc[0]?.unidade}
                          </td>
                          {fornecedoresNaCotacao.map((fId) => {
                            const item = itemsForDesc.find((i) => i.id_fornecedor === fId);
                            const isBest = item?.valor_unitario === minUnitPrice;
                            return (
                              <td key={fId} className={`px-4 py-3 text-right ${isBest ? "bg-emerald-50" : ""}`}>
                                {item ? (
                                  <div>
                                    <p className={`font-semibold ${isBest ? "text-emerald-700" : "text-gray-700"}`}>
                                      {formatCurrency(item.valor_unitario)}/un
                                    </p>
                                    <p className={`text-xs ${isBest ? "text-emerald-600" : "text-gray-500"}`}>
                                      {formatCurrency(item.valor_total_item)}
                                    </p>
                                    {isBest && <span className="text-xs text-emerald-600 font-medium">✓ Melhor</span>}
                                  </div>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 border-t border-gray-200">
                      <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-gray-700">
                        Total Geral
                      </td>
                      {totalPorFornecedor.map((f) => {
                        const isBest = f.id === melhorFornecedor?.id;
                        return (
                          <td key={f.id} className={`px-4 py-3 text-right ${isBest ? "bg-emerald-50" : ""}`}>
                            <p className={`text-sm font-bold ${isBest ? "text-emerald-700" : "text-gray-800"}`}>
                              {formatCurrency(f.total)}
                            </p>
                            {isBest && <p className="text-xs text-emerald-600 font-medium">👑 Melhor opção</p>}
                          </td>
                        );
                      })}
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Confirm button */}
              <div className="px-4 py-3 border-t border-gray-100 bg-emerald-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Melhor opção: {melhorFornecedor?.nome}</p>
                    <p className="text-xs text-gray-500">Total: {formatCurrency(melhorFornecedor?.total ?? 0)}</p>
                  </div>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Confirmar e Gerar Pedido
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  * Você pode escolher um fornecedor diferente do mais barato, mas precisará justificar.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- PEDIDOS TAB ---- */}
      {tab === "pedidos" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="table-responsive">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-100">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nº Pedido</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Obra</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Fornecedor</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data Emissão</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Valor Total</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pedidosCompra.map((pedido) => {
                  const obra = obras.find((o) => o.id_obra === pedido.id_obra);
                  const forn = fornecedores.find((f) => f.id_fornecedor === pedido.id_fornecedor_escolhido);
                  return (
                    <tr key={pedido.id_pedido} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-400 font-mono">{pedido.numero_pedido}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-[160px]">
                        <p className="truncate text-xs">{obra?.nome_obra}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{forn?.nome}</td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(pedido.data_emissao)}</td>
                      <td className="px-4 py-3 text-gray-900 font-bold text-right">{formatCurrency(pedido.valor_total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            pedido.status_pedido === "Entregue Total"
                              ? "bg-emerald-100 text-emerald-700"
                              : pedido.status_pedido === "Emitido"
                              ? "bg-blue-100 text-blue-700"
                              : pedido.status_pedido === "Cancelado"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {pedido.status_pedido}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {pedidosCompra.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                      Nenhum pedido emitido.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
