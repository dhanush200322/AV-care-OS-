import React, { useEffect, useState } from 'react';
import { useSpring, useTransform } from 'motion/react';
export const AnimatedCounter: React.FC<{ value: number; suffix?: string; decimals?: number }> = ({ value, suffix = '', decimals = 0 }) => {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()));
  const [text, setText] = useState('0');
  useEffect(() => { spring.set(value); return display.on('change', (v) => setText(String(v))); }, [value, spring, display]);
  return <span className="tabular-nums">{text}{suffix}</span>;
};
