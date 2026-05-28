import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Shield, Camera, Save, MapPin, CheckCircle2, ZoomIn, RotateCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';

// --- Premium Inline Canvas Cropper Modal Component ---
interface CropModalProps {
  imageSrc: string;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
}

const CropModal: React.FC<CropModalProps> = ({ imageSrc, onCrop, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Mouse pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - offset.x, y: e.touches[0].clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear transparent background
    ctx.clearRect(0, 0, 300, 300);

    // Apply translation to center to support smooth rotation and panning offsets
    ctx.translate(150, 150);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image scaling to fit crop region boundaries nicely
    const drawWidth = 300 * zoom;
    const drawHeight = 300 * zoom;

    ctx.drawImage(
      img,
      -drawWidth / 2 + offset.x,
      -drawHeight / 2 + offset.y,
      drawWidth,
      drawHeight
    );

    // Generate output circular data URL
    const croppedUrl = canvas.toDataURL('image/png');
    onCrop(croppedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#090b1c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 z-10"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-purple-400" />
            <span className="text-xs font-black tracking-widest text-white uppercase">Position & Crop Avatar</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 px-1.5 text-xs text-white/50 hover:text-white bg-white/5 rounded cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Cropper viewport window */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="relative w-72 h-72 mx-auto rounded-2xl overflow-hidden bg-slate-950 border border-white/5 flex items-center justify-center cursor-move select-none group"
        >
          {/* Active Image loaded dynamically */}
          <img 
            ref={imageRef}
            src={imageSrc} 
            alt="Source preview to crop"
            draggable={false}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />

          {/* Holographic Circular crop mask */}
          <div className="absolute inset-0 border-[32px] border-slate-950/80 pointer-events-none flex items-center justify-center">
            <div className="w-[220px] h-[220px] rounded-full border-2 border-dashed border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] pointer-events-none" />
          </div>
          
          <div className="absolute top-3 left-3 bg-slate-950/80 px-2.5 py-0.5 rounded text-[8px] font-black uppercase text-white/40 tracking-wider">
            Drag to pan image
          </div>
        </div>

        {/* Adjustments Controls */}
        <div className="mt-6 space-y-4">
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><ZoomIn size={12} /> Scale Zoom</span>
              <span className="text-cyan-400 font-mono">{zoom.toFixed(2)}x</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="3" 
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rotate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><RotateCw size={12} /> Rotation Angle</span>
              <span className="text-purple-400 font-mono">{rotation}°</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="360" 
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Action button triggers */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
          <button 
            onClick={onClose}
            className="w-1/3 py-3 rounded-xl border border-white/10 hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={handleApplyCrop}
            className="w-2/3 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-950/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={12} /> Apply Crop
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Module ---
export const ProfileModule: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Cropper states
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Toast status
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize input states from profile context
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || 'Admin User');
      setEmail(profile.email || 'admin@avcare.os');
      setPhone(profile.phone || '+91 98765 43210');
      setLocation(profile.location || 'HQ Terminal, Floor 4');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setRawImageSrc(base64String); // Open cropper modal
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBase64: string) => {
    setAvatarUrl(croppedBase64); // Save cropped base64 directly to profile preview
  };

  const handleSave = async () => {
    if (isEditing && updateProfile) {
      await updateProfile({
        full_name: fullName,
        email: email,
        phone: phone,
        location: location,
        avatar_url: avatarUrl,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-[200] p-4 pr-12 rounded-xl border bg-emerald-500/10 border-emerald-500/20 backdrop-blur-3xl shadow-2xl flex items-center gap-3 min-w-[280px]"
          >
            <div className="p-2 rounded-lg border bg-emerald-500/20 text-emerald-400 border-emerald-500/20">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-0.5">System Protocol</p>
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Profile Config Updated Successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {rawImageSrc && (
          <CropModal 
            imageSrc={rawImageSrc} 
            onCrop={handleCropComplete} 
            onClose={() => setRawImageSrc(null)} 
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Admin Profile</h2>
          <p className="text-slate-400 text-sm">Manage your personal information, contact credentials, and avatar skin.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 border border-transparent rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-950/20 transition-all cursor-pointer select-none"
        >
          {isEditing ? <><Save size={14} /> Save Changes</> : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-[#0f1225] border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-4 self-center md:self-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center p-0.5 shadow-2xl relative overflow-hidden">
                <div className="w-full h-full bg-[#0f1225] rounded-[22px] flex items-center justify-center overflow-hidden relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover rounded-[22px]" />
                  ) : (
                    <User size={48} className="text-slate-400" />
                  )}
                </div>
              </div>
              
              {/* Hidden file selector */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {isEditing && (
                <button 
                  onClick={handleCameraClick}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-cyan-500 hover:bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-lg transition-all cursor-pointer border border-white/10"
                  title="Upload avatar image from desktop"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Shield size={10} />
              Admin Executive
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-sans">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold" 
                />
              ) : (
                <p className="text-white font-bold text-base border border-transparent px-4 py-2 bg-white/[0.01] rounded-xl">{fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
              {isEditing ? (
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold" 
                />
              ) : (
                <div className="flex items-center gap-3 text-white font-bold text-base border border-transparent px-4 py-2 bg-white/[0.01] rounded-xl">
                   <Mail size={16} className="text-slate-500" /> {email}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold" 
                />
              ) : (
                <div className="flex items-center gap-3 text-white font-bold text-base border border-transparent px-4 py-2 bg-white/[0.01] rounded-xl">
                   <Phone size={16} className="text-slate-500" /> {phone}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HQ Location Office</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-all font-bold" 
                />
              ) : (
                <div className="flex items-center gap-3 text-white font-bold text-base border border-transparent px-4 py-2 bg-white/[0.01] rounded-xl">
                   <MapPin size={16} className="text-slate-500" /> {location}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative background glows */}
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none" />
      </div>
    </div>
  );
};
