import { redirect } from 'next/navigation';

export default function DashboardPage() {
    redirect('/pos'); // Redirect to POS by default for ease of use
    return null;
}
