import React, { useState } from 'react';

export default function LoginPage({ navigate, login }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                setMessage('Login berhasil!');
                if (typeof login === 'function') {
                    login(data.user);
                }
            } else {
                setMessage(data.error || 'Login gagal.');
            }
        } catch (err) {
            setMessage('Terjadi kesalahan jaringan.');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-emerald-600">Login</h1>
                        <p className="text-slate-500">Masuk untuk mengakses fitur jamaah.</p>
                        <p className="text-xs text-slate-400 mt-2">(Untuk DKM, gunakan email: admin@dkm.com)</p>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <button type="submit" className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2" disabled={loading}>{loading ? 'Memproses...' : 'Login'}</button>
                        </div>
                        {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
                        <p className="text-center text-sm text-slate-500 mt-6">Belum punya akun? <a onClick={(e) => { e.preventDefault(); navigate('register'); }} href="#" className="font-medium text-emerald-600 hover:underline">Register di sini</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
