Contexte : Backend /sales avec GET /sales en place.

OBJECTIF :
Créer app/(dashboard)/sales/page.tsx pour voir les ventes.

TÂCHES :

1. Table des ventes :
   - Colonnes : Date, Montant total, Mode paiement, Nb articles, ticketCode (si présent)
   - GET /api/sales?date=today (simple pour V1)

2. Filtre simple :
   - Sélecteur rapide : "Aujourd’hui", "Hier", "7 derniers jours"

3. Détail vente :
   - Clic sur une ligne → Dialog qui affiche les SaleItems (produit, quantité, prix)

Produis le code de la page, des composants et des routes API Next.


## Prompt ##

On commence le frontend : je veux des interfaces moderne et professionel et propre . les prompts : prompt5: **Contexte : Next.js App Router, shadcn/ui, RHF, Zod déjà installés. Backend NestJS avec modules Auth + Business.

OBJECTIF :
Mettre en place :
- Layout protégé (dashboard)
- Pages /auth/login et /auth/signup

TÂCHES :

1. Créer un layout "app/(dashboard)/layout.tsx" :
   - Sidebar à gauche (shadcn) avec liens : Dashboard, Produits, Employés, POS, Ventes
   - Header simple avec nom du business et bouton Logout
   - Le layout doit protéger les routes : si pas de token → redirect vers /auth/login

2. Pages d’auth :
   - app/(auth)/login/page.tsx :
     - Form RHF + Zod : email, password
     - POST vers /api/auth/login (route Next qui proxy vers Nest)
     - Stocker accessToken (cookie httpOnly ou localStorage simple pour MVP)
     - Rediriger vers /dashboard
   - app/(auth)/signup/page.tsx :
     - Form multi-step simple :
       - Step 1 : email, password
       - Step 2 : businessName, select businessType ("MAGASIN" | "PRESSING")
     - Appel /api/auth/register
     - Stocker token + rediriger vers /dashboard

3. Créer un hook useAuth() :
   - Fournir user + business + isAuthenticated
   - Charger depuis token/JWT ou endpoint /me

4. Utiliser shadcn/ui :
   - Card, Input, Button, Form, Select.

Produis le code complet des pages, layout, hooks et routes API Next nécessaires.** . prompt6:**Contexte : Auth frontend fonctionnelle, token dispo. Backend /products opérationnel.

OBJECTIF :
Créer la gestion des produits dans le dashboard.

TÂCHES :

1. Page app/(dashboard)/products/page.tsx :
   - Récupérer la liste des produits via fetch /api/products (proxy Nest)
   - Afficher un tableau (Table shadcn) avec colonnes :
     - Nom, Prix, Stock, Type, Catégorie, Actions
   - Bouton "Nouveau produit" qui ouvre un Dialog shadcn avec Form RHF + Zod.

2. Formulaire création produit :
   - Champs :
     - name, price, stock, category
     - type (PRODUIT / ARTICLE_PRESSING)
     - Si type = ARTICLE_PRESSING → champs pressingType + processingTime
   - Validation Zod
   - POST /api/products
   - Après succès : fermer dialog + refetch liste

3. Action "Ajuster stock" :
   - Bouton dans chaque ligne → ouvre Dialog "Ajuster stock"
   - Form : { quantity (number, + ou -), reason (texte) }
   - POST /api/products/:id/adjust-stock
   - Refetch liste

4. UX :
   - Loader pendant le fetch
   - Toast de succès/erreur (shadcn toast)

Produis tout le code : page, composants, hooks, appels API, formulaires.** . prompt7:**Contexte : Backend /employees opérationnel.

OBJECTIF :
Créer l’écran de gestion des employés.

TÂCHES :

1. Page app/(dashboard)/employees/page.tsx :
   - Tableau des employés :
     - Nom, Email, Rôle, Date création, Actions
   - Bouton "Nouvel employé" → Dialog Form :
     - name, email, password, role (Select CAISSIER / GERANT)

2. API :
   - GET /api/employees → proxy vers Nest
   - POST /api/employees
   - DELETE /api/employees/:id

3. Séparation rôles :
   - Cette page ne doit être visible que pour le OWNER
   - Si user.role !== "OWNER" → rediriger vers /dashboard

4. Utiliser shadcn/ui pour la table, le dialog, les boutons.

Produis le code complet de la page, des composants et des routes API Next.** . prompt8:**Contexte : Backend /products et /sales en place. On veut un écran de caisse simple.

OBJECTIF :
Créer app/(dashboard)/pos/page.tsx : interface de vente rapide.

LAYOUT :

- Desktop :
  - Gauche : 3/4 largeur → grille de produits cliquables
  - Droite : 1/4 largeur → panier + total + mode de paiement + bouton "Valider"

FONCTIONNALITÉS :

1. Chargement produits :
   - GET /api/products
   - Filtre par recherche texte (nom de produit)

2. Interaction :
   - Clic sur un produit → ajout au panier (ou +1 si déjà présent)
   - Dans le panier :
     - Afficher nom, quantité, sous-total
     - Possibilité d’augmenter/diminuer quantité
     - Bouton pour retirer un article

3. Mode de paiement :
   - Select shadcn avec options :
     - CASH
     - MOBILE_MONEY
     - CARTE
     - CREDIT

4. Validation de la vente :
   - Bouton "Valider la vente"
   - Appel POST /api/sales avec :
     - items: [{ productId, quantity }]
     - paymentMethod
   - Afficher toast succès et vider le panier
   - Option : afficher un petit résumé "Ticket" (ticketCode si pressing)

5. Responsive :
   - Sur mobile, le panier doit passer en bas (stack vertical).

Produis le code complet de la page POS : state panier, fetch produits, UI shadcn, appels API, gestion des erreurs.** . prompt9:**Contexte : Backend /sales avec GET /sales en place.

OBJECTIF :
Créer app/(dashboard)/sales/page.tsx pour voir les ventes.

TÂCHES :

1. Table des ventes :
   - Colonnes : Date, Montant total, Mode paiement, Nb articles, ticketCode (si présent)
   - GET /api/sales?date=today (simple pour V1)

2. Filtre simple :
   - Sélecteur rapide : "Aujourd’hui", "Hier", "7 derniers jours"

3. Détail vente :
   - Clic sur une ligne → Dialog qui affiche les SaleItems (produit, quantité, prix)

Produis le code de la page, des composants et des routes API Next.** . le couleur principal sont le Noir ( couleur primaire ), le Blanc (pour les textes) et le Emerald ( pour les boutons,...)