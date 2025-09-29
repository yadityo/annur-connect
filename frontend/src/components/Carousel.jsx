import React, { useEffect, useState } from 'react';

export default function Carousel() {
    const slides = [
        {
            bgColor: 'bg-emerald-600',
            title: 'Selamat Datang di Masjid Al-Hikmah',
            description: 'Pusat informasi kegiatan, kajian, dan transparansi keuangan untuk kemudahan jamaah.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        },
        {
            bgColor: 'bg-sky-600',
            title: 'Temukan Jadwal Kajian Terbaru',
            description: 'Akses semua jadwal kajian yang akan datang dengan mudah dan cepat. Jangan lewatkan ilmu bermanfaat.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        },
        {
            bgColor: 'bg-indigo-600',
            title: 'Akses Laporan Keuangan Transparan',
            description: 'Lihat laporan pemasukan dan pengeluaran dana infaq masjid secara realtime dan terperinci.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        },
        {
            bgColor: 'bg-rose-600',
            title: 'Daftar Kajian Secara Online',
            description: 'Daftarkan diri Anda untuk mengikuti kajian pilihan langsung dari website. Mudah dan praktis.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <section className="relative w-full h-[450px] md:h-[400px] rounded-2xl shadow-lg mb-12 overflow-hidden">
            <div className="w-full h-full relative">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${slide.bgColor} ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center text-white text-center p-8">
                            {slide.icon}
                            <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                            <p className="max-w-3xl mx-auto text-base md:text-lg opacity-90">{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </section>
    );
}

