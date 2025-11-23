export type TypeCollecte = 'jaune' | 'gris' | 'jaune+gris';

export interface Collecte {
  id: number;
  date: Date;
  typeCollecte: TypeCollecte;
  annee: number;
  mois: number;
  jour: number;
  estFerie: boolean;
  description?: string | null;
}

export interface JourFerie {
  id: number;
  date: Date;
  nom: string;
  annee: number;
}

export interface InfoSemaine {
  debut: Date;
  fin: Date;
  collectes: Collecte[];
  aCollecteJaune: boolean;
  aCollecteGrise: boolean;
}

export interface InfoMois {
  annee: number;
  mois: number;
  collectes: Collecte[];
  joursFeries: JourFerie[];
}
