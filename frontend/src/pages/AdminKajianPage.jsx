import React, { useEffect, useState } from 'react';

export default function AdminKajianPage() {
    const [kajianList, setKajianList] = useState([]);
    const [ustadzList, setUstadzList] = useState([]);
    const [kategoriList, setKategoriList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ judul: '', ustadz: '', tanggal: '', kategori: '', deskripsi: '' });
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    // Fetch data master
    useEffect(() => {
        const fetchMaster = async () => {
            try {
                const [ustadzRes, kategoriRes] = await Promise.all([
                    fetch('http://localhost:5000/api/ustadz'),
                    fetch('http://localhost:5000/api/kategori-kajian')
                ]);
                const ustadzData = await ustadzRes.json();
                const kategoriData = await kategoriRes.json();
                setUstadzList(Array.isArray(ustadzData) ? ustadzData : []);
                setKategoriList(Array.isArray(kategoriData) ? kategoriData : []);
            } catch {
                setUstadzList([]);
                setKategoriList([]);
            }
        };
        fetchMaster();
    }, []);

    // Fetch kajian
    const fetchKajian = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/kajian');
            const data = await res.json();
            setKajianList(Array.isArray(data) ? data : []);
        } catch {
            setKajianList([]);
        }
        setLoading(false);
    };
    useEffect(() => { fetchKajian(); }, []);

    // Handle form
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (!form.judul || !form.ustadz || !form.tanggal || !form.kategori) {
            setError('Semua field wajib diisi.');
            return;
        }
        // Convert tanggal ke format ISO agar backend terima Date
        const tanggalISO = new Date(form.tanggal).toISOString();
        try {
            const url = editId ? `http://localhost:5000/api/kajian/${editId}` : 'http://localhost:5000/api/kajian';
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tanggal: tanggalISO })
            });
            if (!res.ok) throw new Error('Gagal simpan data');
            setShowForm(false);
            setForm({ judul: '', ustadz: '', tanggal: '', kategori: '', deskripsi: '' });
            setEditId(null);
            fetchKajian();
        } catch {
            setError('Gagal simpan data.');
        }
    };
    const handleEdit = kajian => {
        // Format tanggal ke value input type datetime-local
        const tgl = kajian.tanggal ? new Date(kajian.tanggal).toISOString().slice(0,16) : '';
        setForm({
            judul: kajian.judul,
            ustadz: kajian.ustadz?._id || kajian.ustadz,
            tanggal: tgl,
            kategori: kajian.kategori?._id || kajian.kategori,
            deskripsi: kajian.deskripsi || ''
        });
        setEditId(kajian._id);
        setShowForm(true);
    };
    const handleDelete = async id => {
        if (!window.confirm('Yakin ingin menghapus kajian ini?')) return;
        try {
            await fetch(`http://localhost:5000/api/kajian/${id}`, { method: 'DELETE' });
            fetchKajian();
        } catch {}
    };
    const handleAdd = () => {
        setForm({ judul: '', ustadz: '', tanggal: '', kategori: '', deskripsi: '' });
        setEditId(null);
        setShowForm(true);
        setError('');
    };
    const handleCancel = () => {
        setShowForm(false);
        setEditId(null);
        setForm({ judul: '', ustadz: '', tanggal: '', kategori: '', deskripsi: '' });
        setError('');
    };

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">Manajemen Kajian</h1>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors" onClick={handleAdd}>Tambah Kajian</button>
            </div>
            {showForm && (
                <form className="mb-6 bg-white p-6 rounded-lg shadow" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input name="judul" value={form.judul} onChange={handleChange} className="border p-2 rounded" placeholder="Judul Kajian" required />
                        <select name="ustadz" value={form.ustadz} onChange={handleChange} className="border p-2 rounded" required>
                            <option value="">Pilih Ustadz</option>
                            {ustadzList.map(u => <option key={u._id} value={u._id}>{u.nama}</option>)}
                        </select>
                        <input name="tanggal" type="datetime-local" value={form.tanggal} onChange={handleChange} className="border p-2 rounded" required />
                        <select name="kategori" value={form.kategori} onChange={handleChange} className="border p-2 rounded" required>
                            <option value="">Pilih Kategori</option>
                            {kategoriList.map(k => <option key={k._id} value={k._id}>{k.nama}</option>)}
                        </select>
                        <textarea name="deskripsi" value={form.deskripsi} onChange={handleChange} className="border p-2 rounded md:col-span-2" placeholder="Deskripsi Kajian" rows={3} />
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
                                <th scope="col" className="px-6 py-3">Judul</th>
                                <th scope="col" className="px-6 py-3">Ustadz</th>
                                <th scope="col" className="px-6 py-3">Waktu</th>
                                <th scope="col" className="px-6 py-3">Kategori</th>
                                <th scope="col" className="px-6 py-3">Deskripsi</th>
                                <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kajianList.map(kajian => (
                                <tr key={kajian._id} className="bg-white border-b hover:bg-slate-50">
                                    <th className="px-6 py-4 font-medium text-slate-900">{kajian.judul}</th>
                                    <td className="px-6 py-4">{kajian.ustadz?.nama || '-'}</td>
                                    <td className="px-6 py-4">{kajian.tanggal ? new Date(kajian.tanggal).toLocaleString('id-ID', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    }) : '-'}</td>
                                    <td className="px-6 py-4">{kajian.kategori?.nama || '-'}</td>
                                    <td className="px-6 py-4">{kajian.deskripsi || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-emerald-600 hover:underline mr-4" onClick={() => handleEdit(kajian)}>Edit</button>
                                        <button className="font-medium text-red-600 hover:underline" onClick={() => handleDelete(kajian._id)}>Hapus</button>
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
