export class SaleItem {
  name: string;
  quantity: number;
  price: number;
}

export class Sale {
  id: string;
  date: Date;
  totalAmount: number;
  paymentMode: 'CASH' | 'CARD' | 'MOBILE_MONEY';
  itemCount: number;
  ticketCode?: string;
  items: SaleItem[];
}
