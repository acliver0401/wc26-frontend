export interface Prediction {
  date: string
  home: string
  away: string
  pred: string
  pred_r: 'H' | 'D' | 'A'
  ph: number
  pd: number
  pa: number
  conf: number
  score_probs: Record<string, number>
  simulation: string
  reason: string
  bet_advice: string
  home_rank: number
  away_rank: number
  stadium: string
  stadium_city: string
  elevation_m: number
  temp_c: number
  humidity_pct: number
  grass_label: string
  grass_warning: boolean
  climate_zone: string
  home_fatigue_pct: number
  away_fatigue_pct: number
  precip_prob_pct?: number
  weather_source?: string
  stadium_id?: string
  home_as?: number
  away_as?: number
  home_dw?: number
  away_dw?: number
  home_form?: number
  away_form?: number
  home_injuries?: number
  away_injuries?: number
  warnings: string[]
}

export interface MediaSentiment {
  team: string
  sentiment_score: number
  news_volume: number
  positive_ratio: number
  negative_ratio: number
  trending: 'up' | 'down'
  hotness: number
  sample_count: number
}

export interface SocialHeat {
  team: string
  heat_score: number
  heat_change: number
  heat_direction: 'up' | 'down'
  base_popularity: number
  active_users_24h: number
  mention_count: number
  sentiment_ratio: number
}

export interface FIFARanking {
  rank: number
  team: string
  points: number
  confederation: string
}

export interface StadiumMeta {
  id: string
  name: string
  city: string
  country: string
  elevation_m: number
  grass_type: string
  grass_label: string
  grass_warning: boolean
  climate_zone: string
  avg_temp_june_c: number
  avg_humidity_june_pct: number
  extreme_conditions: string[]
  coordinates: { lat: number; lng: number }
}

export interface DashboardData {
  meta: {
    title: string
    generated_at: string
    total_teams: number
    total_matches: number
    backtest_accuracy: number
    training_samples: number
    cache?: {
      predictions_updated_at?: string | null
      weather_updated_at?: string | null
      injuries_updated_at?: string | null
    }
  }
  predictions: Prediction[]
  media_sentiment: MediaSentiment[]
  social_heat: SocialHeat[]
  fifa_rankings: FIFARanking[]
  stadiums: StadiumMeta[]
}

export interface ScoreSimData {
  home: string
  away: string
  score_probs: Record<string, number>
  simulation: string
}

export interface TeamAnalysis {
  team: string
  sentiment: number
  heat: number
  score: number
}
