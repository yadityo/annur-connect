import React, { useMemo } from 'react';
import { TRANSACTIONS } from '../data';
import { formatCurrency } from '../utils';

export default function LaporanPage() {
    const totalPemasukan = useMemo(() => TRANSACTIONS.reduce((acc, trx) => acc + (trx.pemasukan || 0), 0), []);
    const totalPengeluaran = useMemo(() => TRANSACTIONS.reduce((acc, trx) => acc + (trx.pengeluaran || 0), 0), []);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Laporan Keuangan</h1>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Tanggal</th><th scope="col" className="px-6 py-3">Keterangan</th><th scope="col" className="px-6 py-3">Kategori</th><th scope="col" className="px-6 py-3 text-right">Pemasukan</th><th scope="col" className="px-6 py-3 text-right">Pengeluaran</th><th scope="col" className="px-6 py-3 text-center">Bukti</th>
                        </tr>
                        </thead>
                        <tbody>
                        {TRANSACTIONS.map(trx => (
                            <tr key={trx.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{trx.tanggal}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{trx.keterangan}</th>
                                <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${trx.kategori === 'Infaq' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{trx.kategori}</span></td>
                                <td className="px-6 py-4 text-right font-medium text-green-600">{trx.pemasukan ? formatCurrency(trx.pemasukan) : '-'}</td>
                                <td className="px-6 py-4 text-right font-medium text-red-600">{trx.pengeluaran ? formatCurrency(trx.pengeluaran) : '-'}</td>
                                <td className="px-6 py-4 text-center">{trx.bukti ? <a href="#" className="font-medium text-emerald-600 hover:underline">Lihat</a> : <span className="text-slate-400">-</span>}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="bg-slate-100">
                        <tr className="font-semibold text-slate-900">
                            <th scope="row" colSpan="3" className="px-6 py-3 text-base">Total Saldo</th>
                            <td className="px-6 py-3 text-right text-green-600">{formatCurrency(totalPemasukan)}</td>
                            <td className="px-6 py-3 text-right text-red-600">{formatCurrency(totalPengeluaran)}</td>
                            <td className="px-6 py-3 text-center font-bold text-lg text-emerald-700">{formatCurrency(totalPemasukan - totalPengeluaran)}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </>
    );
}

