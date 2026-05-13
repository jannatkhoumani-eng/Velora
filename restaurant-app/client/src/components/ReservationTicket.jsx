import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, Printer, CheckCircle, Calendar, Clock, Users, Hash, Phone, UtensilsCrossed, Sparkles } from 'lucide-react';

export default function ReservationTicket({ reservation, onClose }) {
  const ticketRef = useRef(null);

  if (!reservation) return null;

  const qrContent = [
    `Velora RestoAdmin`,
    `ID: #${reservation.id}`,
    `Name: ${reservation.prenom} ${reservation.nom}`,
    `Date: ${reservation.date}`,
    `Time: ${reservation.heure}`,
    `Table: ${reservation.table}`,
    `Experience: ${reservation.experience || 'Standard'}`,
  ].join('\n');

  const getTableType = (t) => {
    if (t >= 1 && t <= 3) return 'Standard (2-seat)';
    if (t >= 4 && t <= 6) return 'Medium (4-seat)';
    if (t >= 7 && t <= 9) return 'Large (6-seat)';
    if (t === 10) return 'VIP (10-seat)';
    return 'Standard';
  };

  const handleDownload = () => {
    const canvas = ticketRef.current?.querySelector('canvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `Velora-QR-${reservation.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-scale">
      <div className="w-full max-w-3xl bg-[#0B0F1A] rounded-[32px] border border-amber-500/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative">
        {/* Gold Border Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-200 to-amber-600" />
        
        <div className="flex flex-col md:flex-row h-full">
          {/* Main Content */}
          <div className="flex-1 p-10 border-b md:border-b-0 md:border-r border-white/5">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
                  <CheckCircle size={12} /> Confirmed
                </div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Velora
                </h2>
                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-1">Digital Reservation</p>
              </div>
              <button onClick={onClose} className="md:hidden p-2 text-white/40"><X /></button>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-12 mb-10">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Hash size={10} /> ID</p>
                <p className="text-white font-bold text-lg">#{reservation.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Users size={10} /> Guests</p>
                <p className="text-white font-bold text-lg">{reservation.persons} Persons</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><UtensilsCrossed size={10} /> Client</p>
                <p className="text-white font-bold text-xl capitalize">{reservation.prenom} {reservation.nom}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar size={10} /> Date</p>
                <p className="text-white font-bold">{reservation.date}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock size={10} /> Time</p>
                <p className="text-white font-bold">{reservation.heure}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Sparkles size={10} /> Experience</p>
                <p className="text-amber-400 font-bold">{reservation.experience || 'Standard'}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex gap-4">
              <button onClick={handleDownload} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-600/20 transition-all">
                <Download size={18} /> Download
              </button>
              <button onClick={handlePrint} className="flex-1 bg-white/5 text-white border border-white/10 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <Printer size={18} /> Print
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="w-full md:w-72 bg-white/5 p-10 flex flex-col items-center justify-center text-center relative" ref={ticketRef}>
            <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0a14] rounded-full" />
            
            <div className="p-4 bg-white rounded-3xl shadow-2xl mb-6">
              <QRCodeCanvas 
                value={qrContent}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-8">Scan to verify<br/>reservation</p>
            
            <div className="mt-auto hidden md:block">
               <p className="text-[24px] font-bold text-amber-500 tracking-tighter">T-{reservation.table}</p>
               <p className="text-[9px] text-white/20 uppercase tracking-widest">{getTableType(reservation.table)}</p>
            </div>

            <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"><X size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
