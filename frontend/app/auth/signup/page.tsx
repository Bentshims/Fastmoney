'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const formSchema = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string().min(6, { message: 'Min 6 caractères' }),
    businessName: z.string().min(2, { message: 'Nom du business requis' }),
    businessType: z.enum(['MAGASIN', 'PRESSING'], { required_error: 'Type requis' }),
});

export default function SignupPage() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            businessName: '',
            businessType: 'MAGASIN',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        setError(null);
        try {
            // 1. Register
            await axios.post('http://localhost:3000/api/auth/register', values);

            // 2. Login automatically
            const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
                email: values.email,
                password: values.password
            });

            const { access_token, user } = loginRes.data;
            login(access_token, user, user.business);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    }

    const nextStep = async () => {
        const isValid = await form.trigger(['email', 'password']);
        if (isValid) setStep(2);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm border-0 shadow-lg sm:border sm:border-gray-200">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
                    <CardDescription className="text-center">
                        {step === 1 ? 'Etape 1/2 : Identifiants' : 'Etape 2/2 : Votre Business'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* STEP 1 */}
                            {step === 1 && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="exemple@email.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mot de passe</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="button" onClick={nextStep} className="w-full bg-black hover:bg-gray-800">
                                        Suivant
                                    </Button>
                                </>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="businessName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom du Business</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ma Boutique" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="businessType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type d'activité</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selectionner un type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="MAGASIN">Magasin / Boutique</SelectItem>
                                                        <SelectItem value="PRESSING">Pressing / Blanchisserie</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {error && <div className="text-sm text-red-500 text-center">{error}</div>}

                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3">
                                            Retour
                                        </Button>
                                        <Button type="submit" className="w-2/3 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
                                            {loading ? 'Création...' : 'Terminer l\'inscription'}
                                        </Button>
                                    </div>
                                </>
                            )}

                            <div className="mt-4 text-center text-sm">
                                Déjà un compte ?{' '}
                                <Link href="/auth/login" className="underline hover:text-emerald-600">
                                    Se connecter
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
