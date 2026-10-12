import React from 'react';

function PublicLayout({ children }) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#fbf9f6] flex items-center justify-center font-sans text-left">
      {/* Warm Ambient Decorative Glow Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#c75b3a]/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#b08d57]/5 blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-3 sm:px-4 z-10 py-6 sm:py-12 flex justify-center items-center">
        <div className="w-full sm:w-[460px] transition-all duration-300">
          {/* Elegant White Card Wrapper */}
          <div 
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-amber-900/10 shadow-xl"
            style={{ boxShadow: '0 20px 40px -15px rgba(28, 25, 23, 0.08)' }}
          >
            {/* Top Terracotta Accent Bar */}
            <div className="h-[4px] w-full" style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)' }}></div>
            <div className="p-5 sm:p-10 text-left">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PublicLayout;
