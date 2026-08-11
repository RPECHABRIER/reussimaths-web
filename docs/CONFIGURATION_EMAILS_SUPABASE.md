# E-mails d’authentification RéussiMaths

## Réglages obligatoires

Dans Supabase, ouvrir **Authentication → Sign In / Providers → Email** :

- activer le fournisseur Email ;
- activer **Confirm email** afin qu’un compte ne puisse pas se connecter avant validation de son adresse ;
- conserver la protection contre les mots de passe compromis si elle est disponible sur l’offre utilisée.

Dans **Authentication → URL Configuration** :

- **Site URL** : `https://reussimaths-web.vercel.app` (à remplacer par le domaine définitif lorsqu’il existe) ;
- **Redirect URLs** : ajouter `https://reussimaths-web.vercel.app/**` ;
- ajouter les URL de prévisualisation Vercel uniquement pendant les tests, puis les retirer.

## Confirmation d’inscription

Dans **Authentication → Email Templates → Confirm signup** :

**Objet**

```text
Confirme ton adresse e-mail — RéussiMaths
```

**Corps HTML**

```html
<div style="margin:0;padding:32px 16px;background:#f6f7fb;font-family:Arial,sans-serif;color:#172443">
  <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e7e9f0">
    <p style="margin:0 0 8px;color:#d99a22;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">RéussiMaths</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2">Confirme ton adresse e-mail</h1>
    <p style="margin:0 0 24px;color:#667085;line-height:1.6">Un dernier clic suffit pour sécuriser ton compte et commencer ton parcours personnalisé.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#e4aa35;color:#172443;text-decoration:none;font-weight:700">Confirmer mon adresse</a>
    <p style="margin:24px 0 0;color:#98a2b3;font-size:12px;line-height:1.5">Si tu n’as pas créé de compte RéussiMaths, tu peux ignorer cet e-mail.</p>
  </div>
</div>
```

## Réinitialisation du mot de passe

Dans **Authentication → Email Templates → Reset password** :

**Objet**

```text
Choisis un nouveau mot de passe — RéussiMaths
```

**Corps HTML**

```html
<div style="margin:0;padding:32px 16px;background:#f6f7fb;font-family:Arial,sans-serif;color:#172443">
  <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:24px;padding:32px;border:1px solid #e7e9f0">
    <p style="margin:0 0 8px;color:#d99a22;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">RéussiMaths</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2">Réinitialise ton mot de passe</h1>
    <p style="margin:0 0 24px;color:#667085;line-height:1.6">Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est personnel et temporaire.</p>
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:#e4aa35;color:#172443;text-decoration:none;font-weight:700">Choisir un nouveau mot de passe</a>
    <p style="margin:24px 0 0;color:#98a2b3;font-size:12px;line-height:1.5">Si tu n’as pas demandé cette modification, ignore cet e-mail : ton mot de passe actuel reste inchangé.</p>
  </div>
</div>
```

Ne pas activer le suivi des clics chez un éventuel fournisseur SMTP : la réécriture des liens peut empêcher la confirmation Supabase de fonctionner.
