export interface Card {
  id: string;
  deck_id: string;
  front_text: string;
  back_text: string;
  difficulty_level: number;
  times_studied: number;
  times_correct: number;
  last_studied_at?: string;
  created_at: string;
}

export interface Deck {
  id: string;
  user_id: string;
  name: string;
  subject?: string;
  color: string;
  created_at: string;
  updated_at: string;
  last_studied_at?: string;
  card_count?: number; // This will be calculated
}
