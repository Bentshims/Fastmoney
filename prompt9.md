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
