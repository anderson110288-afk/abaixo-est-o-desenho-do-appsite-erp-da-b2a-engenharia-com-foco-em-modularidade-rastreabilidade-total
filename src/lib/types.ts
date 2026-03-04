// ============================================================
// APPSITE ERP – B2A Engenharia – Type Definitions
// ============================================================

// ---- Obras / Cronograma ----

export type StatusObra = "Planejada" | "Em Execução" | "Concluída" | "Encerrada" | "Cancelada";
export type RiscoObra = "Normal" | "Atenção" | "Crítico";

export interface Obra {
  id_obra: string;
  nome_obra: string;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  status_obra: StatusObra;
  gerente_obra: string;
  risco_obra: RiscoObra;
  percentual_fisico_atual: number;
  endereco?: string;
}

export interface TipoServico {
  id_tipo_servico: string;
  descricao: string;
  ativo: boolean;
}

export interface ObraTipoServico {
  id_obra_tipo_servico: string;
  id_obra: string;
  id_tipo_servico: string;
  peso_fisico: number;
}

export interface Equipe {
  id_equipe: string;
  id_empreiteiro?: string;
  nome_exibicao: string;
  ativo: boolean;
}

export type StatusEtapa = "Planejado" | "Em Execução" | "Atrasado" | "Concluído";

export interface CronogramaEtapa {
  id_etapa: string;
  id_obra: string;
  id_obra_tipo_servico: string;
  id_equipe_responsavel?: string;
  descricao_etapa: string;
  data_inicio_planejada: string;
  prazo_dias_uteis: number;
  data_fim_planejada: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  percentual_execucao: number;
  status: StatusEtapa;
  peso_na_obra?: number;
}

// ---- Equipes / Contratos / Medições ----

export interface Empreiteiro {
  id_empreiteiro: string;
  nome_fantasia: string;
  razao_social?: string;
  cnpj?: string;
  cpf_responsavel?: string;
  telefone?: string;
  ativo: boolean;
}

export interface AtividadePadrao {
  id_atividade_padrao: string;
  id_tipo_servico: string;
  descricao_atividade: string;
  unidade_medida: string;
  ativo: boolean;
}

export type TipoContrato = "Unitário" | "Global";
export type StatusContrato = "Aberto" | "Em Medição" | "100% Medido" | "Encerrado";

export interface ContratoEmpreiteiro {
  id_contrato: string;
  numero_contrato: string;
  id_obra: string;
  id_empreiteiro: string;
  id_tipo_servico: string;
  data_inicio: string;
  data_fim: string;
  tipo_contrato: TipoContrato;
  valor_total_contratado: number;
  valor_total_medido: number;
  status_contrato: StatusContrato;
}

export interface ContratoItem {
  id_item_contrato: string;
  id_contrato: string;
  id_atividade_padrao?: string;
  descricao_item: string;
  unidade_medida: string;
  quantidade_contratada: number;
  valor_unitario?: number;
  valor_global_item?: number;
  valor_total_contratado_item: number;
}

export type StatusMedicao = "Rascunho" | "Aprovada Engenheiro" | "Enviada Financeiro" | "Paga";

export interface Medicao {
  id_medicao: string;
  numero_medicao: string;
  id_contrato: string;
  periodo_inicio: string;
  periodo_fim: string;
  data_medicao: string;
  status_medicao: StatusMedicao;
  valor_total: number;
}

export interface MedicaoItem {
  id_item_medicao: string;
  id_medicao: string;
  id_item_contrato: string;
  percentual_executado_periodo: number;
  quantidade_executada_periodo: number;
  valor_medido_periodo: number;
  percentual_acumulado: number;
  quantidade_acumulada: number;
  valor_acumulado: number;
  saldo_percentual: number;
  saldo_valor: number;
}

// ---- Pendências / Checklists ----

export type TipoPendencia = "Técnica" | "Tarefa combinada" | "Ajuste" | "Material" | "Problema";
export type StatusPendencia = "Aberto" | "Em Análise" | "Resolvido" | "Encerrado";
export type CriticidadePendencia = "Baixa" | "Média" | "Alta";

export interface Pendencia {
  id_pendencia: string;
  id_obra: string;
  id_contrato?: string;
  id_equipe?: string;
  tipo_pendencia: TipoPendencia;
  descricao: string;
  responsavel: string;
  data_criacao: string;
  data_limite: string;
  status: StatusPendencia;
  criticidade: CriticidadePendencia;
}

export interface PendenciaComentario {
  id_comentario: string;
  id_pendencia: string;
  texto: string;
  id_usuario: string;
  data_hora: string;
}

// ---- Compras ----

export interface Material {
  id_material: string;
  descricao: string;
  unidade_padrao: string;
  ativo: boolean;
}

export type UrgenciaSolicitacao = "Baixa" | "Média" | "Alta" | "Crítico";
export type StatusSolicitacao =
  | "Aberta"
  | "Em Cotação"
  | "Aprovada"
  | "Pedido Emitido"
  | "Entregue"
  | "Cancelada";

export interface SolicitacaoMaterial {
  id_solicitacao: string;
  id_obra: string;
  id_material?: string;
  descricao_material_livre: string;
  quantidade: number;
  unidade: string;
  urgencia: UrgenciaSolicitacao;
  id_obra_tipo_servico?: string;
  status_solicitacao: StatusSolicitacao;
  data_criacao: string;
}

export interface Fornecedor {
  id_fornecedor: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  ativo: boolean;
}

export type StatusCotacao = "Aberta" | "Em Análise" | "Concluída";

export interface Cotacao {
  id_cotacao: string;
  id_solicitacao: string;
  data_abertura: string;
  status_cotacao: StatusCotacao;
}

export interface CotacaoItemFornecedor {
  id_item_fornecedor: string;
  id_cotacao: string;
  id_fornecedor: string;
  descricao_item: string;
  quantidade: number;
  unidade: string;
  valor_unitario: number;
  valor_total_item: number;
}

export type StatusPedido = "Emitido" | "Entregue Parcial" | "Entregue Total" | "Cancelado";

export interface PedidoCompra {
  id_pedido: string;
  numero_pedido: string;
  id_cotacao: string;
  id_obra: string;
  id_fornecedor_escolhido: string;
  data_emissao: string;
  status_pedido: StatusPedido;
  valor_total: number;
}
