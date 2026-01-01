Contexte : Backend /employees opérationnel.

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

Produis le code complet de la page, des composants et des routes API Next.
