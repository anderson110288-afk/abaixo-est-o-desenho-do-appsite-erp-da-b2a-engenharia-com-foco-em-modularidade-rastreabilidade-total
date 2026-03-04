"use client";

import type { RiscoObra, StatusObra, StatusContrato, StatusMedicao, StatusPendencia, CriticidadePendencia, StatusSolicitacao, UrgenciaSolicitacao, StatusEtapa } from "@/lib/types";

type BadgeVariant = "green" | "yellow" | "red" | "blue" | "gray" | "orange" | "purple";

const variantClasses: Record<BadgeVariant, string> = {
  green: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  yellow: "bg-amber-100 text-amber-800 border border-amber-200",
  red: "bg-red-100 text-red-800 border border-red-200",
  blue: "bg-blue-100 text-blue-800 border border-blue-200",
  gray: "bg-gray-100 text-gray-700 border border-gray-200",
  orange: "bg-orange-100 text-orange-800 border border-orange-200",
  purple: "bg-purple-100 text-purple-800 border border-purple-200",
};

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: "sm" | "md";
}

export function Badge({ label, variant, size = "sm" }: BadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}

// ---- Helpers ----

export function RiscoBadge({ risco }: { risco: RiscoObra }) {
  const map: Record<RiscoObra, BadgeVariant> = {
    Normal: "green",
    Atenção: "yellow",
    Crítico: "red",
  };
  return <Badge label={risco} variant={map[risco]} />;
}

export function StatusObraBadge({ status }: { status: StatusObra }) {
  const map: Record<StatusObra, BadgeVariant> = {
    Planejada: "blue",
    "Em Execução": "green",
    Concluída: "gray",
    Encerrada: "gray",
    Cancelada: "red",
  };
  return <Badge label={status} variant={map[status]} />;
}

export function StatusContratoBadge({ status }: { status: StatusContrato }) {
  const map: Record<StatusContrato, BadgeVariant> = {
    Aberto: "blue",
    "Em Medição": "yellow",
    "100% Medido": "green",
    Encerrado: "gray",
  };
  return <Badge label={status} variant={map[status]} />;
}

export function StatusMedicaoBadge({ status }: { status: StatusMedicao }) {
  const map: Record<StatusMedicao, BadgeVariant> = {
    Rascunho: "gray",
    "Aprovada Engenheiro": "blue",
    "Enviada Financeiro": "yellow",
    Paga: "green",
  };
  return <Badge label={status} variant={map[status]} />;
}

export function StatusPendenciaBadge({ status }: { status: StatusPendencia }) {
  const map: Record<StatusPendencia, BadgeVariant> = {
    Aberto: "red",
    "Em Análise": "yellow",
    Resolvido: "green",
    Encerrado: "gray",
  };
  return <Badge label={status} variant={map[status]} />;
}

export function CriticidadeBadge({ criticidade }: { criticidade: CriticidadePendencia }) {
  const map: Record<CriticidadePendencia, BadgeVariant> = {
    Baixa: "green",
    Média: "yellow",
    Alta: "red",
  };
  return <Badge label={criticidade} variant={map[criticidade]} />;
}

export function StatusSolicitacaoBadge({ status }: { status: StatusSolicitacao }) {
  const map: Record<StatusSolicitacao, BadgeVariant> = {
    Aberta: "blue",
    "Em Cotação": "yellow",
    Aprovada: "green",
    "Pedido Emitido": "purple",
    Entregue: "gray",
    Cancelada: "red",
  };
  return <Badge label={status} variant={map[status]} />;
}

export function UrgenciaBadge({ urgencia }: { urgencia: UrgenciaSolicitacao }) {
  const map: Record<UrgenciaSolicitacao, BadgeVariant> = {
    Baixa: "green",
    Média: "yellow",
    Alta: "orange",
    Crítico: "red",
  };
  return <Badge label={urgencia} variant={map[urgencia]} />;
}

export function StatusEtapaBadge({ status }: { status: StatusEtapa }) {
  const map: Record<StatusEtapa, BadgeVariant> = {
    Planejado: "blue",
    "Em Execução": "yellow",
    Atrasado: "red",
    Concluído: "green",
  };
  return <Badge label={status} variant={map[status]} />;
}
