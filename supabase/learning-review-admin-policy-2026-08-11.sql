begin;

drop policy if exists "learning_review_cards: admin read" on public.learning_review_cards;
create policy "learning_review_cards: admin read"
  on public.learning_review_cards
  for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'romainpechabrier@gmail.com');

commit;
