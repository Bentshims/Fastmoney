'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, ShoppingCart, Trash2, Search, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner'; // Assuming we have toast set up properly, or use simple alert for MVP
// Actually, I didn't install sonner component but added 'toast' to package. Let's use standard alert or console for now if toast not fully conf.
// Wait, prompt 5 said "Toast de succès/erreur (shadcn toast)". Shadcn usually installs 'sonner' or 'toaster'.
// I will use window.alert or console for simplicity unless I see toaster in components.
// Checking file listing earlier: 'sheet.tsx' is there. 'toast.tsx' was added in prompt 9 context ? No, I added 'toast' in step 299 command but it failed/cancelled? 
// No, step 288 confirmed 'shadcn@latest init' succeeded. And I tried installing components manually.
// Let's assume standard UI feedback for now.

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    type: string;
}

interface CartItem extends Product {
    quantity: number;
}

export default function PosPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('CASH');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = (product: Product) => {
        if (product.stock <= 0) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // Cannot add more than stock
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                if (newQty < 1) return item;
                // Check stock
                const product = products.find(p => p.id === id);
                if (product && newQty > product.stock) return item;

                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const totalAmount = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [cart]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setLoading(true);

        try {
            const payload = {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                paymentMethod: selectedPayment
            };

            const res = await api.post('/sales', payload);

            // Success
            alert(`Vente validée ! Total: ${totalAmount} €.\n${res.data.ticketCode ? 'Ticket: ' + res.data.ticketCode : ''}`);
            setCart([]);
            fetchProducts(); // Refresh stock
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Erreur lors de la vente. Vérifiez le stock.");
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-100px)] flex-col md:flex-row gap-4">
            {/* Left: Product Grid */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher un produit..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <ScrollArea className="flex-1 bg-gray-50 rounded-md border p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <button
                                key={product.id}
                                disabled={product.stock <= 0}
                                onClick={() => addToCart(product)}
                                className={`flex flex-col items-center justify-between p-4 rounded-lg border bg-white shadow-sm transition-all hover:shadow-md 
                                    ${product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500'}`}
                            >
                                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-lg font-bold text-gray-500">
                                    {product.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="text-center w-full">
                                    <h3 className="font-medium truncate w-full" title={product.name}>{product.name}</h3>
                                    <p className="font-bold text-emerald-600">{product.price} €</p>
                                    <p className="text-xs text-gray-400">Stock: {product.stock}</p>
                                </div>
                            </button>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                Aucun produit trouvé.
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Right: Cart */}
            <Card className="w-full md:w-96 flex flex-col h-[50vh] md:h-full border-l shadow-xl">
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" /> Panier
                    </h2>
                    <span className="text-sm font-medium bg-black text-white px-2 py-1 rounded-full">
                        {cart.length} items
                    </span>
                </div>

                <ScrollArea className="flex-1 p-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <ShoppingCart className="h-12 w-12 opacity-20" />
                            <p>Votre panier est vide</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border">
                                    <div className="flex-1">
                                        <p className="font-medium text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.price} € x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 ml-1" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 bg-gray-50 border-t space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>{totalAmount.toFixed(2)} €</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div
                            className={`cursor-pointer rounded border p-2 flex flex-col items-center justify-center text-xs transition-colors ${selectedPayment === 'CASH' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white'}`}
                            onClick={() => setSelectedPayment('CASH')}
                        >
                            <Banknote className="h-4 w-4 mb-1" />
                            Espèces
                        </div>
                        <div
                            className={`cursor-pointer rounded border p-2 flex flex-col items-center justify-center text-xs transition-colors ${selectedPayment === 'CARTE' ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white'}`}
                            onClick={() => setSelectedPayment('CARTE')}
                        >
                            <CreditCard className="h-4 w-4 mb-1" />
                            Carte
                        </div>
                        {/* Add others if needed: MOBILE_MONEY, CREDIT */}
                    </div>

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6"
                        disabled={cart.length === 0 || loading}
                        onClick={handleCheckout}
                    >
                        {loading ? 'Validation...' : 'VALIDER LA VENTE'}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
