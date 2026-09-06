import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">


            {/* Main Content */}
            <main className="flex-1 p-8 w-full mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Selamat datang kembali!</h2>
                    <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas Anda hari ini.</p>
                </div>



            </main>
        </div>
    );
}
