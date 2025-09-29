import React, { useState } from 'react';

export default function RegisterPage({ navigate }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        if (password !== passwordConf) {
            setMessage('Konfirmasi password tidak cocok.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Registrasi berhasil!');
                setName(''); setEmail(''); setPassword(''); setPasswordConf('');
                navigate('login');
            } else {
                setMessage(data.error || 'Registrasi gagal.');
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
                        <h1 className="text-3xl font-bold text-emerald-600">Register</h1>
                        <p className="text-slate-500">Buat akun baru untuk mendaftar kajian.</p>
                    </div>
                    <form onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <div><label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label><input type="text" id="nama" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Nama Anda" value={name} onChange={e => setName(e.target.value)} required /></div>
                            <div><label htmlFor="email_reg" className="block text-sm font-medium text-slate-700">Email</label><input type="email" id="email_reg" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="nama@email.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                            <div><label htmlFor="password_reg" className="block text-sm font-medium text-slate-700">Password</label><input type="password" id="password_reg" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                            <div><label htmlFor="password_conf" className="block text-sm font-medium text-slate-700">Konfirmasi Password</label><input type="password" id="password_conf" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="••••••••" value={passwordConf} onChange={e => setPasswordConf(e.target.value)} required /></div>
                        </div>
                        <div className="mt-6"><button type="submit" className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors" disabled={loading}>{loading ? 'Mendaftar...' : 'Register'}</button></div>
                        {message && <p className="text-center text-sm text-red-500 mt-4">{message}</p>}
                        <p className="text-center text-sm text-slate-500 mt-6">Sudah punya akun? <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="font-medium text-emerald-600 hover:underline">Login di sini</a></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
