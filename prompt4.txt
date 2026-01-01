Contexte : même projet. Les modules Business, Employees, Products existent.

OBJECTIF :
Créer le module Sales, cœur du POS.

SCHEMA PRISMA À AJOUTER :

model Sale {
  id           String     @id @default(cuid())
  totalAmount  Float
  paymentMethod String    // "CASH" | "MOBILE_MONEY" | "CARTE" | "CREDIT"
  status       String     @default("PAYEE") // simple pour V1
  ticketCode   String?
  businessId   String
  business     Business   @relation(fields: [businessId], references: [id])
  employeeId   String?
  employee     Employee?  @relation(fields: [employeeId], references: [id])
  createdAt    DateTime   @default(now())
  items        SaleItem[]
}

model SaleItem {
  id        String  @id @default(cuid())
  quantity  Int
  unitPrice Float
  productId String
  product   Product @relation(fields: [productId], references: [id])
  saleId    String
  sale      Sale    @relation(fields: [saleId], references: [id])
}

TÂCHES :

1. Créer SalesModule, SalesService, SalesController.

2. DTO :
   - CreateSaleDto :
     - items: { productId: string; quantity: number }[]
     - paymentMethod: "CASH" | "MOBILE_MONEY" | "CARTE" | "CREDIT"
     - employeeId?: string

3. Endpoint principal :
   - POST /sales
     - Récupère businessId via JWT
     - Vérifie que tous les productId appartiennent au business
     - Calcule totalAmount (depuis prix produits actuels)
     - Décrémente le stock de chaque produit
     - Génère ticketCode si business.type = "PRESSING" (ex: "PR-"+shortid)
     - Crée Sale + SaleItem[]
     - Retourne { sale, items }

4. Endpoints secondaires :
   - GET /sales?date=YYYY-MM-DD → liste des ventes du jour
   - GET /sales/:id → détail d’une vente

Sécurité : tout filtré par businessId, guard JWT obligatoire.
