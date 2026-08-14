begin;

insert into public.pedagogical_correction_audits (
  sample_key,
  title,
  status,
  checked_criteria,
  note,
  quality_score,
  sample_kind,
  feedback_family,
  updated_at
)
values
  ('Découverte sixieme — question 1', 'Découverte sixieme — question 1', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : addition posée avec unités, virgules et dixièmes alignés.', 10, 'discovery', 'decimal_place_value', now()),
  ('Découverte sixieme — question 2', 'Découverte sixieme — question 2', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : partage en parts égales et lecture numérateur/dénominateur.', 10, 'discovery', 'fraction_sharing', now()),
  ('Découverte sixieme — question 3', 'Découverte sixieme — question 3', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : retour à l’unité et contrôle par décomposition des six cahiers.', 10, 'discovery', 'proportionality', now()),
  ('Découverte sixieme — question 4', 'Découverte sixieme — question 4', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : sens de l’aire, formule et unité carrée.', 10, 'discovery', 'geometry_rectangle_measure', now()),
  ('Découverte sixieme — question 5', 'Découverte sixieme — question 5', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : ordre abscisse-ordonnée, repère et moyen mnémotechnique.', 10, 'discovery', 'point_coordinates', now()),

  ('Découverte cinquieme — question 1', 'Découverte cinquieme — question 1', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : signes opposés et neutralisation visuelle des unités.', 10, 'discovery', 'relative_numbers', now()),
  ('Découverte cinquieme — question 2', 'Découverte cinquieme — question 2', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : dénominateur commun et transformation équivalente des fractions.', 10, 'discovery', 'fractions', now()),
  ('Découverte cinquieme — question 3', 'Découverte cinquieme — question 3', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : calcul de 10 %, doublement et multiplication d’une quantité par une proportion.', 10, 'discovery', 'percentage_of_number', now()),
  ('Découverte cinquieme — question 4', 'Découverte cinquieme — question 4', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : somme des angles et visualisation par angles alternes-internes.', 10, 'discovery', 'geometry_triangle_angles', now()),
  ('Découverte cinquieme — question 5', 'Découverte cinquieme — question 5', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : issues favorables sur issues possibles et contrôle entre 0 et 1.', 10, 'discovery', 'probability_basic', now()),

  ('Découverte quatrieme — question 1', 'Découverte quatrieme — question 1', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : règle des signes explicitée avant le calcul des distances à zéro.', 10, 'discovery', 'relative_product', now()),
  ('Découverte quatrieme — question 2', 'Découverte quatrieme — question 2', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : balance à l’équilibre, opérations identiques et vérification.', 10, 'discovery', 'equations', now()),
  ('Découverte quatrieme — question 3', 'Découverte quatrieme — question 3', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : hypoténuse, carrés, racine carrée et contrôle triangulaire.', 10, 'discovery', 'pythagoras', now()),
  ('Découverte quatrieme — question 4', 'Découverte quatrieme — question 4', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : retour à une heure, quotient et interprétation de km/h.', 10, 'discovery', 'proportionality', now()),
  ('Découverte quatrieme — question 5', 'Découverte quatrieme — question 5', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : partage équitable de la somme et contrôle entre les extrêmes.', 10, 'discovery', 'statistics_mean', now()),

  ('Découverte troisieme — question 1', 'Découverte troisieme — question 1', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : Thalès relié aux triangles semblables, à la proportionnalité et au produit en croix.', 10, 'discovery', 'geometry_thales', now()),
  ('Découverte troisieme — question 2', 'Découverte troisieme — question 2', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : règle du produit nul, deux branches et sélection de la solution positive.', 10, 'discovery', 'equation_product_zero', now()),
  ('Découverte troisieme — question 3', 'Découverte troisieme — question 3', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : distinction image-antécédent et machine à fonction.', 10, 'discovery', 'function_image', now()),
  ('Découverte troisieme — question 4', 'Découverte troisieme — question 4', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : augmentation appliquée au prix initial et double méthode de contrôle.', 10, 'discovery', 'percentage_change', now()),
  ('Découverte troisieme — question 5', 'Découverte troisieme — question 5', 'validée', array[0,1,2,3,4,5,6,7]::smallint[], 'Validation experte : événement contraire, complément à 1 et contrôle de cohérence.', 10, 'discovery', 'probability_contrary', now())
on conflict (sample_key) do update
set
  title = excluded.title,
  status = excluded.status,
  checked_criteria = excluded.checked_criteria,
  note = excluded.note,
  quality_score = excluded.quality_score,
  sample_kind = excluded.sample_kind,
  feedback_family = excluded.feedback_family,
  updated_at = excluded.updated_at;

commit;
