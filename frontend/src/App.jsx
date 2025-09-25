import React, { useState, useEffect, useMemo } from 'react';

// --- MOCK DATA ---
const ALL_KAJIAN = [
    { id: 1, judul: 'Tafsir Surat Al-Fatihah: Makna dan Keutamaannya', ustadz: 'Ustadz Abdul Somad, Lc., M.A.', tanggal: '30 Sep 2025', waktu: 'Ba\'da Maghrib', kategori: 'Tafsir', deskripsi: '<p>Kajian mendalam mengenai tafsir Surat Al-Fatihah, membahas setiap ayat, makna yang terkandung, serta keutamaan membacanya dalam shalat dan kehidupan sehari-hari. Cocok untuk semua kalangan yang ingin memperdalam pemahaman Al-Qur\'an.</p><p class="mt-4">Jamaah diharapkan membawa mushaf Al-Qur\'an masing-masing untuk mengikuti pembahasan.</p>' },
    { id: 2, judul: 'Fiqih Muamalah: Jual Beli yang Sesuai Syariat', ustadz: 'Ustadz Dr. Adi Hidayat, Lc., M.A.', tanggal: '02 Okt 2025', waktu: '09:00 WIB', kategori: 'Fiqih', deskripsi: '<p>Pembahasan lengkap mengenai prinsip-prinsip jual beli dalam Islam. Mulai dari rukun, syarat, hingga contoh transaksi modern seperti jual beli online dan dropshipping. Sangat relevan untuk para pengusaha dan siapa saja yang berinteraksi dalam jual beli.</p>' },
    { id: 3, judul: 'Kajian Hadits Arbain: Niat dan Ikhlas', ustadz: 'Ustadz Salim A. Fillah', tanggal: '05 Okt 2025', waktu: 'Ba\'da Isya', kategori: 'Hadits', deskripsi: '<p>Mengupas hadits pertama dari kitab Arbain An-Nawawiyah, "Innamal a\'malu binniyat". Kajian ini akan membahas pentingnya niat yang lurus dan ikhlas dalam setiap amalan agar diterima oleh Allah SWT.</p>' },
    { id: 4, judul: 'Sirah Nabawiyah: Kelahiran Sang Nabi Akhir Zaman', ustadz: 'Ustadz Budi Ashari, Lc.', tanggal: '10 Okt 2025', waktu: 'Ba\'da Subuh', kategori: 'Sirah', deskripsi: '<p>Menelusuri kembali jejak sejarah kelahiran Nabi Muhammad SAW, peristiwa-peristiwa luar biasa yang mengiringinya, dan hikmah yang dapat diambil untuk kehidupan kita saat ini.</p>' },
];

const TRANSACTIONS = [
    { id: 1, tanggal: '28 Sep 2025', keterangan: 'Infaq Kotak Amal Jumat', kategori: 'Infaq', pemasukan: 5250000, pengeluaran: null, bukti: true },
    { id: 2, tanggal: '27 Sep 2025', keterangan: 'Pembayaran Listrik & Air Bulan September', kategori: 'Operasional', pemasukan: null, pengeluaran: 1250000, bukti: true },
    { id: 3, tanggal: '26 Sep 2025', keterangan: 'Pembelian Karpet Baru Ruang Utama', kategori: 'Operasional', pemasukan: null, pengeluaran: 3500000, bukti: true },
    { id: 4, tanggal: '25 Sep 2025', keterangan: 'Donasi dari Hamba Allah', kategori: 'Infaq', pemasukan: 2000000, pengeluaran: null, bukti: false },
];

// --- HELPER FUNCTIONS ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};


// --- UI COMPONENTS ---

