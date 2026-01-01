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
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Package, ArrowUpDown } from 'lucide-react';

const productSchema = z.object({
    name: z.string().min(2, 'Nom requis'),
    price: z.coerce.number().min(0, 'Prix positif requis'),
    stock: z.coerce.number().int().min(0, 'Stock positif requis'),
    category: z.string().optional(),
    type: z.enum(['PRODUIT', 'ARTICLE_PRESSING']),
    pressingType: z.string().optional(),
    processingTime: z.coerce.number().optional(),
}).refine((data) => {
    if (data.type === 'ARTICLE_PRESSING') {
        return !!data.pressingType && data.processingTime !== undefined;
    }
    return true;
}, {
    message: "Type et temps de traitement requis pour pressing",
    path: ["pressingType"]
});


// Schema for Stock Adjustment
const adjustStockSchema = z.object({
    quantity: z.coerce.number().int(), // can be negative
    reason: z.string().min(3, 'Raison requise'),
});

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAdjustOpen, setIsAdjustOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const createForm = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            price: 0,
            stock: 0,
            category: '',
            type: 'PRODUIT',
            pressingType: '',
            processingTime: 48,
        },
    });

    const adjustForm = useForm<z.infer<typeof adjustStockSchema>>({
        resolver: zodResolver(adjustStockSchema),
        defaultValues: {
            quantity: 0,
            reason: '',
        },
    });

    const productType = createForm.watch('type');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onCreateSubmit = async (values: z.infer<typeof productSchema>) => {
        try {
            await api.post('/products', values);
            setIsCreateOpen(false);
            createForm.reset();
            fetchProducts();
        } catch (error) {
            console.error("Create failed", error);
        }
    };

    const onAdjustSubmit = async (values: z.infer<typeof adjustStockSchema>) => {
        if (!selectedProduct) return;
        try {
            await api.post(`/products/${selectedProduct.id}/adjust-stock`, values);
            setIsAdjustOpen(false);
            adjustForm.reset();
            setSelectedProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Adjust failed", error);
        }
    };

    const openAdjustDialog = (product: any) => {
        setSelectedProduct(product);
        setIsAdjustOpen(true);
        adjustForm.reset({ quantity: 0, reason: '' });
    };

    if (isLoading) return <div className="p-8">Chargement...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Nouveau produit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Nouveau produit</DialogTitle>
                            <DialogDescription>Ajouter un article au stock.</DialogDescription>
                        </DialogHeader>
                        <Form {...createForm}>
                            <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={createForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl><Input placeholder="Coca Cola 33cl" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prix</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="stock"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Stock Initial</FormLabel>
                                                <FormControl><Input type="number" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PRODUIT">Produit Standart</SelectItem>
                                                        <SelectItem value="ARTICLE_PRESSING">Article Pressing</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Catégorie (Optionnel)</FormLabel>
                                                <FormControl><Input placeholder="Boissons" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {productType === 'ARTICLE_PRESSING' && (
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                                        <FormField
                                            control={createForm.control}
                                            name="pressingType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Type Pressing</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger><SelectValue placeholder="Selectionner" /></SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="CHEMISE">Chemise</SelectItem>
                                                            <SelectItem value="PANTALON">Pantalon</SelectItem>
                                                            <SelectItem value="VESTE">Veste</SelectItem>
                                                            <SelectItem value="MANTEAU">Manteau</SelectItem>
                                                            <SelectItem value="COUETTE">Couette</SelectItem>
                                                            <SelectItem value="AUTRE">Autre</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={createForm.control}
                                            name="processingTime"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Délai (Heures)</FormLabel>
                                                    <FormControl><Input type="number" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button type="submit" className="bg-emerald-600">Créer</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category || '-'}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${product.type === 'ARTICLE_PRESSING' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {product.type === 'ARTICLE_PRESSING' ? 'Pressing' : 'Magasin'}
                                    </span>
                                </TableCell>
                                <TableCell>{product.price} €</TableCell>
                                <TableCell className={product.stock < 10 ? "text-red-500 font-bold" : ""}>
                                    {product.stock}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" onClick={() => openAdjustDialog(product)}>
                                        <ArrowUpDown className="h-3 w-3 mr-1" /> Stock
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Adjust Stock Dialog */}
            <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajuster Stock: {selectedProduct?.name}</DialogTitle>
                    </DialogHeader>
                    <Form {...adjustForm}>
                        <form onSubmit={adjustForm.handleSubmit(onAdjustSubmit)} className="space-y-4">
                            <FormField
                                control={adjustForm.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantité à ajouter/retirer</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="ex: 5 ou -2" {...field} />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">Utilisez une valeur négative pour réduire le stock.</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={adjustForm.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Raison</FormLabel>
                                        <FormControl>
                                            <Input placeholder="ex: Réapprovisionnement, Perte..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Valider</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
