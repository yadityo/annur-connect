import React, { useState } from 'react';

export default function AdminHeader({ setSidebarOpen, logout }) {
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
                            <a onClick={(e) => { e.preventDefault(); logout(); }} href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

