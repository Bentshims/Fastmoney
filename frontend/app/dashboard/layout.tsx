'use client';

import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Store, Users, ShoppingCart, Banknote, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, business, logout, loading } = useAuth();
    const pathname = usePathname();

    if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;

    const navItems = [
        { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Produits', href: '/products', icon: Store },
        { name: 'Employés', href: '/employees', icon: Users, role: 'OWNER' },
        { name: 'Caisse (POS)', href: '/pos', icon: ShoppingCart },
        { name: 'Ventes', href: '/sales', icon: Banknote },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-tight text-white">FastMoney</h1>
                    <p className="text-sm text-gray-400 mt-1">{business?.name} ({business?.type})</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        // Filter by role if specified
                        if (item.role && user?.role !== item.role) return null;

                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-emerald-600 text-white"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold">
                            {user?.email[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:bg-gray-900 hover:text-red-300"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Déconnexion
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-white">
                <header className="md:hidden bg-black text-white p-4 flex justify-between items-center shadow-md">
                    <div className="font-bold">FastMoney</div>
                    {/* Mobile Sheet/Menu could go here, keeping simple for now */}
                    <Button size="sm" variant="ghost" onClick={logout}><LogOut className="h-4 w-4" /></Button>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
