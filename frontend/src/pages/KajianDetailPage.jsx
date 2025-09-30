import React, { useEffect, useState } from 'react';

export default function KajianDetailPage({ kajianId, currentUser, navigate, userRegisteredIds = [], registerKajian, unregisterKajian }) {
    const [kajian, setKajian] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (kajianId) {
            setLoading(true);
            fetch(`http://localhost:5000/api/kajian/${kajianId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    return res.json();
                })
                .then(data => setKajian(data || null))
                .catch(() => setKajian(null))
                .finally(() => setLoading(false));
        }
    }, [kajianId]);
    // normalize comparison to strings and prefer kajian._id if available
    const isUserRegistered = Boolean(kajian && ((userRegisteredIds || []).map(String).includes(String(kajian._id || kajianId))));
    if (loading) return <p>Memuat kajian...</p>;
    if (!kajian) return <p>Kajian tidak ditemukan.</p>;
    return (
        <>
            <button onClick={() => navigate('kajian')} className="flex items-center text-slate-600 hover:text-emerald-600 mb-6 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Kembali ke Daftar Kajian
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="uppercase tracking-wide text-sm text-emerald-500 font-semibold">{kajian.kategori?.nama || '-'}</div>
                <h1 className="text-4xl font-bold text-slate-900 mt-2">{kajian.judul}</h1>
                <p className="text-xl text-slate-600 mt-2">{kajian.ustadz?.nama || '-'}</p>
                <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8 text-slate-700">
                    <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg> <span>{kajian.tanggal ? new Date(kajian.tanggal).toLocaleString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }) : '-'}</span></div>
                    <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> <span>Ruang Utama, Masjid Al-Hikmah</span></div>
                </div>
                <div className="prose max-w-none mt-8 text-slate-600">{kajian.deskripsi || '-'}</div>
                <div className="mt-10 pt-6 border-t border-slate-200">
                    {!currentUser ? (
                        <p className="text-center text-slate-500">Silakan <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="text-emerald-600 font-semibold hover:underline">login</a> untuk mendaftar kajian ini.</p>
                    ) : (
                        <>
                            {!isUserRegistered ? (
                                <button onClick={() => registerKajian(kajian._id)} className="w-full sm:w-auto bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Daftar Acara</button>
                            ) : (
                                <button onClick={() => unregisterKajian(kajian._id)} className="w-full sm:w-auto bg-red-100 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Batalkan Pendaftaran</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
