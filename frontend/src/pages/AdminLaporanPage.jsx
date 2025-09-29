import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../utils';

export default function AdminLaporanPage() {
    const [transaksi, setTransaksi] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ tanggal: '', keterangan: '', pemasukan: '', pengeluaran: '', kategori: '', bukti: null });
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');

    // Fetch kategori transaksi
    useEffect(() => {
        fetch('http://localhost:5000/api/kategori-transaksi')
            .then(res => res.json())
            .then(data => setKategoriList(Array.isArray(data) ? data : []));
    }, []);

    // Fetch transaksi
    const fetchTransaksi = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/transaksi');
            const data = await res.json();
            setTransaksi(Array.isArray(data) ? data : []);
        } catch {
            setTransaksi([]);
        }
        setLoading(false);
    };
    useEffect(() => { fetchTransaksi(); }, []);

    // Handle form
    const handleChange = e => {
        const { name, value, files } = e.target;
        if (name === 'bukti') {
            setForm({ ...form, bukti: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!form.tanggal || !form.keterangan || !form.kategori) {
            setError('Field wajib diisi.');
            return;
        }
        const fd = new FormData();
        fd.append('tanggal', form.tanggal);
        fd.append('keterangan', form.keterangan);
        fd.append('pemasukan', form.pemasukan || 0);
        fd.append('pengeluaran', form.pengeluaran || 0);
        fd.append('kategori', form.kategori);
        if (form.bukti) fd.append('bukti', form.bukti);
        try {
            const url = editId ? `http://localhost:5000/api/transaksi/${editId}` : 'http://localhost:5000/api/transaksi';
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                body: fd
            });
            if (!res.ok) throw new Error('Gagal simpan data');
            setShowForm(false);
            setForm({ tanggal: '', keterangan: '', pemasukan: '', pengeluaran: '', kategori: '', bukti: null });
            setEditId(null);
            fetchTransaksi();
        } catch {
            setError('Gagal simpan data.');
        }
    };
    const handleEdit = trx => {
        setForm({
            tanggal: trx.tanggal ? new Date(trx.tanggal).toISOString().slice(0,16) : '',
            keterangan: trx.keterangan,
            pemasukan: trx.pemasukan || '',
            pengeluaran: trx.pengeluaran || '',
            kategori: trx.kategori?._id || trx.kategori,
            bukti: null
        });
        setEditId(trx._id);
        setShowForm(true);
        setError('');
    };
    const handleDelete = async id => {
        if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
        try {
            await fetch(`http://localhost:5000/api/transaksi/${id}`, { method: 'DELETE' });
            fetchTransaksi();
        } catch (err) {
            setError('Gagal menghapus data.');
        }
    };
    const handleAdd = () => {
        setForm({ tanggal: '', keterangan: '', pemasukan: '', pengeluaran: '', kategori: '', bukti: null });
        setEditId(null);
        setShowForm(true);
        setError('');
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditId(null);
        setForm({ tanggal: '', keterangan: '', pemasukan: '', pengeluaran: '', kategori: '', bukti: null });
        setError('');
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">Manajemen Keuangan</h1>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors" onClick={handleAdd}>Tambah Transaksi</button>
            </div>
            {showForm && (
                <form className="mb-6 bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input name="tanggal" type="datetime-local" value={form.tanggal} onChange={handleChange} className="border p-2 rounded" required />
                        <input name="keterangan" value={form.keterangan} onChange={handleChange} className="border p-2 rounded" placeholder="Keterangan" required />
                        <input name="pemasukan" type="number" value={form.pemasukan} onChange={handleChange} className="border p-2 rounded" placeholder="Pemasukan" min="0" />
                        <input name="pengeluaran" type="number" value={form.pengeluaran} onChange={handleChange} className="border p-2 rounded" placeholder="Pengeluaran" min="0" />
                        <select name="kategori" value={form.kategori} onChange={handleChange} className="border p-2 rounded" required>
                            <option value="">Pilih Kategori</option>
                            {kategoriList.map(k => <option key={k._id} value={k._id}>{k.nama}</option>)}
                        </select>
                        <input name="bukti" type="file" accept="image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/webp" onChange={handleChange} className="border p-2 rounded" />
                    </div>
                    {error && <div className="text-red-500 mb-2">{error}</div>}
                    <div>
                        <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded mr-2">{editId ? 'Update' : 'Tambah'}</button>
                        <button type="button" className="bg-slate-300 px-4 py-2 rounded" onClick={handleCancel}>Batal</button>
                    </div>
                </form>
            )}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                {loading ? <div className="p-6 text-center">Loading...</div> : (
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Tanggal</th>
                                <th scope="col" className="px-6 py-3">Keterangan</th>
                                <th scope="col" className="px-6 py-3">Pemasukan</th>
                                <th scope="col" className="px-6 py-3">Pengeluaran</th>
                                <th scope="col" className="px-6 py-3">Kategori</th>
                                <th scope="col" className="px-6 py-3">Bukti</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaksi.map(trx => (
                                <tr key={trx._id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">{trx.tanggal ? new Date(trx.tanggal).toLocaleString() : '-'}</td>
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900">{trx.keterangan}</th>
                                    <td className="px-6 py-4 text-green-600">{trx.pemasukan ? formatCurrency(trx.pemasukan) : '-'}</td>
                                    <td className="px-6 py-4 text-red-600">{trx.pengeluaran ? formatCurrency(trx.pengeluaran) : '-'}</td>
                                    <td className="px-6 py-4">{trx.kategori?.nama || '-'}</td>
                                    <td className="px-6 py-4">{trx.bukti && <a href={`http://localhost:5000${trx.bukti}`} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline">Lihat</a>}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-emerald-600 hover:underline mr-4" onClick={() => handleEdit(trx)}>Edit</button>
                                        <button className="font-medium text-red-600 hover:underline" onClick={() => handleDelete(trx._id)}>Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
