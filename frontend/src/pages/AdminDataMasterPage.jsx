import React, { useEffect, useState } from 'react';

function MasterList({ title, items, onAdd, onEdit, onDelete, loading }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
                <button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-emerald-600" onClick={onAdd}>Tambah</button>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {loading ? <div className="p-4 text-center">Loading...</div> : (
                    <ul className="divide-y divide-slate-200">
                        {items.map(item => (
                            <li key={item._id} className="px-4 py-3 flex justify-between items-center">
                                <div>{item.nama}</div>
                                <div className="space-x-2">
                                    <button className="text-emerald-600 text-sm" onClick={() => onEdit(item)}>Edit</button>
                                    <button className="text-red-600 text-sm" onClick={() => onDelete(item._id)}>Hapus</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default function AdminDataMasterPage() {
    // State
    const [ustadz, setUstadz] = useState([]);
    const [kategoriKajian, setKategoriKajian] = useState([]);
    const [kategoriTransaksi, setKategoriTransaksi] = useState([]);
    const [loadingUstadz, setLoadingUstadz] = useState(true);
    const [loadingKajian, setLoadingKajian] = useState(true);
    const [loadingTransaksi, setLoadingTransaksi] = useState(true);
    const [modal, setModal] = useState({ open: false, type: '', editId: null, value: '' });
    const [error, setError] = useState('');

    // Fetch data master
    const fetchUstadz = async () => {
        setLoadingUstadz(true);
        try {
            const res = await fetch('http://localhost:5000/api/ustadz');
            const data = await res.json();
            setUstadz(Array.isArray(data) ? data : []);
        } catch { setUstadz([]); }
        setLoadingUstadz(false);
    };
    const fetchKategoriKajian = async () => {
        setLoadingKajian(true);
        try {
            const res = await fetch('http://localhost:5000/api/kategori-kajian');
            const data = await res.json();
            setKategoriKajian(Array.isArray(data) ? data : []);
        } catch { setKategoriKajian([]); }
        setLoadingKajian(false);
    };
    const fetchKategoriTransaksi = async () => {
        setLoadingTransaksi(true);
        try {
            const res = await fetch('http://localhost:5000/api/kategori-transaksi');
            const data = await res.json();
            setKategoriTransaksi(Array.isArray(data) ? data : []);
        } catch { setKategoriTransaksi([]); }
        setLoadingTransaksi(false);
    };
    useEffect(() => {
        fetchUstadz();
        fetchKategoriKajian();
        fetchKategoriTransaksi();
    }, []);

    // Modal logic
    const openModal = (type, editId = null, value = '') => {
        setModal({ open: true, type, editId, value });
        setError('');
    };
    const closeModal = () => {
        setModal({ open: false, type: '', editId: null, value: '' });
        setError('');
    };
    const handleSubmit = async e => {
        e.preventDefault();
        if (!modal.value.trim()) {
            setError('Nama wajib diisi.');
            return;
        }
        let url = '', method = '', body = { nama: modal.value };
        if (modal.type === 'ustadz') {
            url = modal.editId ? `http://localhost:5000/api/ustadz/${modal.editId}` : 'http://localhost:5000/api/ustadz';
            method = modal.editId ? 'PUT' : 'POST';
        } else if (modal.type === 'kategoriKajian') {
            url = modal.editId ? `http://localhost:5000/api/kategori-kajian/${modal.editId}` : 'http://localhost:5000/api/kategori-kajian';
            method = modal.editId ? 'PUT' : 'POST';
        } else if (modal.type === 'kategoriTransaksi') {
            url = modal.editId ? `http://localhost:5000/api/kategori-transaksi/${modal.editId}` : 'http://localhost:5000/api/kategori-transaksi';
            method = modal.editId ? 'PUT' : 'POST';
        }
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Gagal simpan data');
            closeModal();
            if (modal.type === 'ustadz') fetchUstadz();
            if (modal.type === 'kategoriKajian') fetchKategoriKajian();
            if (modal.type === 'kategoriTransaksi') fetchKategoriTransaksi();
        } catch {
            setError('Gagal simpan data.');
        }
    };
    const handleDelete = async (type, id) => {
        if (!window.confirm('Yakin ingin menghapus data ini?')) return;
        let url = '';
        if (type === 'ustadz') url = `http://localhost:5000/api/ustadz/${id}`;
        if (type === 'kategoriKajian') url = `http://localhost:5000/api/kategori-kajian/${id}`;
        if (type === 'kategoriTransaksi') url = `http://localhost:5000/api/kategori-transaksi/${id}`;
        try {
            await fetch(url, { method: 'DELETE' });
            if (type === 'ustadz') fetchUstadz();
            if (type === 'kategoriKajian') fetchKategoriKajian();
            if (type === 'kategoriTransaksi') fetchKategoriTransaksi();
        } catch {}
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Manajemen Data Master</h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <MasterList
                    title="Data Ustadz"
                    items={ustadz}
                    loading={loadingUstadz}
                    onAdd={() => openModal('ustadz')}
                    onEdit={item => openModal('ustadz', item._id, item.nama)}
                    onDelete={id => handleDelete('ustadz', id)}
                />
                <MasterList
                    title="Kategori Kajian"
                    items={kategoriKajian}
                    loading={loadingKajian}
                    onAdd={() => openModal('kategoriKajian')}
                    onEdit={item => openModal('kategoriKajian', item._id, item.nama)}
                    onDelete={id => handleDelete('kategoriKajian', id)}
                />
                <div className="lg:col-span-2">
                    <MasterList
                        title="Kategori Transaksi"
                        items={kategoriTransaksi}
                        loading={loadingTransaksi}
                        onAdd={() => openModal('kategoriTransaksi')}
                        onEdit={item => openModal('kategoriTransaksi', item._id, item.nama)}
                        onDelete={id => handleDelete('kategoriTransaksi', id)}
                    />
                </div>
            </div>
            {modal.open && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <form className="bg-white p-6 rounded-lg shadow w-full max-w-sm" onSubmit={handleSubmit}>
                        <h2 className="text-lg font-semibold mb-4">{modal.editId ? 'Edit' : 'Tambah'} {modal.type === 'ustadz' ? 'Ustadz' : modal.type === 'kategoriKajian' ? 'Kategori Kajian' : 'Kategori Transaksi'}</h2>
                        <input
                            type="text"
                            className="border p-2 rounded w-full mb-4"
                            placeholder="Nama"
                            value={modal.value}
                            onChange={e => setModal({ ...modal, value: e.target.value })}
                            required
                        />
                        {error && <div className="text-red-500 mb-2">{error}</div>}
                        <div className="flex justify-end gap-2">
                            <button type="button" className="bg-slate-300 px-4 py-2 rounded" onClick={closeModal}>Batal</button>
                            <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded">{modal.editId ? 'Update' : 'Tambah'}</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
