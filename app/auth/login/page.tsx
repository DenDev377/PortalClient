import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-md p-8 border rounded-xl shadow-sm bg-white">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">Login</h1>
        <p className="text-sm text-center text-gray-500 mb-8">Masuk ke akun Anda</p>
        
        <form className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="email@example.com" 
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="********" 
            />
          </div>
          
          <Link href="/dashboard" className="w-full bg-blue-600 text-white text-center rounded-md py-2.5 mt-4 hover:bg-blue-700 transition-colors font-medium">
            Masuk
          </Link>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-center text-sm text-gray-600">
            Belum punya akun? <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
          </p>
          <p className="mt-3 text-center text-sm text-gray-500">
            <Link href="/" className="hover:underline">Kembali ke Beranda</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
