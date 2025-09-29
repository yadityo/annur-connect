import React from 'react';

export default function AdminSidebar({ page, navigate, sidebarOpen }) {
    return (
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
}
