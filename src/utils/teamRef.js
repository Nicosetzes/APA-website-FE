// Mientras convivan ids de equipo string y number en la base, las
// comparaciones pasan por String (igual que el BE).
export const sameTeamId = (a, b) =>
  a !== null &&
  a !== undefined &&
  b !== null &&
  b !== undefined &&
  String(a) === String(b)
