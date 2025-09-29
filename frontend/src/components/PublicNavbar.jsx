import React, { useState } from 'react';

export default function PublicNavbar({ page, currentUser, navigate, logout }) {
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
                            {!currentUser ? (
                                <>
                                    <a onClick={(e) => { e.preventDefault(); navigate('login'); }} href="#" className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">Login</a>
                                    <a onClick={(e) => { e.preventDefault(); navigate('register'); }} href="#" className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">Register</a>
                                </>
                            ) : (
                                <div className="relative">
                                    <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center space-x-2">
                                        <img src={currentUser.role === 'dkm' ? "https://placehold.co/40x40/10B981/FFFFFF?text=A" : "https://placehold.co/40x40/E2E8F0/475569?text=U"} alt="User" className="w-8 h-8 rounded-full" />
                                        <span className="text-slate-600 font-medium text-sm hidden sm:inline">{currentUser.name}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                    {profileMenuOpen && (
                                        <div onMouseLeave={() => setProfileMenuOpen(false)} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20">
                                            {currentUser.role === 'jamaah' && <a onClick={(e) => { e.preventDefault(); navigate('profil'); setProfileMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Profil Saya</a>}
                                            {currentUser.role === 'dkm' && <a onClick={(e) => { e.preventDefault(); navigate('admin_dashboard'); setProfileMenuOpen(false); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Dashboard Admin</a>}
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
                        {!currentUser ? (
                            <>
                                <a onClick={(e) => { e.preventDefault(); navigate('login'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Login</a>
                                <a onClick={(e) => { e.preventDefault(); navigate('register'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Register</a>
                            </>
                        ) : (
                            <>
                                {currentUser.role === 'jamaah' && <a onClick={(e) => { e.preventDefault(); navigate('profil'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Profil Saya</a>}
                                {currentUser.role === 'dkm' && <a onClick={(e) => { e.preventDefault(); navigate('admin_dashboard'); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Dashboard Admin</a>}
                                <a onClick={(e) => { e.preventDefault(); logout(); setMobileMenuOpen(false); }} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-slate-100">Logout</a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

