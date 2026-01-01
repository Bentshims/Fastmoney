Contexte : Auth frontend fonctionnelle, token dispo. Backend /products opérationnel.

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

Produis tout le code : page, composants, hooks, appels API, formulaires.
