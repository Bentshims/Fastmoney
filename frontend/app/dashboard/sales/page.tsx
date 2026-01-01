'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SaleItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
        name: string;
    };
}

interface Sale {
    id: string;
    createdAt: string;
    totalAmount: number;
    paymentMethod: string;
    ticketCode: string | null;
    items: SaleItem[];
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [filterDate, setFilterDate] = useState('today');
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, [filterDate]);

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/sales?date=${filterDate}`);
            setSales(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Historique des Ventes</h1>
                <div className="w-[200px]">
                    <Select value={filterDate} onValueChange={setFilterDate}>
                        <SelectTrigger>
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Aujourd'hui</SelectItem>
                            <SelectItem value="yesterday">Hier</SelectItem>
                            <SelectItem value="last7days">7 derniers jours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date / Heure</TableHead>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Paiement</TableHead>
                            <TableHead>Nb Articles</TableHead>
                            <TableHead className="text-right">Montant Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Chargement...</TableCell>
                            </TableRow>
                        ) : sales.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-gray-500">Aucune vente trouvée.</TableCell>
                            </TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow
                                    key={sale.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedSale(sale)}
                                >
                                    <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        {sale.ticketCode ? (
                                            <Badge variant="outline" className="font-mono">{sale.ticketCode}</Badge>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                            {sale.paymentMethod}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{sale.items.length}</TableCell>
                                    <TableCell className="text-right font-bold text-emerald-600">
                                        {sale.totalAmount} €
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Sale Details Dialog */}
            <Dialog open={!!selectedSale} onOpenChange={(open) => !open && setSelectedSale(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Détails de la vente</DialogTitle>
                    </DialogHeader>
                    {selectedSale && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{new Date(selectedSale.createdAt).toLocaleString()}</span>
                                <span className="font-bold text-black">{selectedSale.ticketCode}</span>
                            </div>

                            <div className="border rounded-md divide-y">
                                {selectedSale.items.map((item) => (
                                    <div key={item.id} className="p-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm">{item.product.name}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x {item.unitPrice} €</p>
                                        </div>
                                        <p className="font-bold text-sm">
                                            {item.quantity * item.unitPrice} €
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center border-t pt-4">
                                <span className="font-bold">TOTAL</span>
                                <span className="font-bold text-xl text-emerald-600">{selectedSale.totalAmount} €</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
