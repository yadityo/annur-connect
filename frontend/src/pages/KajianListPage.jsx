import React, { useEffect, useState } from 'react';
import KajianCard from '../components/KajianCard';

export default function KajianListPage({ navigate }) {
    const [kajianList, setKajianList] = useState([]);
    const [search, setSearch] = useState('');
    useEffect(() => {
        fetch('http://localhost:5000/api/kajian')
            .then(res => res.json())
            .then(data => setKajianList(Array.isArray(data) ? data : []));
    }, []);
    const filteredKajian = kajianList.filter(k => k.judul.toLowerCase().includes(search.toLowerCase()));
    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Jadwal Kajian</h1>
            <div className="mb-6">
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kajian berdasarkan judul..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredKajian.map(kajian => <KajianCard key={kajian._id} kajian={kajian} navigate={navigate} />)}
            </div>
        </>
    );
}
