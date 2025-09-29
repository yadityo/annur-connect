import React, { useMemo } from 'react';
import { ALL_KAJIAN } from '../data';

export default function KajianDetailPage({ kajianId, currentUser, navigate, userRegisteredIds, registerKajian, unregisterKajian }) {
    const selectedKajian = useMemo(() => ALL_KAJIAN.find(k => k.id === kajianId), [kajianId]);
    const isUserRegistered = userRegisteredIds.includes(kajianId);

    if (!selectedKajian) return <p>Kajian tidak ditemukan.</p>;

    return (
        <>
            <button onClick={() => navigate('kajian')} className="flex items-center text-slate-600 hover:text-emerald-600 mb-6 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Kembali ke Daftar Kajian
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <div className="uppercase tracking-wide text-sm text-emerald-500 font-semibold">{selectedKajian.kategori}</div>
                <h1 className="text-4xl font-bold text-slate-900 mt-2">{selectedKajian.judul}</h1>
                <p className="text-xl text-slate-600 mt-2">{selectedKajian.ustadz}</p>
                <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8 text-slate-700">
                    <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg> <span>{selectedKajian.tanggal}</span></div>
                    <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg> <span>{selectedKajian.waktu}</span></div>
                    <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> <span>Ruang Utama, Masjid Al-Hikmah</span></div>
                </div>
                <div className="prose max-w-none mt-8 text-slate-600" dangerouslySetInnerHTML={{ __html: selectedKajian.deskripsi }}></div>
                <div className="mt-10 pt-6 border-t border-slate-200">
                    {!currentUser ? (
                        <p className="text-center text-slate-500">Silakan <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="text-emerald-600 font-semibold hover:underline">login</a> untuk mendaftar kajian ini.</p>
                    ) : (
                        <>
                            {!isUserRegistered ? (
                                <button onClick={() => registerKajian(kajianId)} className="w-full sm:w-auto bg-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Daftar Acara</button>
                            ) : (
                                <button onClick={() => unregisterKajian(kajianId)} className="w-full sm:w-auto bg-red-100 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Batalkan Pendaftaran</button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

