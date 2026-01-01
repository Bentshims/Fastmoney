Contexte : Next.js App Router, shadcn/ui, RHF, Zod déjà installés. Backend NestJS avec modules Auth + Business.

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

Produis le code complet des pages, layout, hooks et routes API Next nécessaires.
