Contexte : Backend /products et /sales en place. On veut un écran de caisse simple.

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

Produis le code complet de la page POS : state panier, fetch produits, UI shadcn, appels API, gestion des erreurs.
