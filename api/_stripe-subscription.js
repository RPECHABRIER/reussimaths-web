// Stripe API 2025+ expose la période de facturation sur les lignes de
// l'abonnement, tandis que les versions antérieures l'exposaient directement
// sur l'abonnement. Les webhooks peuvent utiliser une version plus récente
// que celle du SDK : accepter les deux formes évite les erreurs HTTP 500.
export function getStripePeriodEndSeconds(subscription) {
  const direct = Number(subscription?.current_period_end);
  if (Number.isFinite(direct) && direct > 0) return direct;

  const itemEnds = (subscription?.items?.data ?? [])
    .map((item) => Number(item?.current_period_end))
    .filter((value) => Number.isFinite(value) && value > 0);
  if (itemEnds.length > 0) return Math.max(...itemEnds);

  throw new Error("Date de fin de période Stripe absente");
}

export function getStripePeriodEndIso(subscription) {
  return new Date(getStripePeriodEndSeconds(subscription) * 1000).toISOString();
}
