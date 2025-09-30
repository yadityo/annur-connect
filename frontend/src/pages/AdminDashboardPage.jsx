import React, { useMemo, useEffect, useState } from 'react';
import { formatCurrency } from '../utils';

export default function AdminDashboardPage() {
    const [transaksi, setTransaksi] = useState([]);
    const [ustadzList, setUstadzList] = useState([]);
    const [jamaahCount, setJamaahCount] = useState(0);
    const [kajianCount, setKajianCount] = useState(0);
    const [kajianList, setKajianList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/transaksi')
            .then(res => res.json())
            .then(data => setTransaksi(Array.isArray(data) ? data : []))
            .catch(() => setTransaksi([]));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/ustadz')
            .then(res => res.json())
            .then(data => setUstadzList(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/user')
            .then(res => res.json())
            .then(data => setJamaahCount(Array.isArray(data) ? data.length : 0));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/kajian')
            .then(res => res.json())
            .then(data => {
                setKajianList(Array.isArray(data) ? data : []);
                setKajianCount(Array.isArray(data) ? data.length : 0);
            });
    }, []);

    // Ambil 3 kajian terdekat dari database
    const upcomingKajian = useMemo(() => {
        const now = new Date();
        // Filter hanya kajian yang tanggalnya valid dan >= hari ini
        return kajianList
            .filter(k => k.tanggal && !isNaN(new Date(k.tanggal)) && new Date(k.tanggal).setHours(0,0,0,0) >= now.setHours(0,0,0,0))
            .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
            .slice(0, 3);
    }, [kajianList]);
    // Ambil 4 transaksi terbaru
    const recentTransactions = useMemo(() => transaksi.slice(0, 4), [transaksi]);

    // Proses data transaksi untuk grafik mingguan
    const weeklyData = useMemo(() => {
        const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
        const now = new Date();
        // Cari tanggal Senin minggu ini (lokal)
        const monday = new Date(now);
        const dayOfWeek = monday.getDay() === 0 ? 7 : monday.getDay(); // Minggu=0, jadi ubah ke 7
        monday.setDate(now.getDate() - (dayOfWeek - 1));
        monday.setHours(0,0,0,0);
        // Buat array data per hari
        const result = days.map((day, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            date.setHours(0,0,0,0);
            return {
                day,
                pemasukan: 0,
                pengeluaran: 0,
                date: date
            };
        });
        // Kelompokkan transaksi ke hari yang sesuai
        transaksi.forEach(trx => {
            if (!trx.tanggal) return;
            const trxDate = new Date(trx.tanggal);
            trxDate.setHours(0,0,0,0);
            result.forEach(item => {
                if (trxDate.getTime() === item.date.getTime()) {
                    item.pemasukan += Number(trx.pemasukan || 0);
                    item.pengeluaran += Number(trx.pengeluaran || 0);
                }
            });
        });
        return result;
    }, [transaksi]);
    // Cari nilai maksimum untuk chart
    const maxChartValue = useMemo(() => {
        return Math.max(...weeklyData.map(d => Math.max(d.pemasukan, d.pengeluaran)), 1);
    }, [weeklyData]);

    return (
        <>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Kajian</p><p className="text-3xl font-bold text-slate-800">{kajianCount}</p></div><div className="bg-emerald-100 text-emerald-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Ustadz</p><p className="text-3xl font-bold text-slate-800">{ustadzList.length}</p></div><div className="bg-blue-100 text-blue-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Jamaah</p><p className="text-3xl font-bold text-slate-800">{jamaahCount}</p></div><div className="bg-indigo-100 text-indigo-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Transaksi</p><p className="text-3xl font-bold text-slate-800">{transaksi.length}</p></div><div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div></div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Grafik Keuangan Pekan Ini (Rp)</h3>
                        <div className="flex justify-between items-end h-64 space-x-2">
                            {weeklyData.map(data => (
                                <div key={data.day} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-1/2 flex items-end h-full">
                                            <div
                                                className="w-1/2 bg-emerald-300 rounded-t-md hover:bg-emerald-400"
                                                style={{ height: `${(data.pemasukan / maxChartValue) * 100}%` }}
                                                title={`Pemasukan: ${formatCurrency(data.pemasukan)}`}
                                            ></div>
                                            <div
                                                className="w-1/2 bg-red-300 rounded-t-md hover:bg-red-400"
                                                style={{ height: `${(data.pengeluaran / maxChartValue) * 100}%` }}
                                                title={`Pengeluaran: ${formatCurrency(data.pengeluaran)}`}
                                            ></div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500 mt-2">{data.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                            <div className="flex items-center"><div className="w-3 h-3 bg-emerald-300 rounded-sm mr-2"></div><span>Pemasukan</span></div>
                            <div className="flex items-center"><div className="w-3 h-3 bg-red-300 rounded-sm mr-2"></div><span>Pengeluaran</span></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Kajian Akan Datang</h3>
                        <ul className="space-y-4">
                            {upcomingKajian.map(kajian => (
                                <li key={kajian._id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <p className="font-semibold text-slate-700">{kajian.judul}</p>
                                    <p className="text-sm text-slate-500">{kajian.ustadz?.nama || '-'} - {kajian.tanggal ? new Date(kajian.tanggal).toLocaleString('id-ID', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }) : '-'}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Keuangan Terbaru</h3>
                        <ul className="space-y-3">
                            {recentTransactions.map(trx => (
                                <li key={trx._id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-slate-700">{trx.keterangan}</p>
                                        <p className="text-xs text-slate-400">{trx.tanggal ? new Date(trx.tanggal).toLocaleString() : '-'}</p>
                                    </div>
                                    {trx.pemasukan ? (
                                        <span className="font-semibold text-green-600">+{formatCurrency(trx.pemasukan)}</span>
                                    ) : (
                                        <span className="font-semibold text-red-600">-{formatCurrency(trx.pengeluaran)}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
