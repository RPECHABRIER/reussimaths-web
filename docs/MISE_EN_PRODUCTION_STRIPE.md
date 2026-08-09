# Mise en production Stripe — checklist RéussiMaths

Cette checklist ne doit être cochée qu'avec les clés **Live**. Les essais Stripe restent séparés de la production.

## 1. Entreprise et offre

- [ ] SIRET, nom de l'entreprise, adresse, e-mail de support et coordonnées bancaires validés dans Stripe.
- [ ] Libellé bancaire reconnaissable (`REUSSIMATHS`) et e-mails de reçus activés.
- [ ] Produit mensuel : **4,99 EUR**, récurrent tous les mois, sans période d'essai Stripe.
- [ ] Pack Examen : **9 EUR**, paiement unique, trois mois d'accès, un seul niveau.
- [ ] Les identifiants Live des deux prix sont copiés sans espaces.

## 2. Variables Vercel — Production uniquement

- [ ] `STRIPE_SECRET_KEY` = clé secrète Live (`sk_live_…`).
- [ ] `STRIPE_PRICE_MENSUEL` = identifiant Live du prix mensuel (`price_…`).
- [ ] `STRIPE_PRICE_EXAMEN` = identifiant Live du paiement unique (`price_…`).
- [ ] `PUBLIC_APP_URL` = domaine public définitif, en HTTPS et sans slash final.
- [ ] `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` correspondent au projet de production.
- [ ] Aucun secret Stripe ou Supabase n'est préfixé par `VITE_` ni présent dans le dépôt.

## 3. Webhook Live

- [ ] Endpoint : `https://DOMAINE/api/stripe-webhook`.
- [ ] Événements : `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`.
- [ ] `STRIPE_WEBHOOK_SECRET` contient le secret `whsec_…` de cet endpoint Live.
- [ ] Un redéploiement Vercel a été effectué après la modification des variables.
- [ ] Un événement rejoué retourne HTTP 200 avec `duplicate: true` et ne recrée aucun droit.

## 4. Portail client

- [ ] Mise à jour du moyen de paiement autorisée.
- [ ] Historique des factures visible.
- [ ] Résiliation en fin de période autorisée, sans changement libre de produit.
- [ ] Le retour du portail ramène vers `/compte`.

## 5. Achat réel de contrôle

- [ ] Utiliser un compte élève distinct de l'administrateur.
- [ ] Vérifier le consentement CGU/CGV avant l'ouverture de Checkout.
- [ ] Effectuer un seul achat mensuel réel puis vérifier l'accès, la facture et la date de renouvellement.
- [ ] Vérifier dans Supabase `subscriptions`, `purchase_consents` et `stripe_webhook_events`.
- [ ] Recharger, se déconnecter et se reconnecter : l'accès doit rester actif.
- [ ] Tenter un second achat : il doit être refusé comme doublon.
- [ ] Résilier puis réactiver : les deux états et la date de fin doivent être exacts.
- [ ] Effectuer séparément un Pack Examen, sélectionner son niveau et vérifier l'expiration à trois mois.

## 6. Incidents et retour arrière

- [ ] Conserver les identifiants des transactions de contrôle et les heures des essais.
- [ ] Savoir désactiver immédiatement les liens de paiement en retirant les identifiants de prix Live de Vercel.
- [ ] En cas d'activation retardée, ne jamais demander un second paiement : vérifier Stripe, le webhook Vercel puis Supabase.
- [ ] Documenter remboursement, contact support et correction manuelle d'un droit avant l'ouverture au public.

