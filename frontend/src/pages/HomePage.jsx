import React, { useMemo, useEffect, useState } from 'react';
import Carousel from '../components/Carousel';
import KajianCard from '../components/KajianCard';
import { formatCurrency } from '../utils';

export default function HomePage({ navigate }) {
    // Transactions come from backend API
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/transaksi')
            .then(res => res.json())
            .then(data => setTransactions(Array.isArray(data) ? data : []))
            .catch(() => setTransactions([]));
    }, []);

    const totalPemasukan = useMemo(() => transactions.reduce((acc, trx) => acc + (Number(trx.pemasukan) || 0), 0), [transactions]);
    const totalPengeluaran = useMemo(() => transactions.reduce((acc, trx) => acc + (Number(trx.pengeluaran) || 0), 0), [transactions]);
    const saldoAkhir = totalPemasukan - totalPengeluaran;

    // State untuk jadwal sholat
    const [prayerTimes, setPrayerTimes] = useState(null);
    const [prayerDate, setPrayerDate] = useState('');
    useEffect(() => {
        // Ambil jadwal sholat dari backend agar tidak kena CORS
        fetch('http://localhost:5000/api/jadwal-sholat')
            .then(res => res.json())
            .then(data => {
                if (data && data.data && data.data.jadwal) {
                    setPrayerTimes({
                        Imsak: data.data.jadwal.imsak,
                        Subuh: data.data.jadwal.subuh,
                        Terbit: data.data.jadwal.terbit,
                        Dhuha: data.data.jadwal.dhuha,
                        Dzuhur: data.data.jadwal.dzuhur,
                        Ashar: data.data.jadwal.ashar,
                        Maghrib: data.data.jadwal.maghrib,
                        Isya: data.data.jadwal.isya,
                    });
                    setPrayerDate(data.data.jadwal.tanggal);
                }
            });
    }, []);

    const [upcomingKajian, setUpcomingKajian] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/kajian')
            .then(res => res.json())
            .then(data => setUpcomingKajian(Array.isArray(data) ? data.slice(0, 3) : []))
            .catch(() => setUpcomingKajian([]));
    }, []);

    return (
        <>
            <Carousel />

            {/* Info & Quote Section */}
            <section className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md">
                        <h3 className="text-2xl font-bold text-slate-800 mb-4">Jadwal Sholat Hari Ini</h3>
                        <p className="text-sm text-slate-500 mb-6">Untuk wilayah Bandung dan sekitarnya{prayerDate ? ` (${prayerDate})` : ''}</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            {prayerTimes ? (
                                Object.entries(prayerTimes).map(([name, time]) => (
                                    <div key={name} className="bg-slate-50 p-4 rounded-lg">
                                        <p className="font-semibold text-slate-700">{name}</p>
                                        <p className="text-2xl font-bold text-emerald-600 tracking-wider">{time}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 text-center text-slate-400">Memuat jadwal sholat...</div>
                            )}
                        </div>
                    </div>
                    <div className="bg-emerald-600 text-white p-8 rounded-2xl shadow-md flex flex-col justify-center items-center text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <blockquote className="text-lg italic">"Barangsiapa yang menempuh suatu jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan menuju surga."</blockquote>
                        <cite className="mt-4 not-italic font-semibold">(HR. Muslim)</cite>
                    </div>
                </div>
            </section>

            {/* Financial Summary */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Laporan Keuangan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-slate-500">Total Pemasukan</p>
                        <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalPemasukan)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-slate-500">Total Pengeluaran</p>
                        <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(totalPengeluaran)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <p className="text-slate-500">Saldo Kas Masjid</p>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{formatCurrency(saldoAkhir)}</p>
                    </div>
                </div>
            </section>

            {/* Kajian Section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6 text-center">Kajian Terdekat</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingKajian.map(kajian => <KajianCard key={kajian._id} kajian={kajian} navigate={navigate} />)}
                </div>
            </section>

            {/* Donation Section */}
            <section className="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
                <h2 className="text-3xl font-bold text-emerald-600 mb-2">Mari Berinfaq untuk Masjid</h2>
                <p className="max-w-2xl mx-auto text-slate-500 mb-8">Setiap donasi Anda sangat berarti untuk mendukung kegiatan dakwah dan operasional masjid.</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                    <div className="text-left">
                        <p className="font-semibold text-slate-800">Transfer Bank:</p>
                        <p className="text-slate-600">Bank Syariah Indonesia (BSI)</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-widest">7123456789</p>
                        <p className="text-slate-600">a.n. DKM Al-Hikmah</p>
                    </div>
                    <div className="font-bold text-slate-400">ATAU</div>
                    <div>
                        <img src="./src/assets/frame.png" alt="QRIS Code for Donation" className="w-32"/>
                    </div>
                </div>
            </section>
        </>
    );
}
