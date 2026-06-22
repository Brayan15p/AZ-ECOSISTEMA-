export type Zone =
  | "Centro"
  | "Meridiano"
  | "El Bosque"
  | "Unión"
  | "San Luis"
  | "Norte";

export type Status = "Excelente" | "Cumple" | "Reentrenamiento" | "Incumplimiento";

export type Household = {
  id: string;
  ownerName: string;
  address: string;
  phone: string | null;
  zone: Zone;
  score: number;
  status: Status;
  points: number;
  penaltiesCount: number;
  rewardsCount: number;
  lastAuditAt: string | null;
  irsuId: string | null;
};

export type Publication = {
  id: string;
  title: string;
  body: string;
  category: "anuncio" | "campaña" | "educativo" | "alerta";
  authorId: string;
  imageUrl: string | null;
  videoUrl: string | null;
  publishedAt: string;
};

export type Reaction = {
  publicationId: string;
  userId: string;
  emoji: string;
};

export type Comment = {
  id: string;
  publicationId: string;
  userId: string;
  body: string;
  createdAt: string;
};
