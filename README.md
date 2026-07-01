# MEZZ' Shop — maillot GOUSSDAR personnalisable

Template e-commerce mono-produit pour le maillot **MEZZ' 190** (édition limitée).
Construit en **Next.js 15 (App Router) + React 19 + TypeScript + Three.js (react-three-fiber)**.

## Fonctionnalités

- **Viewer 3D du maillot** (react-three-fiber) avec bascule **Recto / Verso** et zoom.
- **Floquage personnalisable en direct** : le client saisit son **nom + numéro**, rendus
  en temps réel sur le dos du maillot via `CanvasTexture` (Three.js).
- **Galerie style Nike** : grande image + miniatures cliquables (recto, verso, détails).
- **Sélecteur de taille** (S → XXL) et **quantité**.
- **Formulaire de commande** (prénom, nom, email, téléphone, adresse) validé avec
  `react-hook-form` + `zod`, envoyé à `/api/order`.
- Design **dark / rouge / grunge** fidèle à l'identité du maillot, **responsive**.

## Démarrer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000

## Structure

```
src/
  app/
    layout.tsx          # fonts (next/font) + metadata
    page.tsx            # assemblage de la landing
    globals.css         # design tokens + grunge + @font-face Road Rage
    api/order/route.ts  # endpoint de commande (à brancher : email/DB/Stripe)
  components/
    Navbar, ProductPanel, Gallery, FeatureBar, OrderForm, Footer
    FloquageControls, SizeSelector, QuantityStepper
    jersey/
      JerseyViewer.tsx  # wrapper client + boutons Recto/Verso
      JerseyCanvas.tsx  # scène react-three-fiber
      jerseyTexture.ts  # compositing canvas du floquage (NOM + NUMÉRO)
  lib/
    product.ts          # données produit (à éditer pour un autre maillot)
    store.ts            # état configurateur (zustand)
    types.ts
public/
  jersey/               # images recto/verso + détails
  fonts/                # déposer Road Rage ici (voir fonts/README.txt)
```

## À faire pour la prod

- **Police** : déposer `RoadRage.woff2` dans `public/fonts/` (voir `fonts/README.txt`).
- **Commande** : dans `src/app/api/order/route.ts`, brancher l'envoi d'email
  (Resend/Nodemailer vers `Mezzshop951@gmail.com`), le stockage (DB) et/ou Stripe.
- **Floquage haute fidélité** : remplacer `public/jersey/back.png` par un **dos vierge**
  (sans "MEZZ' 190"). Le masque automatique pourra alors être retiré dans `jerseyTexture.ts`.
- **3D complète (optionnel)** : ajouter un vrai modèle `.glb` du maillot. Le code de
  floquage (`jerseyTexture.ts`) reste réutilisable tel quel sur le modèle 3D.
```
