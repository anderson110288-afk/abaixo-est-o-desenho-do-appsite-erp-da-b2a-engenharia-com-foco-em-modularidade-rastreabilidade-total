"use client";

import { useState } from "react";
import {
  empreiteiros,
  equipes,
  tiposServico,
  atividadesPadrao,
  contratos,
  obras,
} from "@/lib/mock-data";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function EquipesPage() {
  const [tab, setTab] = useState<"empreiteiros" | "equipes" | "atividades">("empreiteiros");
  const [tipoFiltro, setTipoFiltro] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [newName, setNewName] = useState("");

  // Anti-duplicity simulation
  const similarEmpreiteiros = newName.length > 3
    ? empreiteiros.filter((e) =>
        e.nome_fantasia.toLowerCase().includes(newName.toLowerCase().slice(0, 4))
      )
    : [];

  const empreiteirosFiltrados = empreiteiros.filter((e) => {
    if (searchTerm && !e.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const atividadesFiltradas = atividadesPadrao.filter((a) => {
    if (tipoFiltro !== "all" && a.id_tipo_servico !== tipoFiltro) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipes & Empreiteiros</h1>
          <p className="text-gray-500 text-sm mt-1">Cadastro de empreiteiros, equipes e atividades padrão</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Cadastro
        </button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white mb-5 w-fit">
        {(["empreiteiros", "equipes", "atividades"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              tab === t ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t === "empreiteiros" ? "Empreiteiros" : t === "equipes" ? "Equipes" : "Atividades Padrão"}
          </button>
        ))}
      </div>

      {/* ---- EMPREITEIROS TAB ---- */}
      {tab === "empreiteiros" && (
        <>
          {/* Anti-duplicity demo */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <p className="text-sm font-semibold text-blue-800 mb-2">🔍 Motor Anti-Duplicidade</p>
            <p className="text-xs text-blue-600 mb-3">
              Ao cadastrar um novo empreiteiro, o sistema verifica automaticamente por registros similares (sem depender de CNPJ/CPF).
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setShowDuplicateWarning(e.target.value.length > 3 && similarEmpreiteiros.length > 0);
                }}
                placeholder="Digite o nome do empreiteiro..."
                className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Verificar
              </button>
            </div>

            {/* Duplicate warning modal simulation */}
            {showDuplicateWarning && similarEmpreiteiros.length > 0 && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-800 mb-2">⚠️ Cadastros similares encontrados:</p>
                <div className="space-y-2">
                  {similarEmpreiteiros.map((e) => (
                    <div key={e.id_empreiteiro} className="flex items-center justify-between bg-white rounded-lg p-2 border border-amber-100">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{e.nome_fantasia}</p>
                        <p className="text-xs text-gray-500">
                          {e.cnpj ? `CNPJ: ${e.cnpj}` : e.cpf_responsavel ? `CPF: ${e.cpf_responsavel}` : "Sem documento"}
                          {" · "}
                          <span className={e.ativo ? "text-emerald-600" : "text-red-500"}>{e.ativo ? "Ativo" : "Inativo"}</span>
                        </p>
                      </div>
                      <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                        Usar este
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShowDuplicateWarning(false)}
                    className="flex-1 text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Criar novo mesmo assim
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar empreiteiro..."
              className="w-full max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {empreiteirosFiltrados.map((emp) => {
              const contratosEmp = contratos.filter((c) => c.id_empreiteiro === emp.id_empreiteiro);
              const equipeEmp = equipes.filter((e) => e.id_empreiteiro === emp.id_empreiteiro);
              const valorTotal = contratosEmp.reduce((acc, c) => acc + c.valor_total_contratado, 0);

              return (
                <div
                  key={emp.id_empreiteiro}
                  className={`bg-white rounded-xl border shadow-sm p-4 ${emp.ativo ? "border-gray-200" : "border-gray-100 opacity-60"}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-mono">{emp.id_empreiteiro}</p>
                      <h3 className="font-semibold text-gray-900 mt-0.5">{emp.nome_fantasia}</h3>
                      {emp.razao_social && emp.razao_social !== emp.nome_fantasia && (
                        <p className="text-xs text-gray-500">{emp.razao_social}</p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        emp.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {emp.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    {emp.cnpj && <p>CNPJ: {emp.cnpj}</p>}
                    {emp.cpf_responsavel && <p>CPF: {emp.cpf_responsavel}</p>}
                    {!emp.cnpj && !emp.cpf_responsavel && <p className="text-gray-300">Sem documento cadastrado</p>}
                    {emp.telefone && <p>📱 {emp.telefone}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-400">Contratos</p>
                      <p className="font-bold text-gray-700">{contratosEmp.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-400">Equipes</p>
                      <p className="font-bold text-gray-700">{equipeEmp.length}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <p className="text-gray-400">Volume</p>
                      <p className="font-bold text-gray-700 text-[10px]">
                        {valorTotal > 0 ? valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 text-xs border border-gray-200 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Editar
                    </button>
                    <button className="flex-1 text-xs bg-orange-50 text-orange-600 px-2 py-1.5 rounded-lg hover:bg-orange-100 transition-colors font-medium">
                      Ver Contratos
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ---- EQUIPES TAB ---- */}
      {tab === "equipes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {equipes.map((equipe) => {
            const emp = empreiteiros.find((e) => e.id_empreiteiro === equipe.id_empreiteiro);
            return (
              <div
                key={equipe.id_equipe}
                className={`bg-white rounded-xl border shadow-sm p-4 ${equipe.ativo ? "border-gray-200" : "border-gray-100 opacity-60"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 font-mono">{equipe.id_equipe}</p>
                    <h3 className="font-semibold text-gray-900 text-sm mt-0.5 leading-tight">{equipe.nome_exibicao}</h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      equipe.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {equipe.ativo ? "Ativa" : "Inativa"}
                  </span>
                </div>
                {emp && (
                  <p className="text-xs text-gray-500">
                    Empreiteiro: <span className="font-medium">{emp.nome_fantasia}</span>
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 text-xs border border-gray-200 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Editar
                  </button>
                  <button className="flex-1 text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">
                    Inativar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- ATIVIDADES PADRÃO TAB ---- */}
      {tab === "atividades" && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">Todos os tipos de serviço</option>
              {tiposServico.map((ts) => (
                <option key={ts.id_tipo_servico} value={ts.id_tipo_servico}>{ts.descricao}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="table-responsive">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left border-b border-gray-100">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo de Serviço</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Atividade</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidade</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {atividadesFiltradas.map((ativ) => {
                    const ts = tiposServico.find((t) => t.id_tipo_servico === ativ.id_tipo_servico);
                    return (
                      <tr key={ativ.id_atividade_padrao} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{ativ.id_atividade_padrao}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {ts?.descricao}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{ativ.descricao_atividade}</td>
                        <td className="px-4 py-3 text-gray-600">{ativ.unidade_medida}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              ativ.ativo ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {ativ.ativo ? "Ativa" : "Inativa"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
                              Editar
                            </button>
                            <button className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors">
                              Inativar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
