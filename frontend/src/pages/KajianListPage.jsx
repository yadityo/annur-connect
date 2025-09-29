import React from 'react';
import { ALL_KAJIAN } from '../data';
import KajianCard from '../components/KajianCard';

export default function KajianListPage({ navigate }) {
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Jadwal Kajian</h1>
            <div className="mb-6">
                <input type="text" placeholder="Cari kajian berdasarkan judul..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ALL_KAJIAN.map(kajian => <KajianCard key={kajian.id} kajian={kajian} navigate={navigate} />)}
            </div>
        </>
    );
}

