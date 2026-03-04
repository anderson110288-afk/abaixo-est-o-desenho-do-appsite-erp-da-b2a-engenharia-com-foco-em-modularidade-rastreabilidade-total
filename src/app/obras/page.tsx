import Link from "next/link";
import { obras, pendencias, contratos } from "@/lib/mock-data";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { RiscoBadge, StatusObraBadge } from "@/components/ui/Badge";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function diasRestantes(dataFim: string) {
  const hoje = new Date();
  const fim = new Date(dataFim);
  const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function ObrasPage() {
  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
          <p className="text-gray-500 text-sm mt-1">{obras.length} obras cadastradas</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nova Obra
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {obras.map((obra) => {
          const dias = diasRestantes(obra.data_fim_prevista);
          const pendenciasObra = pendencias.filter(
            (p) => p.id_obra === obra.id_obra && (p.status === "Aberto" || p.status === "Em Análise")
          );
          const contratosObra = contratos.filter((c) => c.id_obra === obra.id_obra);
          const valorTotalContratado = contratosObra.reduce((acc, c) => acc + c.valor_total_contratado, 0);

          return (
            <Link
              key={obra.id_obra}
              href={`/obras/${obra.id_obra}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 block"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-mono">{obra.id_obra}</p>
                  <h3 className="font-semibold text-gray-900 mt-0.5 leading-tight">{obra.nome_obra}</h3>
                  <p className="text-xs text-gray-500 mt-1">{obra.gerente_obra}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <StatusObraBadge status={obra.status_obra} />
                  <RiscoBadge risco={obra.risco_obra} />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Progresso físico</span>
                </div>
                <ProgressBar value={obra.percentual_fisico_atual} size="md" />
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Início</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(obra.data_inicio_prevista)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-400">Prazo</p>
                  <p className="text-xs font-semibold text-gray-700 mt-0.5">{formatDate(obra.data_fim_prevista)}</p>
                </div>
                <div
                  className={`rounded-lg p-2 ${
                    dias < 0
                      ? "bg-red-50"
                      : dias < 30
                      ? "bg-amber-50"
                      : "bg-gray-50"
                  }`}
                >
                  <p className="text-xs text-gray-400">Dias rest.</p>
                  <p
                    className={`text-xs font-bold mt-0.5 ${
                      dias < 0 ? "text-red-600" : dias < 30 ? "text-amber-600" : "text-gray-700"
                    }`}
                  >
                    {dias < 0 ? `${Math.abs(dias)}d atr.` : `${dias}d`}
                  </p>
                </div>
              </div>

              {/* Footer stats */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {pendenciasObra.length} pendências
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {contratosObra.length} contratos
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {valorTotalContratado > 0
                    ? valorTotalContratado.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })
                    : "—"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
