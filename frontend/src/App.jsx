import React, { useState, useEffect } from 'react';
import PublicNavbar from './components/PublicNavbar';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

import HomePage from './pages/HomePage';
import KajianListPage from './pages/KajianListPage';
import KajianDetailPage from './pages/KajianDetailPage';
import LaporanPage from './pages/LaporanPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilPage from './pages/ProfilPage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminKajianPage from './pages/AdminKajianPage';
import AdminLaporanPage from './pages/AdminLaporanPage';
import AdminDataMasterPage from './pages/AdminDataMasterPage';

export default function App() {
    const [page, setPage] = useState('home');
    const [pageId, setPageId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userRegisteredIds, setUserRegisteredIds] = useState([2]);

    // Router effect (uses hash-based routing like original implementation)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            const [path, id] = hash.split('/');
            const newPage = id ? `${path}_detail` : path || 'home';

            // Access control
            if (newPage.startsWith('admin')) {
                if (currentUser == null) {
                    // Tunggu currentUser terisi, jangan redirect
                    return;
                }
                if (currentUser.role !== 'dkm') {
                    navigate('home');
                    return;
                }
            }
            // Jamaah hanya bisa ke profil jika role-nya 'jamaah'
            if (newPage === 'profil' && currentUser?.role !== 'jamaah') {
                navigate('home');
                return;
            }
            setPage(newPage);
            setPageId(id ? parseInt(id, 10) : null);
            window.scrollTo(0, 0);
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [currentUser]);

    const navigate = (newPage, id = null) => {
        const path = id ? `${newPage.replace('_detail', '')}/${id}` : newPage;
        window.location.hash = path;
    };

    // Auth methods
    const login = (user) => {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        // Token sudah disimpan di LoginPage
        if (user.role === 'dkm') {
            window.location.hash = 'admin_dashboard';
        } else {
            navigate('home');
        }
    };
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('home');
    };

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
        const props = { navigate, currentUser, login, logout, userRegisteredIds, registerKajian, unregisterKajian };
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

    useEffect(() => {
        // Restore user from localStorage on first load
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
            } catch {}
        }
    }, []);

    if (currentUser && currentUser.role === 'dkm' && page.startsWith('admin')) {
        return (
            <div className="flex h-screen bg-slate-100">
                <AdminSidebar page={page} navigate={navigate} sidebarOpen={sidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader setSidebarOpen={setSidebarOpen} logout={logout} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
                        {renderAdminPage()}
                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <PublicNavbar page={page} currentUser={currentUser} navigate={navigate} logout={logout} />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {renderPublicPage()}
            </main>
        </>
    );
}
