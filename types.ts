export interface Jogo {
  _id: string;
  data_hora: string;
  adversario: string;
  gols: number;
  assistencias: number;
  tempo_jogado: number;
  [key: string]: any;
}

export interface Treino {
  _id: string;
  data_hora: string;
  descricao_objetivo: string;
  tipo_treino: string;
  duracao_minutos: number;
  [key: string]: any;
}