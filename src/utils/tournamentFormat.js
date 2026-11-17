const TOURNAMENT_FORMAT_LABELS = {
  american_cup: 'Copa América',
  champions_league: 'Champions League',
  club_world_cup: 'Mundial de clubes',
  league: 'Torneo largo',
  league_playin_playoff: 'Superliga APA',
  playoff: 'Eliminatoria',
  super_cup: 'Supercopa APA',
  world_cup: 'Copa del Mundo (formato clásico)',
  world_cup_2026: 'Copa del Mundo (formato nuevo)',
}

export const getTournamentFormatLabel = (format) =>
  TOURNAMENT_FORMAT_LABELS[format] || format || 'Formato no registrado'
