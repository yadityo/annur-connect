import React from 'react';

export default function KajianCard({ kajian, navigate }) {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="p-6">
                <div className="uppercase tracking-wide text-sm text-emerald-500 font-semibold">{kajian.kategori}</div>
                <a onClick={(e) => { e.preventDefault(); navigate('kajian_detail', kajian.id); }} href="#" className="block mt-1 text-xl leading-tight font-bold text-slate-900 hover:underline">{kajian.judul}</a>
                <p className="mt-2 text-slate-500">{kajian.ustadz}</p>
                <div className="mt-4 flex items-center text-sm text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                    <span>{kajian.tanggal} - {kajian.waktu}</span>
                </div>
                <button onClick={() => navigate('kajian_detail', kajian.id)} className="mt-6 w-full bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    Lihat Detail
                </button>
            </div>
        </div>
    );
}

