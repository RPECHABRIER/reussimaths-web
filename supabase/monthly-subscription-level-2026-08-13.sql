-- Abonnement mensuel RéussiMaths : un compte élève = un niveau actif.
-- Migration idempotente à exécuter en un seul bloc dans Supabase SQL Editor.

begin;

alter table public.subscriptions
  add column if not exists subscription_level text,
  add column if not exists subscription_level_selected_at timestamptz,
  add column if not exists subscription_level_changed_at timestamptz;

alter table public.purchase_consents
  add column if not exists purchase_level text;

alter table public.purchase_consents
  drop constraint if exists purchase_consents_purchase_level_check;

alter table public.purchase_consents
  add constraint purchase_consents_purchase_level_check check (
    purchase_level is null or purchase_level in (
      'sixieme', 'cinquieme', 'quatrieme', 'troisieme', 'seconde',
      'premiere-spe', 'premiere-non-spe', 'premiere-techno',
      'terminale-spe', 'terminale-techno'
    )
  );

alter table public.subscriptions
  drop constraint if exists subscriptions_subscription_level_check;

alter table public.subscriptions
  add constraint subscriptions_subscription_level_check check (
    subscription_level is null or subscription_level in (
      'sixieme', 'cinquieme', 'quatrieme', 'troisieme', 'seconde',
      'premiere-spe', 'premiere-non-spe', 'premiere-techno',
      'terminale-spe', 'terminale-techno'
    )
  );

create or replace function public.change_monthly_subscription_level(p_level text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_subscription public.subscriptions%rowtype;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Non authentifié';
  end if;

  if p_level is null or p_level not in (
    'sixieme', 'cinquieme', 'quatrieme', 'troisieme', 'seconde',
    'premiere-spe', 'premiere-non-spe', 'premiere-techno',
    'terminale-spe', 'terminale-techno'
  ) then
    raise exception 'Niveau invalide';
  end if;

  select * into v_subscription
  from public.subscriptions
  where user_id = v_user_id
  for update;

  if not found
     or v_subscription.plan is distinct from 'mensuel'
     or v_subscription.status not in ('active', 'trialing')
     or (v_subscription.current_period_end is not null and v_subscription.current_period_end <= v_now) then
    raise exception 'Abonnement mensuel non actif';
  end if;

  if v_subscription.subscription_level = p_level then
    return;
  end if;

  -- Une erreur peut être corrigée librement pendant les 24 premières heures.
  -- Ensuite, un changement est possible au maximum tous les 30 jours.
  if v_subscription.subscription_level is not null
     and coalesce(v_subscription.subscription_level_selected_at, v_subscription.updated_at) <= v_now - interval '24 hours'
     and coalesce(v_subscription.subscription_level_changed_at,
                  v_subscription.subscription_level_selected_at,
                  v_subscription.updated_at) > v_now - interval '30 days' then
    raise exception 'Le niveau ne peut être changé qu’une fois tous les 30 jours';
  end if;

  update public.subscriptions
  set subscription_level = p_level,
      subscription_level_selected_at = coalesce(subscription_level_selected_at, v_now),
      subscription_level_changed_at = case
        when subscription_level is null then subscription_level_changed_at
        else v_now
      end,
      updated_at = v_now
  where user_id = v_user_id;
end;
$$;

revoke all on function public.change_monthly_subscription_level(text) from public;
grant execute on function public.change_monthly_subscription_level(text) to authenticated;

comment on column public.subscriptions.subscription_level is
  'Niveau unique débloqué par le plan mensuel.';

comment on column public.purchase_consents.purchase_level is
  'Niveau présenté et choisi lors de la souscription mensuelle.';

commit;
