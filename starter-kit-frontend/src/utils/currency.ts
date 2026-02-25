// Formatteur de prix en FCFA uniquement
export const formatFCFA = (amount: number): string => {
  return `${amount.toLocaleString('fr-FR')} FCFA`;
};

// Convertir EUR en FCFA (si nécessaire pour les données)
export const EUR_TO_FCFA = 655.957;

export const eurosToFCFA = (euros: number): number => {
  return Math.round(euros * EUR_TO_FCFA);
};