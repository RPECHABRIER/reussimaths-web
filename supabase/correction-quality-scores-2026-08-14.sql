begin;

alter table public.pedagogical_correction_audits
  add column if not exists quality_score smallint,
  add column if not exists sample_kind text not null default 'reference',
  add column if not exists feedback_family text not null default 'general';

alter table public.pedagogical_correction_audits
  drop constraint if exists pedagogical_correction_audits_quality_score_check,
  add constraint pedagogical_correction_audits_quality_score_check
    check (quality_score between 0 and 10),
  drop constraint if exists pedagogical_correction_audits_sample_kind_check,
  add constraint pedagogical_correction_audits_sample_kind_check
    check (sample_kind in ('reference', 'discovery', 'diagnostic')),
  drop constraint if exists pedagogical_correction_audits_feedback_family_check,
  add constraint pedagogical_correction_audits_feedback_family_check
    check (length(feedback_family) between 1 and 120);

create or replace function public.enforce_discovery_correction_quality()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.sample_kind = 'discovery'
     and new.status = 'validée'
     and (
       new.quality_score is null
       or new.quality_score < 9
       or cardinality(new.checked_criteria) < 8
     ) then
    raise exception 'Une correction Découverte exige une note >= 9/10 et les 8 critères validés';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_discovery_correction_quality_trigger
  on public.pedagogical_correction_audits;
create trigger enforce_discovery_correction_quality_trigger
before insert or update on public.pedagogical_correction_audits
for each row execute function public.enforce_discovery_correction_quality();

create index if not exists pedagogical_audits_quality_idx
  on public.pedagogical_correction_audits
  (sample_kind, quality_score, updated_at desc);

revoke all on function public.enforce_discovery_correction_quality() from public;

commit;
