import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useCallback } from 'react';
import { Role, ROLES } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RoleCardProps {
  role: Role;
  isActive: boolean;
  position: number; // 0 is center, -1 is left, 1 is right, etc.
  onHover: (role: Role | null) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, isActive, position, onHover }) => {
  const Icon = role.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  // Calculate transforms based on position
  // position 0: scale 1, rotateY 0, translateZ 100
  // position -1, 1: scale 0.8, rotateY -55/55, translateZ -200
  // position -2, 2: scale 0.7, rotateY -60/60, translateZ -400

  const rotationY = position * 55;
  const z = position === 0 ? 100 : -Math.abs(position) * 200;
  const x = position * 260;
  const scale = position === 0 ? (isHovered ? 1.05 : 1) : 0.8;
  const opacity = position === 0 ? 1 : 0.4 - Math.abs(position) * 0.1;
  const blur = position === 0 ? 0 : Math.abs(position) * 1.5;

  return (
    <motion.div
      layout
      id={`role-card-${role.id}`}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(role);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      initial={false}
      animate={{
        x,
        z,
        rotateY: rotationY,
        scale,
        opacity,
        filter: `blur(${blur}px)`,
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 25,
      }}
      className="absolute flex items-center justify-center w-72 h-96 select-none cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div 
        className={`
          relative w-full h-full rounded-2xl p-8 border transition-all duration-500
          flex flex-col items-center justify-center gap-6 overflow-hidden
          ${isActive || isHovered ? 'bg-slate-900/80 border-2 backdrop-blur-xl' : 'bg-slate-900/40 border backdrop-blur-sm'}
        `}
        style={{
          borderColor: isActive || isHovered ? role.color : `${role.color}44`,
          boxShadow: isActive || isHovered ? `0 0 50px -10px ${role.color}99` : 'none',
        }}
      >
        {/* Glow Background Pulse */}
        {(isActive || isHovered) && (
          <motion.div
            animate={{ 
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${role.color}44 0%, transparent 70%)` }}
          />
        )}

        {/* Floating Animation for Active Card */}
        <motion.div
          animate={isActive ? { y: [0, -10, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex flex-col items-center gap-6"
        >
          <div 
            className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden"
            style={{ 
              backgroundColor: `${role.color}11`,
              borderColor: `${role.color}44`,
              boxShadow: isActive ? `0 0 20px ${role.color}44` : 'none' 
            }}
          >
            {isActive && (
              <motion.div 
                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-white/20"
                style={{ borderColor: role.color }}
              />
            )}
            <Icon size={40} color={role.color} strokeWidth={1.5} />
          </div>

          <div className="text-center">
            <motion.h3 
              className="text-3xl font-light tracking-widest text-white mb-2"
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
            >
              {role.title}
            </motion.h3>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: `${role.color}cc` }}>
              {role.id === 'doctor' ? 'Clinical Specialist' : role.id === 'admin' ? 'System Architecture' : (role.id === 'receptionist' || role.id === 'reception') ? 'Patient Management' : role.id === 'security' ? 'Facility Protocol' : 'Emergency Logistics'}
            </p>
          </div>
        </motion.div>

        {/* Info detail for active card */}
        <AnimatePresence>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full pt-4 border-t border-white/10 text-center"
              style={{ borderColor: `${role.color}33` }}
            >
              <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-wider">
                {role.description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Decoration Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/20" />

        {/* Active Corner Glows */}
        {isActive && (
          <>
            <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2`} style={{ borderColor: role.color }} />
            <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2`} style={{ borderColor: role.color }} />
            <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2`} style={{ borderColor: role.color }} />
            <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2`} style={{ borderColor: role.color }} />
          </>
        )}

        {/* Light Reflection Sweep */}
        {isActive && (
          <motion.div 
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
          />
        )}
      </div>
    </motion.div>
  );
};

export const Carousel: React.FC<{ 
  onRoleSelect: (role: Role) => void;
  onRoleHover: (role: Role | null) => void;
}> = ({ onRoleSelect, onRoleHover }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Doctor (index 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const next = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % ROLES.length);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + ROLES.length) % ROLES.length);
  }, []);

  useEffect(() => {
    onRoleSelect(ROLES[activeIndex]);
  }, [activeIndex, onRoleSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) next();
      else if (e.deltaY < 0) prev();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [next, prev]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  const [dragStart, setDragStart] = useState<number | null>(null);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const x = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    setDragStart(x);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStart === null) return;
    const x = 'changedTouches' in e ? (e as React.TouchEvent).changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = dragStart - x;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    setDragStart(null);
  };

  return (
    <div 
      id="carousel-container"
      className="relative w-full h-[600px] flex items-center justify-center perspective-[1000px] cursor-grab active:cursor-grabbing touch-none"
      onMouseMove={handleMouseMove}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <motion.div
        id="carousel-stage"
        animate={{
          rotateX: -mousePos.y * 0.2,
          rotateY: mousePos.x * 0.2,
        }}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {ROLES.map((role, index) => {
          // Calculate relative position (-2, -1, 0, 1, 2)
          let position = index - activeIndex;
          
          // Handle circular wrap
          if (position > 2) position -= ROLES.length;
          if (position < -2) position += ROLES.length;

          return (
            <RoleCard
              key={role.id}
              role={role}
              isActive={index === activeIndex}
              position={position}
              onHover={onRoleHover}
            />
          );
        })}
      </motion.div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-10 pointer-events-none z-30">
        <button 
          onClick={prev}
          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto backdrop-blur-md"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={next}
          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all pointer-events-auto backdrop-blur-md"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Nav Indicator Dots */}
      <div className="absolute bottom-10 flex gap-4 opacity-40">
        {ROLES.map((role, index) => (
          <motion.div
            key={role.id}
            animate={{ 
              scale: index === activeIndex ? 1.2 : 1,
              backgroundColor: index === activeIndex ? role.color : 'transparent',
              borderColor: role.color
            }}
            className="w-2 h-2 rounded-full border"
            style={{ borderColor: role.color }}
          />
        ))}
      </div>
    </div>
  );
};