const KajianCard = ({ kajian, navigate }) => (
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

const PublicNavbar = ({ page, isLoggedIn, navigate, loginAdmin, logout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="bg-emerald-500 text-white p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        </div>
                        <a onClick={(e) => { e.preventDefault(); navigate('home'); }} href="#" className="font-bold text-xl text-emerald-600">Masjid Al-Hikmah</a>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <a onClick={(e) => { e.preventDefault(); navigate('home'); }} href="#" className={`text-slate-600 hover:text-emerald-600 transition-colors ${page === 'home' ? 'text-emerald-600 font-semibold' : ''}`}>Home</a>
                        <a onClick={(e) => { e.preventDefault(); navigate('kajian'); }} href="#" className={`text-slate-600 hover:text-emerald-600 transition-colors ${page.startsWith('kajian') ? 'text-emerald-600 font-semibold' : ''}`}>Kajian</a>
                        <a onClick={(e) => { e.preventDefault(); navigate('laporan'); }} href="#" className={`text-slate-600 hover:text-emerald-600 transition-colors ${page === 'laporan' ? 'text-emerald-600 font-semibold' : ''}`}>Laporan</a>
                        <div className="flex items-center space-x-2">
                            {!isLoggedIn ? (
                                <>
                                    <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">Login</a>
                                    <a onClick={(e) => { e.preventDefault(); navigate('register'); }} href="#" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">Register</a>
                                </>
                            ) : (
                                <div className="relative">
                                    <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2">
                                        <img src="https://placehold.co/40x40/E2E8F0/475569?text=U" alt="User" className="w-8 h-8 rounded-full" />
                                        <span className="text-slate-600 font-medium text-sm hidden sm:inline">User</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                    {profileMenuOpen && (
                                        <div onMouseLeave={() => setProfileMenuOpen(false)} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1">
                                            <a onClick={(e) => { e.preventDefault(); navigate('profil'); setProfileMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profil Saya</a>
                                            <a onClick={(e) => { e.preventDefault(); loginAdmin(); setProfileMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Dashboard Admin</a>
                                            <a onClick={(e) => { e.preventDefault(); logout(); setProfileMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Logout</a>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </nav>
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a onClick={(e) => { e.preventDefault(); navigate('home'); setMobileMenuOpen(false); }} href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${page === 'home' ? 'text-white bg-emerald-500' : 'text-slate-600 hover:bg-slate-100'}`}>Home</a>
                        <a onClick={(e) => { e.preventDefault(); navigate('kajian'); setMobileMenuOpen(false); }} href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${page.startsWith('kajian') ? 'text-white bg-emerald-500' : 'text-slate-600 hover:bg-slate-100'}`}>Kajian</a>
                        <a onClick={(e) => { e.preventDefault(); navigate('laporan'); setMobileMenuOpen(false); }} href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${page === 'laporan' ? 'text-white bg-emerald-500' : 'text-slate-600 hover:bg-slate-100'}`}>Laporan</a>
                        <div className="border-t border-slate-200 my-2"></div>
                        {!isLoggedIn ? (
                            <>
                                <a onClick={(e) => { e.preventDefault(); navigate('login'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Login</a>
                                <a onClick={(e) => { e.preventDefault(); navigate('register'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Register</a>
                            </>
                        ) : (
                            <>
                                <a onClick={(e) => { e.preventDefault(); navigate('profil'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Profil Saya</a>
                                <a onClick={(e) => { e.preventDefault(); loginAdmin(); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Dashboard Admin</a>
                                <a onClick={(e) => { e.preventDefault(); logout(); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Logout</a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

// --- PAGES ---
const HomePage = ({ navigate }) => {
    const upcomingKajian = useMemo(() => ALL_KAJIAN.slice(0, 3), []);
    return (
        <>
            <section className="text-center bg-white p-8 md:p-16 rounded-2xl shadow-sm mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">Selamat Datang di Masjid Al-Hikmah</h1>
                <p className="max-w-3xl mx-auto text-slate-500 text-lg">Pusat informasi kegiatan, kajian, dan transparansi keuangan untuk kemudahan jamaah.</p>
                <div className="mt-8">
                    <img src="https://placehold.co/1000x400/10B981/FFFFFF?text=Ilustrasi+Masjid" alt="Ilustrasi Masjid Al-Hikmah" className="w-full h-auto object-cover rounded-xl shadow-lg" />
                </div>
            </section>
            <section>
                <h2 className="text-3xl font-bold mb-6 text-center">Kajian Terdekat</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingKajian.map(kajian => <KajianCard key={kajian.id} kajian={kajian} navigate={navigate} />)}
                </div>
            </section>
        </>
    );
};

const KajianListPage = ({ navigate }) => (
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

const KajianDetailPage = ({ kajianId, isLoggedIn, navigate, userRegisteredIds, registerKajian, unregisterKajian }) => {
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
                    {!isLoggedIn ? (
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
};

const LaporanPage = () => {
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
};

const LoginPage = ({ navigate, login }) => (
    <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-600">Login</h1>
                    <p className="text-slate-500">Masuk untuk mengakses fitur jamaah.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                    <div className="space-y-4">
                        <div><label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label><input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" placeholder="nama@email.com" required /></div>
                        <div><label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label><input type="password" id="password" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500" placeholder="••••••••" required /></div>
                    </div>
                    <div className="mt-6"><button type="submit" className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">Login</button></div>
                    <p className="text-center text-sm text-slate-500 mt-6">Belum punya akun? <a onClick={(e) => { e.preventDefault(); navigate('register'); }} href="#" className="font-medium text-emerald-600 hover:underline">Register di sini</a></p>
                </form>
            </div>
        </div>
    </div>
);

const RegisterPage = ({ navigate, login }) => (
    <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-emerald-600">Register</h1>
                    <p className="text-slate-500">Buat akun baru untuk mendaftar kajian.</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); login(); }}>
                    <div className="space-y-4">
                        <div><label htmlFor="nama" className="block text-sm font-medium text-slate-700">Nama Lengkap</label><input type="text" id="nama" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="Nama Anda" required /></div>
                        <div><label htmlFor="email_reg" className="block text-sm font-medium text-slate-700">Email</label><input type="email" id="email_reg" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="nama@email.com" required /></div>
                        <div><label htmlFor="password_reg" className="block text-sm font-medium text-slate-700">Password</label><input type="password" id="password_reg" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="••••••••" required /></div>
                        <div><label htmlFor="password_conf" className="block text-sm font-medium text-slate-700">Konfirmasi Password</label><input type="password" id="password_conf" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg" placeholder="••••••••" required /></div>
                    </div>
                    <div className="mt-6"><button type="submit" className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Register</button></div>
                    <p className="text-center text-sm text-slate-500 mt-6">Sudah punya akun? <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="font-medium text-emerald-600 hover:underline">Login di sini</a></p>
                </form>
            </div>
        </div>
    </div>
);

const ProfilPage = ({ navigate, userRegisteredIds, unregisterKajian }) => {
    const userRegisteredKajian = useMemo(() => ALL_KAJIAN.filter(k => userRegisteredIds.includes(k.id)), [userRegisteredIds]);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <img src="https://placehold.co/128x128/E2E8F0/475569?text=U" alt="User Profile" className="w-32 h-32 rounded-full mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900">User Jamaah</h2>
                        <p className="text-slate-500">user.jamaah@email.com</p>
                        <button className="mt-4 w-full bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Edit Profil</button>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Kajian yang Saya Ikuti</h3>
                        <div className="space-y-4">
                            {userRegisteredKajian.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Anda belum mendaftar kajian apapun.</p>
                            ) : (
                                userRegisteredKajian.map(kajian => (
                                    <div key={kajian.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                                        <div>
                                            <a onClick={(e) => { e.preventDefault(); navigate('kajian_detail', kajian.id); }} href="#" className="font-semibold text-slate-800 hover:text-emerald-600">{kajian.judul}</a>
                                            <p className="text-sm text-slate-500">{kajian.ustadz} - {kajian.tanggal}</p>
                                        </div>
                                        <button onClick={() => unregisterKajian(kajian.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Batalkan</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


// --- ADMIN COMPONENTS ---
const AdminSidebar = ({ page, navigate, sidebarOpen }) => (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 border-b">
            <div className="flex items-center space-x-3">
                <div className="bg-emerald-500 text-white p-2 rounded-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
                <span className="font-bold text-xl text-emerald-600">Admin DKM</span>
            </div>
        </div>
        <nav className="py-4">
            <a onClick={(e) => { e.preventDefault(); navigate('admin_dashboard'); }} href="#" className={`flex items-center px-6 py-3 text-slate-600 ${page === 'admin_dashboard' ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>Dashboard</a>
            <a onClick={(e) => { e.preventDefault(); navigate('admin_kajian'); }} href="#" className={`flex items-center px-6 py-3 text-slate-600 ${page === 'admin_kajian' ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.346.617l.41 2.338a1 1 0 00.976.851h.005l.41-2.338a1 1 0 01.346-.617L10 6.182l2.69 1.226a1 1 0 01.346.617l.41 2.338a1 1 0 00.976.851h.005l.41-2.338a1 1 0 01.346-.617l2.87-1.305a1 1 0 000-1.84l-7-3zM3 14a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" /></svg>Manajemen Kajian</a>
            <a onClick={(e) => { e.preventDefault(); navigate('admin_laporan'); }} href="#" className={`flex items-center px-6 py-3 text-slate-600 ${page === 'admin_laporan' ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>Manajemen Keuangan</a>
            <a onClick={(e) => { e.preventDefault(); navigate('admin_data_master'); }} href="#" className={`flex items-center px-6 py-3 text-slate-600 ${page === 'admin_data_master' ? 'bg-emerald-50 text-emerald-600 border-r-4 border-emerald-500' : 'hover:bg-slate-50'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>Data Master</a>
        </nav>
    </aside>
);

const AdminHeader = ({ setSidebarOpen, logoutAdmin }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    return (
        <header className="flex items-center justify-between h-16 bg-white border-b px-6">
            <button onClick={() => setSidebarOpen(open => !open)} className="md:hidden text-slate-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center">
                <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2">
                        <img src="https://placehold.co/40x40/10B981/FFFFFF?text=A" alt="Admin" className="w-8 h-8 rounded-full" />
                        <span className="text-slate-600 font-medium text-sm hidden sm:inline">Admin DKM</span>
                    </button>
                    {profileOpen && (
                        <div onMouseLeave={() => setProfileOpen(false)} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-10">
                            <a onClick={(e) => { e.preventDefault(); logoutAdmin(); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const AdminDashboardPage = () => {
    const upcomingKajian = useMemo(() => ALL_KAJIAN.slice(0, 3), []);
    const recentTransactions = useMemo(() => TRANSACTIONS.slice(0, 4), []);

    // Mock data for the chart
    const weeklyData = [
        { day: 'Sen', pemasukan: 300, pengeluaran: 150 },
        { day: 'Sel', pemasukan: 500, pengeluaran: 200 },
        { day: 'Rab', pemasukan: 450, pengeluaran: 300 },
        { day: 'Kam', pemasukan: 700, pengeluaran: 100 },
        { day: 'Jum', pemasukan: 1200, pengeluaran: 400 },
        { day: 'Sab', pemasukan: 250, pengeluaran: 50 },
        { day: 'Min', pemasukan: 600, pengeluaran: 220 },
    ];
    const maxChartValue = 1200; // Based on max value in weeklyData

    return (
        <>
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Dashboard</h1>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Kajian</p><p className="text-3xl font-bold text-slate-800">{ALL_KAJIAN.length}</p></div><div className="bg-emerald-100 text-emerald-600 p-3 rounded-full"><svg xmlns="http://www.w.3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Ustadz</p><p className="text-3xl font-bold text-slate-800">4</p></div><div className="bg-blue-100 text-blue-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Jamaah</p><p className="text-3xl font-bold text-slate-800">125</p></div><div className="bg-indigo-100 text-indigo-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div></div>
                <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Transaksi</p><p className="text-3xl font-bold text-slate-800">{TRANSACTIONS.length}</p></div><div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></div></div>
            </div>

            {/* Main Dashboard Content */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2">
                    {/* Financial Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Grafik Keuangan Pekan Ini (Ribuan Rp)</h3>
                        <div className="flex justify-between items-end h-64 space-x-2">
                            {weeklyData.map(data => (
                                <div key={data.day} className="flex-1 flex flex-col items-center justify-end">
                                    <div className="relative w-full h-full flex items-end justify-center">
                                        <div className="w-1/2 flex items-end h-full">
                                            <div
                                                className="w-1/2 bg-emerald-300 rounded-t-md hover:bg-emerald-400"
                                                style={{ height: `${(data.pemasukan / maxChartValue) * 100}%` }}
                                                title={`Pemasukan: ${formatCurrency(data.pemasukan * 1000)}`}
                                            ></div>
                                            <div
                                                className="w-1/2 bg-red-300 rounded-t-md hover:bg-red-400"
                                                style={{ height: `${(data.pengeluaran / maxChartValue) * 100}%` }}
                                                title={`Pengeluaran: ${formatCurrency(data.pengeluaran * 1000)}`}
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

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Upcoming Kajian */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Kajian Akan Datang</h3>
                        <ul className="space-y-4">
                            {upcomingKajian.map(kajian => (
                                <li key={kajian.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                                    <p className="font-semibold text-slate-700">{kajian.judul}</p>
                                    <p className="text-sm text-slate-500">{kajian.ustadz} - {kajian.tanggal}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Recent Transactions */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Aktivitas Keuangan Terbaru</h3>
                        <ul className="space-y-3">
                            {recentTransactions.map(trx => (
                                <li key={trx.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-slate-700">{trx.keterangan}</p>
                                        <p className="text-xs text-slate-400">{trx.tanggal}</p>
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
    )};


const AdminKajianPage = () => (
    <>
        <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-semibold text-slate-800">Manajemen Kajian</h1><button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Tambah Kajian</button></div>
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto"><table className="w-full text-sm text-left text-slate-500"><thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th scope="col" className="px-6 py-3">Judul</th><th scope="col" className="px-6 py-3">Ustadz</th><th scope="col" className="px-6 py-3">Waktu</th><th scope="col" className="px-6 py-3">Kategori</th><th scope="col" className="px-6 py-3 text-right">Aksi</th></tr></thead><tbody>{ALL_KAJIAN.map(kajian => (<tr key={kajian.id} className="bg-white border-b hover:bg-slate-50"><th className="px-6 py-4 font-medium text-slate-900">{kajian.judul}</th><td className="px-6 py-4">{kajian.ustadz}</td><td className="px-6 py-4">{kajian.tanggal}</td><td className="px-6 py-4">{kajian.kategori}</td><td className="px-6 py-4 text-right"><a href="#" className="font-medium text-emerald-600 hover:underline mr-4">Edit</a><a href="#" className="font-medium text-red-600 hover:underline">Hapus</a></td></tr>))}</tbody></table></div>
    </>
);

const AdminLaporanPage = () => (
    <>
        <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-semibold text-slate-800">Manajemen Keuangan</h1><button className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition-colors">Tambah Transaksi</button></div>
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto"><table className="w-full text-sm text-left text-slate-500"><thead className="text-xs text-slate-700 uppercase bg-slate-50"><tr><th scope="col" className="px-6 py-3">Tanggal</th><th scope="col" className="px-6 py-3">Keterangan</th><th scope="col" className="px-6 py-3">Pemasukan</th><th scope="col" className="px-6 py-3">Pengeluaran</th><th scope="col" className="px-6 py-3">Bukti</th><th scope="col" className="px-6 py-3 text-right">Aksi</th></tr></thead><tbody>{TRANSACTIONS.map(trx => (<tr key={trx.id} className="bg-white border-b hover:bg-slate-50"><td className="px-6 py-4">{trx.tanggal}</td><th scope="row" className="px-6 py-4 font-medium text-slate-900">{trx.keterangan}</th><td className="px-6 py-4 text-green-600">{trx.pemasukan ? formatCurrency(trx.pemasukan) : '-'}</td><td className="px-6 py-4 text-red-600">{trx.pengeluaran ? formatCurrency(trx.pengeluaran) : '-'}</td><td className="px-6 py-4">{trx.bukti && <a href="#" className="font-medium text-emerald-600 hover:underline">Lihat</a>}</td><td className="px-6 py-4 text-right"><a href="#" className="font-medium text-emerald-600 hover:underline mr-4">Edit</a><a href="#" className="font-medium text-red-600 hover:underline">Hapus</a></td></tr>))}</tbody></table></div>
    </>
);

const AdminDataMasterPage = () => (
    <>
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Manajemen Data Master</h1>
        <div className="grid lg:grid-cols-2 gap-8">
            <div><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-700">Data Ustadz</h2><button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-emerald-600">Tambah</button></div><div className="bg-white rounded-lg shadow-sm overflow-hidden"><ul className="divide-y divide-slate-200"><li className="px-4 py-3 flex justify-between items-center"><div>Ustadz Abdul Somad</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li><li className="px-4 py-3 flex justify-between items-center"><div>Ustadz Adi Hidayat</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li></ul></div></div>
            <div><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-700">Kategori Kajian</h2><button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-emerald-600">Tambah</button></div><div className="bg-white rounded-lg shadow-sm overflow-hidden"><ul className="divide-y divide-slate-200"><li className="px-4 py-3 flex justify-between items-center"><div>Tafsir</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li><li className="px-4 py-3 flex justify-between items-center"><div>Fiqih</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li><li className="px-4 py-3 flex justify-between items-center"><div>Hadits</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li></ul></div></div>
            <div className="lg:col-span-2"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-slate-700">Kategori Transaksi</h2><button className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-emerald-600">Tambah</button></div><div className="bg-white rounded-lg shadow-sm overflow-hidden"><ul className="divide-y divide-slate-200"><li className="px-4 py-3 flex justify-between items-center"><div>Infaq</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li><li className="px-4 py-3 flex justify-between items-center"><div>Operasional</div><div className="space-x-2"><a href="#" className="text-emerald-600 text-sm">Edit</a><a href="#" className="text-red-600 text-sm">Hapus</a></div></li></ul></div></div>
        </div>
    </>
);


// --- MAIN APP COMPONENT ---
export default function App() {
    const [page, setPage] = useState('home');
    const [pageId, setPageId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRegisteredIds, setUserRegisteredIds] = useState([2]);

    // Router effect
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const [path, id] = hash.split('/');
                setPage(id ? `${path}_detail` : path);
                setPageId(id ? parseInt(id, 10) : null);
                setIsAdmin(path.startsWith('admin'));
            } else {
                setPage('home');
                setPageId(null);
                setIsAdmin(false);
            }
            window.scrollTo(0, 0);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange(); // Initial load

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (newPage, id = null) => {
        window.location.hash = id ? `${newPage.replace('_detail', '')}/${id}` : newPage;
    };

    // Auth methods
    const login = () => { setIsLoggedIn(true); navigate('home'); };
    const logout = () => { setIsLoggedIn(false); navigate('home'); };
    const loginAdmin = () => { setIsLoggedIn(true); navigate('admin_dashboard'); };
    const logoutAdmin = () => { setIsLoggedIn(true); navigate('home'); };

    // User Kajian methods
    const registerKajian = (kajianId) => {
        if (!userRegisteredIds.includes(kajianId)) {
            setUserRegisteredIds([...userRegisteredIds, kajianId]);
        }
    };
    const unregisterKajian = (kajianId) => {
        setUserRegisteredIds(userRegisteredIds.filter(id => id !== kajianId));
    };

    // Page Renderer
    const renderPublicPage = () => {
        const props = { navigate, isLoggedIn, login, logout, loginAdmin, userRegisteredIds, registerKajian, unregisterKajian };
        switch (page) {
            case 'home': return <HomePage {...props} />;
            case 'kajian': return <KajianListPage {...props} />;
            case 'kajian_detail': return <KajianDetailPage kajianId={pageId} {...props} />;
            case 'laporan': return <LaporanPage {...props} />;
            case 'login': return <LoginPage {...props} />;
            case 'register': return <RegisterPage {...props} />;
            case 'profil': return <ProfilPage {...props} />;
            default: return <HomePage {...props} />;
        }
    };

    const renderAdminPage = () => {
        switch (page) {
            case 'admin_dashboard': return <AdminDashboardPage />;
            case 'admin_kajian': return <AdminKajianPage />;
            case 'admin_laporan': return <AdminLaporanPage />;
            case 'admin_data_master': return <AdminDataMasterPage />;
            default: return <AdminDashboardPage />;
        }
    };

    if (isAdmin) {
        return (
            <div className="flex h-screen bg-slate-100">
                <AdminSidebar page={page} navigate={navigate} sidebarOpen={sidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader setSidebarOpen={setSidebarOpen} logoutAdmin={logoutAdmin} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
                        {renderAdminPage()}
                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <PublicNavbar page={page} isLoggedIn={isLoggedIn} navigate={navigate} loginAdmin={loginAdmin} logout={logout} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {renderPublicPage()}
            </main>
        </>
    );
}

