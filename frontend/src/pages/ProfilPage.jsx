import React, { useMemo } from 'react';
import { ALL_KAJIAN } from '../data';

export default function ProfilPage({ navigate, currentUser, userRegisteredIds, unregisterKajian }) {
    const userRegisteredKajian = useMemo(() => ALL_KAJIAN.filter(k => userRegisteredIds.includes(k.id)), [userRegisteredIds]);

    if (!currentUser || currentUser.role !== 'jamaah') {
        return <p>Halaman tidak dapat diakses.</p>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <img src="https://placehold.co/128x128/E2E8F0/475569?text=U" alt="User Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
                        <p className="text-slate-500">{currentUser.email}</p>
                        <button className="mt-4 w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Edit Profil</button>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Kajian yang Saya Ikuti</h3>
                        <div className="space-y-4">
                            {userRegisteredKajian.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Anda belum mendaftar kajian apapun.</p>
                            ) : (
                                userRegisteredKajian.map(kajian => (
                                    <div key={kajian.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                        <div>
                                            <a onClick={(e) => { e.preventDefault(); navigate('kajian_detail', kajian.id); }} href="#" className="font-semibold text-slate-800 hover:text-emerald-600">{kajian.judul}</a>
                                            <p className="text-sm text-slate-500">{kajian.ustadz} - {kajian.tanggal}</p>
                                        </div>
                                        <button onClick={() => unregisterKajian(kajian.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Batalkan</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

