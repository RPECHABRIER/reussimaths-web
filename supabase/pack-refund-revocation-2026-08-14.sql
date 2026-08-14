-- Révocation automatique d'un Pack Examen intégralement remboursé.
-- À exécuter une seule fois dans l'éditeur SQL Supabase avant de déployer
-- le webhook qui traite l'événement Stripe `charge.refunded`.

begin;

alter table public.subscriptions
  add column if not exists stripe_payment_intent_id text;

create unique index if not exists subscriptions_stripe_payment_intent_id_key
  on public.subscriptions (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;

commit;
