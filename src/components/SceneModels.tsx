import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  MeshDistortMaterial, 
  Sphere, 
  Torus, 
  Ring, 
  Points, 
  PointMaterial, 
  Stars,
  PerspectiveCamera,
  Environment
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RoleId } from '../types';

const SignalPulses = ({ color }: { color: string }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 20;
  
  const [positions, speeds, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const off = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      spd[i] = 0.001 + Math.random() * 0.003;
      off[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, off];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        // Linear outward pulse
        const progress = (t * speeds[i] * 30 + offsets[i]) % 1;
        const r = 1.2 + progress * 2.8; 
        
        const angle1 = i * (Math.PI * 2 / count);
        const angle2 = Math.cos(i * 1.5) * Math.PI;
        
        pos[i * 3] = r * Math.sin(angle2) * Math.cos(angle1);
        pos[i * 3 + 1] = r * Math.sin(angle2) * Math.sin(angle1);
        pos[i * 3 + 2] = r * Math.cos(angle2);
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef}>
      <PointMaterial
        transparent
        color={color}
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3}
      />
    </Points>
  );
};

const NeuralBrain = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.PointLight>(null);
  
  const particlesCount = 80;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = 2.0 + Math.random() * 0.4;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // EXACT Constant 12-second rotation (Linear)
      groupRef.current.rotation.y = t * (Math.PI * 2 / 12); 
      // Subtle float (±0.05 units)
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.05;
    }
    
    if (pulseRef.current) {
      pulseRef.current.intensity = 8 + Math.sin(t * 1.5) * 4;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Human Anatomical Hemispheres (Left) */}
      <mesh position={[-0.45, 0, 0]} rotation={[0, 0, Math.PI / 15]}>
        <torusKnotGeometry args={[1.0, 0.55, 200, 32, 2, 3]} />
        <meshPhysicalMaterial 
          color="#6C2BD9"
          emissive="#1e1b4b"
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.1}
          transmission={0.4}
          thickness={1.5}
          ior={1.4}
          attenuationColor="#6C2BD9"
          attenuationDistance={0.5}
        />
      </mesh>

      {/* Human Anatomical Hemispheres (Right) */}
      <mesh position={[0.45, 0, 0]} rotation={[0, 0, -Math.PI / 15]}>
        <torusKnotGeometry args={[1.0, 0.55, 200, 32, 2, 3]} />
        <meshPhysicalMaterial 
          color="#6C2BD9"
          emissive="#1e1b4b"
          emissiveIntensity={0.5}
          roughness={0.25}
          metalness={0.1}
          transmission={0.4}
          thickness={1.5}
          ior={1.4}
          attenuationColor="#6C2BD9"
          attenuationDistance={0.5}
        />
      </mesh>

      {/* Internal Core Soft Glow */}
      <Sphere args={[0.7, 32, 32]}>
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={2} transparent opacity={0.6} />
        <pointLight ref={pulseRef} color="#A78BFA" distance={8} intensity={10} />
      </Sphere>

      {/* Subtle Aura Fog */}
      <Sphere args={[3.0, 32, 32]}>
        <meshStandardMaterial 
          color="#6C2BD9" 
          transparent 
          opacity={0.015} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <SignalPulses color="#A78BFA" />

      {/* Floating Sparkles (Sparse) */}
      <Points positions={positions}>
        <PointMaterial
          transparent
          color="#F5F3FF"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.2}
        />
      </Points>
    </group>
  );
};
const ECGBg = ({ color }: { color: string }) => {
  const lineRef = useRef<THREE.Line>(null);
  const count = 100;
  
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3((i - count / 2) * 0.4, 0, 0));
    }
    return p;
  }, []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const lineObj = useMemo(() => {
    const l = new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.15, 
      blending: THREE.AdditiveBlending 
    }));
    return l;
  }, [geometry, color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pos = lineObj.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
        const x = (i - count / 2) * 0.4;
        // Scroll effect
        const scrollX = (x + t * 2) % (count * 0.4);
        // ECG wave logic
        let y = 0;
        const cycle = Math.abs(scrollX % 4);
        if (cycle < 0.2) y = Math.sin(cycle * Math.PI * 5) * 0.5; // P wave
        else if (cycle < 0.3) y = 0;
        else if (cycle < 0.45) y = -Math.sin((cycle - 0.3) * Math.PI * 6.66) * 0.3; // Q
        else if (cycle < 0.6) y = Math.sin((cycle - 0.45) * Math.PI * 6.66) * 2.5; // R
        else if (cycle < 0.75) y = -Math.sin((cycle - 0.6) * Math.PI * 6.66) * 0.8; // S
        else if (cycle < 1.2) y = Math.sin((cycle - 0.75) * Math.PI * 2.22) * 0.4; // T
        
        pos[i * 3 + 1] = y * 0.5;
    }
    lineObj.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <primitive object={lineObj} position={[0, -1, -5]} />
  );
};

const MedicalPatterns = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {/* Large radial rings */}
      <Ring args={[4.5, 4.52, 64]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#B11226" transparent opacity={0.05} />
      </Ring>
      <Ring args={[3.8, 3.81, 64]} rotation={[0, 0, 0]}>
        <meshBasicMaterial color="#B11226" transparent opacity={0.03} />
      </Ring>
      
      {/* Floating Hexagons */}
      {[...Array(6)].map((_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <mesh position={[5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <circleGeometry args={[0.4, 6]} />
            <meshBasicMaterial color="#B11226" transparent opacity={0.05} wireframe />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const NeuralHeart = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.PointLight>(null);
  const atrialRef = useRef<THREE.Group>(null);
  
  const particlesCount = 30;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const r = 2.0 + Math.random() * 0.6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const entryFade = Math.min(1, Math.max(0, (t - 1.5) * 2)); 
    
    // Heartbeat: 68 BPM (1.13 Hz)
    const freq = 1.13;
    const phase = (t * freq) % 1;
    
    // Ventricular pulse (Main pumping beat)
    const vBeat = Math.pow(Math.sin(phase * Math.PI), 24) * 0.05 * entryFade;
    // Atrial pulse (Slightly before ventricles)
    const aPhase = ((t + 0.15) * freq) % 1;
    const aBeat = Math.pow(Math.sin(aPhase * Math.PI), 30) * 0.03 * entryFade;
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04; 
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
    }
    
    if (coreRef.current) {
      const s = 1 + vBeat;
      coreRef.current.scale.set(s, s, s);
      coreRef.current.rotation.z = 0.1 + vBeat * 0.05;
    }

    if (atrialRef.current) {
      const s = 1 + aBeat;
      atrialRef.current.scale.set(s, s, s);
    }
    
    if (pulseRef.current) {
      pulseRef.current.intensity = (2 + vBeat * 60) * Math.max(0.2, entryFade);
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={coreRef} rotation={[0.4, 0, 0]}>
        {/* Holographic Platform */}
        <group position={[0, -1.8, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.3, 64]} />
            <meshBasicMaterial color="#6C2BD9" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <ringGeometry args={[0, 1.1, 64]} />
            <meshBasicMaterial color="#6C2BD9" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
          </mesh>
          <pointLight color="#6C2BD9" intensity={2} distance={3} />
        </group>

        {/* Ventricular Base (Lower major mass) */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, 0.1]}>
          <sphereGeometry args={[1.0, 64, 64]} />
          <meshPhysicalMaterial 
            color="#B11226" 
            emissive="#450a0a"
            emissiveIntensity={0.5}
            roughness={0.15}
            metalness={0.1}
            transmission={0.3}
            thickness={2.5}
            ior={1.45}
            attenuationColor="#B11226"
            attenuationDistance={0.5}
          />
        </mesh>

        {/* Right Ventricle bulge */}
        <mesh position={[-0.4, -0.4, 0.2]} rotation={[0, -0.5, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial color="#991b1b" roughness={0.3} transmission={0.2} thickness={1} />
        </mesh>

        {/* Atrial Region (Upper chambers) */}
        <group ref={atrialRef} position={[0, 0.5, 0.1]}>
          {/* Left Atrium */}
          <mesh position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshPhysicalMaterial color="#7f1d1d" roughness={0.4} transmission={0.2} />
          </mesh>
          {/* Right Atrium */}
          <mesh position={[-0.3, -0.1, 0.2]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshPhysicalMaterial color="#7f1d1d" roughness={0.4} transmission={0.2} />
          </mesh>
        </group>

        {/* Aorta Arch - The major medical identifier */}
        <mesh position={[0.2, 0.9, -0.2]} rotation={[0, 0.4, Math.PI / 2.8]}>
          <torusGeometry args={[0.55, 0.22, 20, 100, Math.PI * 0.95]} />
          <meshPhysicalMaterial color="#B11226" roughness={0.1} emissive="#450a0a" emissiveIntensity={1} />
        </mesh>

        {/* Branches of Aorta */}
        <mesh position={[0.5, 1.4, -0.1]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
          <meshStandardMaterial color="#B11226" />
        </mesh>
        <mesh position={[0.7, 1.35, -0.2]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          <meshStandardMaterial color="#B11226" />
        </mesh>

        {/* Pulmonary Artery Assembly */}
        <mesh position={[-0.3, 0.8, 0.3]} rotation={[0.2, -0.4, -0.6]}>
          <cylinderGeometry args={[0.2, 0.2, 1.2, 32]} />
          <meshStandardMaterial color="#B11226" emissive="#450a0a" emissiveIntensity={0.5} />
        </mesh>

        {/* Superior Vena Cava */}
        <mesh position={[-0.5, 0.7, 0.4]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
          <meshStandardMaterial color="#2d3480" />
        </mesh>

        <pointLight ref={pulseRef} color="#6C2BD9" distance={15} intensity={5} />
      </group>

      {/* Internal "Vital Thread" Glow */}
      <Sphere args={[0.4, 32, 32]}>
        <meshStandardMaterial color="#6C2BD9" emissive="#6C2BD9" emissiveIntensity={4} transparent opacity={0.3} />
      </Sphere>

      {/* Atmospheric Halo */}
      <Sphere args={[3.2, 32, 32]}>
        <meshStandardMaterial 
          color="#6C2BD9" 
          transparent 
          opacity={0.015} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <SignalPulses color="#B11226" />
      <ECGBg color="#B11226" />
      <MedicalPatterns />

      {/* Minimal Floating Sparks */}
      <Points positions={positions}>
        <PointMaterial
          transparent
          color="#6C2BD9"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.1}
        />
      </Points>
    </group>
  );
};


const FlowPanels = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 6) * 4, Math.sin(i * 1.2) * 2, Math.sin(i * Math.PI / 6) * 4]} rotation={[0, -i * Math.PI / 6, 0]}>
          <planeGeometry args={[1.5, 0.8]} />
          <meshStandardMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} wireframe emissive={color} emissiveIntensity={1} />
        </mesh>
      ))}
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial color={color} wireframe opacity={0.1} transparent />
      </Sphere>
      <Stars radius={50} depth={50} count={500} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

const SecurityShield = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 1.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <octahedronGeometry args={[2.2, 3]} />
        <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.9, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const AmbulanceResponse = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ambulanceRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Points>(null);
  const streaksRef = useRef<THREE.Group>(null);
  
  const ecgCount = 200;
  const trailCount = 50;
  
  const [ecgPoints, trailPositions] = useMemo(() => {
    const points = [];
    for (let i = 0; i < ecgCount; i++) {
      points.push(new THREE.Vector3((i - ecgCount / 2) * 0.15, 0, 0));
    }
    const trailPos = new Float32Array(trailCount * 3);
    return [points, trailPos];
  }, []);

  const ecgGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(ecgPoints), [ecgPoints]);

  const ecgLine = useMemo(() => new THREE.Line(ecgGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending })), [ecgGeo, color]);
  const ecgGlowLine = useMemo(() => new THREE.Line(ecgGeo, new THREE.LineBasicMaterial({ color: '#00FFC6', transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })), [ecgGeo]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const posAttrib = ecgGeo.attributes.position.array as Float32Array;
    
    // Animate ECG Path (Infinite Loop)
    for (let i = 0; i < ecgCount; i++) {
        const x = (i - ecgCount / 2) * 0.15;
        const scrollX = (x + t * 4) % (ecgCount * 0.15);
        let y = 0;
        const cycle = Math.abs(scrollX % 6);
        if (cycle < 0.3) y = Math.sin(cycle * Math.PI * 3.33) * 0.8; // P
        else if (cycle < 0.45) y = 0;
        else if (cycle < 0.6) y = -Math.sin((cycle - 0.45) * Math.PI * 6.66) * 0.5; // Q
        else if (cycle < 0.8) y = Math.sin((cycle - 0.6) * Math.PI * 5) * 4; // R (High Pulse)
        else if (cycle < 1.0) y = -Math.sin((cycle - 0.8) * Math.PI * 5) * 1.2; // S
        else if (cycle < 1.6) y = Math.sin((cycle - 1.0) * Math.PI * 1.66) * 0.6; // T
        
        posAttrib[i * 3 + 1] = y * 0.4;
        posAttrib[i * 3 + 2] = Math.sin(t + x * 0.5) * 0.5; // Z-axis wave
    }
    ecgGeo.attributes.position.needsUpdate = true;

    // Movement of Ambulance Hologram
    if (ambulanceRef.current) {
      const speed = 2;
      const xPos = (t * speed) % 10 - 5;
      ambulanceRef.current.position.x = xPos;
      
      // Sample height from ECG logic
      const cycle = Math.abs((xPos + t * 4) % 6);
      let y = 0;
      if (cycle < 0.3) y = Math.sin(cycle * Math.PI * 3.33) * 0.8;
      else if (cycle < 0.45) y = 0;
      else if (cycle < 0.6) y = -Math.sin((cycle - 0.45) * Math.PI * 6.66) * 0.5;
      else if (cycle < 0.8) y = Math.sin((cycle - 0.6) * Math.PI * 5) * 4;
      else if (cycle < 1.0) y = -Math.sin((cycle - 0.8) * Math.PI * 5) * 1.2;
      else if (cycle < 1.6) y = Math.sin((cycle - 1.0) * Math.PI * 1.66) * 0.6;
      
      ambulanceRef.current.position.y = y * 0.4;
      ambulanceRef.current.position.z = Math.sin(t + xPos * 0.5) * 0.5;
      ambulanceRef.current.rotation.z = Math.sin(t * 10) * 0.05; // Shaking/Speed effect
    }

    // Streaks in background
    if (streaksRef.current) {
      streaksRef.current.children.forEach((streak) => {
        streak.position.x -= 0.2;
        if (streak.position.x < -10) streak.position.x = 10;
      });
    }

    // Parallax
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 2, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 1, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D ECG Trail Path */}
      <primitive object={ecgLine} />
      <primitive object={ecgGlowLine} position={[0, 0, 0.1]} />

      {/* Ambulance Hologram */}
      <group ref={ambulanceRef}>
        <mesh>
          <boxGeometry args={[0.8, 0.4, 0.4]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial color="#fff" emissive={color} emissiveIntensity={5} />
        </mesh>
        {/* Lights */}
        <pointLight color={color} intensity={10} distance={5} />
        <pointLight position={[0.4, 0.1, 0.2]} color="#fff" intensity={2} distance={1} />
        <pointLight position={[0.4, 0.1, -0.2]} color="#fff" intensity={2} distance={1} />
      </group>

      {/* Radar Signal Pulses */}
      <RadarWave color={color} />
      <RadarWave color="#00FFC6" />

      {/* Speed Streaks */}
      <group ref={streaksRef}>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, -5]}>
            <planeGeometry args={[1, 0.02]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>

      {/* Data Nodes */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 3 - 6, Math.sin(i) * 2, -2]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#00FFC6" />
          <pointLight color="#00FFC6" intensity={2} distance={2} />
        </mesh>
      ))}

      {/* Floor Grid */}
      <group position={[0, -4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 20, 20, 20]} />
          <meshStandardMaterial color={color} wireframe transparent opacity={0.05} />
        </mesh>
      </group>
    </group>
  );
};

const DataNetwork = () => {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMeshRef = useRef<THREE.InstancedMesh>(null);
  const packetMeshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.Group>(null);

  const nodeCount = 40;
  const edgeCount = 60;
  const packetCount = 20;

  const nodes = useMemo(() => {
    return [...Array(nodeCount)].map((_, i) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      ),
      phase: Math.random() * Math.PI * 2,
      birth: Math.random() * 5,
      life: 10 + Math.random() * 10,
      role: Math.random() > 0.7 ? 'processing' : 'active'
    }));
  }, []);

  const edges = useMemo(() => {
    const e = [];
    for (let i = 0; i < edgeCount; i++) {
      const idx1 = Math.floor(Math.random() * nodeCount);
      let idx2 = Math.floor(Math.random() * nodeCount);
      if (idx1 === idx2) idx2 = (idx1 + 1) % nodeCount;
      e.push({ from: idx1, to: idx2, speed: 0.2 + Math.random() * 0.5 });
    }
    return e;
  }, [nodes]);

  const packets = useMemo(() => {
    return [...Array(packetCount)].map((_, i) => ({
      edgeIdx: Math.floor(Math.random() * edgeCount),
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.004
    }));
  }, [edges]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Nodes animation with lifecycle
    if (nodeMeshRef.current) {
      nodes.forEach((node, i) => {
        const age = (t + node.birth) % node.life;
        const visibility = age < 1 ? age : (age > node.life - 1 ? node.life - age : 1);
        const s = (0.08 + Math.pow(Math.sin(t + node.phase), 10) * 0.04) * visibility;
        
        dummy.position.copy(node.pos);
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();
        nodeMeshRef.current!.setMatrixAt(i, dummy.matrix);
        
        const color = node.role === 'processing' ? new THREE.Color("#4F46E5") : new THREE.Color("#00FFC6");
        const pulse = Math.sin(t * 3 + node.phase);
        if (pulse > 0.8) color.set("#22C55E"); 
        if (pulse < -0.9) color.set("#EF4444").multiplyScalar(0.2); // rare alert
        
        nodeMeshRef.current!.setColorAt(i, color);
      });
      nodeMeshRef.current.instanceMatrix.needsUpdate = true;
      if (nodeMeshRef.current.instanceColor) nodeMeshRef.current.instanceColor.needsUpdate = true;
    }

    // Packets animation
    if (packetMeshRef.current) {
      packets.forEach((p, i) => {
        const edge = edges[p.edgeIdx];
        p.progress = (p.progress + p.speed) % 1;
        const start = nodes[edge.from].pos;
        const end = nodes[edge.to].pos;
        
        const ageFrom = (t + nodes[edge.from].birth) % nodes[edge.from].life;
        const ageTo = (t + nodes[edge.to].birth) % nodes[edge.to].life;
        const edgeVisibility = Math.min(
          ageFrom < 1 ? ageFrom : 1, 
          ageTo < 1 ? ageTo : 1,
          nodes[edge.from].life - ageFrom < 1 ? nodes[edge.from].life - ageFrom : 1,
          nodes[edge.to].life - ageTo < 1 ? nodes[edge.to].life - ageTo : 1
        );

        dummy.position.lerpVectors(start, end, p.progress);
        const pSize = 0.04 * Math.max(0, edgeVisibility);
        dummy.scale.set(pSize, pSize, pSize);
        dummy.updateMatrix();
        packetMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      packetMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // Lines pulse animation tied to node visibility
    if (linesRef.current) {
      linesRef.current.children.forEach((line, i) => {
        const edge = edges[i];
        const ageFrom = (t + nodes[edge.from].birth) % nodes[edge.from].life;
        const ageTo = (t + nodes[edge.to].birth) % nodes[edge.to].life;
        const edgeVisibility = Math.min(
          ageFrom < 1 ? ageFrom : 1, 
          ageTo < 1 ? ageTo : 1,
          nodes[edge.from].life - ageFrom < 1 ? nodes[edge.from].life - ageFrom : 1,
          nodes[edge.to].life - ageTo < 1 ? nodes[edge.to].life - ageTo : 1
        );
        (line as any).material.opacity = Math.max(0, edgeVisibility) * (0.05 + Math.pow(Math.sin(t * (edge.speed || 1) + i), 20) * 0.2);
      });
    }

    // Camera drift & parallax
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.1;
      groupRef.current.rotation.x = Math.cos(t * 0.1) * 0.05;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 0.5, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 0.5, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Grid Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial color="#00FFC6" wireframe transparent opacity={0.02} />
      </mesh>

      {/* Nodes */}
      <instancedMesh ref={nodeMeshRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial transparent opacity={0.8} />
      </instancedMesh>

      {/* Connection Lines */}
      <group ref={linesRef}>
        {edges.map((edge, i) => (
          <line key={i}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  nodes[edge.from].pos.x, nodes[edge.from].pos.y, nodes[edge.from].pos.z,
                  nodes[edge.to].pos.x, nodes[edge.to].pos.y, nodes[edge.to].pos.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#4F46E5" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>

      {/* Data Packets */}
      <instancedMesh ref={packetMeshRef} args={[undefined, undefined, packetCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#00FFC6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </instancedMesh>

      {/* Ambient Flow background */}
      <ECGBg color="#00FFC6" />
    </group>
  );
};

const NeuralSphere = ({ color }: { color: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const nodesRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const pulseRef = useRef<THREE.PointLight>(null);

  const particlesCount = 120;
  const [particlesPos, particlesSpeeds] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const spd = new Float32Array(particlesCount);
    for (let i = 0; i < particlesCount; i++) {
      const r = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      spd[i] = 0.005 + Math.random() * 0.01;
    }
    return [pos, spd];
  }, []);

  const nodeLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 20; i++) {
      const p1 = new THREE.Vector3().setFromSphericalCoords(2.5, Math.random() * Math.PI, Math.random() * Math.PI * 2);
      const p2 = new THREE.Vector3().setFromSphericalCoords(2.5, Math.random() * Math.PI, Math.random() * Math.PI * 2);
      lines.push({ p1, p2, speed: 0.5 + Math.random() });
    }
    return lines;
  }, []);

  const shapes = useMemo(() => {
    return [...Array(8)].map(() => ({
      pos: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      speed: 0.1 + Math.random() * 0.2,
      scale: 0.3 + Math.random() * 0.4
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth Y rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }

    // Node connections animation (opacity pulse)
    if (nodesRef.current) {
      nodesRef.current.children.forEach((child, i) => {
        (child as any).material.opacity = (Math.sin(t * nodeLines[i].speed) + 1) * 0.1;
      });
    }

    // Breathing glow & pulse sync
    const pulseFactor = Math.pow(Math.sin(t * 1.5), 12);
    if (pulseRef.current) {
      pulseRef.current.intensity = 5 + pulseFactor * 15;
    }

    // Particles moving outward
    if (particlesRef.current) {
      const posArr = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const x = posArr[i * 3];
        const y = posArr[i * 3 + 1];
        const z = posArr[i * 3 + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        
        // Outward vector
        const vx = x / dist;
        const vy = y / dist;
        const vz = z / dist;
        
        posArr[i * 3] += vx * 0.01;
        posArr[i * 3 + 1] += vy * 0.01;
        posArr[i * 3 + 2] += vz * 0.01;

        if (dist > 6) {
          const r = 2.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          posArr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          posArr[i * 3 + 2] = r * Math.cos(phi);
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Orbiting shapes
    if (shapesRef.current) {
      shapesRef.current.children.forEach((child, i) => {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
        child.position.y += Math.sin(t + i) * 0.005;
      });
    }

    // Parallax
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 0.5, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 0.5, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Neural Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial 
          color="#00ffff" 
          wireframe 
          transparent 
          opacity={0.3} 
          emissive="#00ffff" 
          emissiveIntensity={1} 
        />
        <pointLight ref={pulseRef} color="#00ffff" distance={10} />
      </mesh>

      {/* Node Connections */}
      <group ref={nodesRef}>
        {nodeLines.map((line, i) => (
          <line key={i}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([line.p1.x, line.p1.y, line.p1.z, line.p2.x, line.p2.y, line.p2.z])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#00ffff" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>

      {/* Internal Glow */}
      <Sphere args={[2.4, 32, 32]}>
        <meshStandardMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.05} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* ECG Background Integration */}
      <group position={[0, 0, -1]}>
        <ECGBg color="#00ffff" />
      </group>

      {/* Holographic Base */}
      <group position={[0, -3.2, 0]}>
        <Ring args={[2.8, 2.9, 64]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.4} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[3.2, 3.25, 64]} rotation={[0, 0.5, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} side={THREE.DoubleSide} />
        </Ring>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <circleGeometry args={[3, 64]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Orbiting Shapes */}
      <group ref={shapesRef}>
        {shapes.map((s, i) => (
          <mesh key={i} position={s.pos as any} rotation={s.rot as any} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#00ffff" wireframe transparent opacity={0.3} />
          </mesh>
        ))}
      </group>

      {/* Particles */}
      <Points positions={particlesPos} ref={particlesRef}>
        <PointMaterial
          transparent
          color="#00ffff"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
};

const CCTVUnit = ({ position, rotation, color }: { position: [number, number, number], rotation: [number, number, number], color: string }) => {
  const headRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const [targetReach, setTargetReach] = React.useState(0);

  const lineObj = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-position[0], -position[1], -position[2])
    ]);
    const material = new THREE.LineBasicMaterial({ 
      color, 
      transparent: true, 
      opacity: 0.1, 
      blending: THREE.AdditiveBlending 
    });
    return new THREE.Line(geometry, material);
  }, [position, color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5 + position[0]) * 0.4;
      const focus = Math.sin(t * 2) > 0.95;
      setTargetReach(THREE.MathUtils.lerp(targetReach, focus ? 1 : 0, 0.05));
    }
    if (beamRef.current) {
      beamRef.current.scale.set(1, 1 + targetReach * 0.5, 1);
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.05 + targetReach * 0.1;
    }
    if (lineObj) {
      (lineObj.material as THREE.LineBasicMaterial).opacity = 0.05 + Math.sin(t * 3 + position[0]) * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <primitive object={lineObj} />
      <mesh>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.2} />
      </mesh>
      <group ref={headRef} position={[0, 0.15, 0]}>
        <mesh>
          <boxGeometry args={[0.4, 0.3, 0.6]} />
          <meshStandardMaterial color="#1a1a1a" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.31]}>
          <circleGeometry args={[0.15, 32]} />
          <meshBasicMaterial color={color} />
          <pointLight color={color} intensity={0.5} distance={2} />
        </mesh>
        <mesh ref={beamRef} position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.8, 5, 32, 1, true]} />
          <meshBasicMaterial color={color} transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

const RadarWave = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.5) % 1;
    if (meshRef.current) {
      meshRef.current.scale.set(1 + t * 5, 1 + t * 5, 1);
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.2;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
};

const SecurityLock = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.PointLight>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  const particlesCount = 40;
  const [particlesPos] = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 3.5 + Math.random() * 1.5;
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return [pos];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
      // Parallax
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 0.5, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 0.5, 0.05);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -t * 0.3;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }

    if (pulseRef.current) {
      pulseRef.current.intensity = 5 + Math.pow(Math.sin(t * 1.0), 10) * 15;
    }

    if (scanRef.current) {
      scanRef.current.position.y = Math.sin(t * 0.8) * 3;
      (scanRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Glass Shell */}
      <mesh>
        <boxGeometry args={[3, 4, 1.2]} />
        <meshPhysicalMaterial 
          color="#00FFC6"
          transparent
          opacity={0.1}
          transmission={0.9}
          roughness={0.1}
          thickness={1}
          ior={1.5}
        />
      </mesh>

      {/* Metallic Frame */}
      <mesh>
        <boxGeometry args={[3.2, 4.2, 0.8]} />
        <meshStandardMaterial color="#4F46E5" wireframe transparent opacity={0.2} metalness={1} roughness={0.2} />
      </mesh>

      {/* Inner Core Mechanism */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.6, 32]} />
        <meshStandardMaterial color="#00FFC6" metalness={1} roughness={0.1} emissive="#00FFC6" emissiveIntensity={0.5} />
      </mesh>

      {/* Lock Shackle (Cyber Style) */}
      <group position={[0, 2.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.2, 0.2, 16, 64, Math.PI]} />
          <meshStandardMaterial color="#4F46E5" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* CCTV Cameras */}
      <CCTVUnit position={[5, 2, 2]} rotation={[0, -Math.PI / 1.5, 0]} color="#00FFC6" />
      <CCTVUnit position={[-5, -2, 2]} rotation={[0, Math.PI / 1.5, 0]} color="#4F46E5" />
      <CCTVUnit position={[0, 4, -4]} rotation={[Math.PI / 4, Math.PI, 0]} color="#00FFC6" />

      {/* Radar Waves */}
      <RadarWave color="#00FFC6" />
      <RadarWave color="#4F46E5" />

      {/* Internal Rotating Rings */}
      <group ref={ringRef}>
        <Ring args={[1.4, 1.5, 64]} position={[0, 0, 0.4]}>
          <meshBasicMaterial color="#00FFC6" transparent opacity={0.3} side={THREE.DoubleSide} />
        </Ring>
        <Ring args={[1.7, 1.75, 64]} position={[0, 0, -0.4]}>
          <meshBasicMaterial color="#4F46E5" transparent opacity={0.2} side={THREE.DoubleSide} />
        </Ring>
      </group>

      {/* Scanning Line */}
      <mesh ref={scanRef} position={[0, 0, 0.7]}>
        <planeGeometry args={[3.5, 0.05]} />
        <meshBasicMaterial color="#00FFC6" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Orbiting Particles */}
      <Points positions={particlesPos}>
        <PointMaterial
          transparent
          color="#00FFC6"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </Points>

      {/* Central Glow */}
      <pointLight ref={pulseRef} color="#00FFC6" distance={10} intensity={10} />
      
      {/* Holographic Base */}
      <group position={[0, -3.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.2, 64]} />
          <meshBasicMaterial color="#00FFC6" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
        </mesh>
        <Ring args={[3.0, 3.2, 64]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#00FFC6" transparent opacity={0.2} side={THREE.DoubleSide} />
        </Ring>
      </group>
    </group>
  );
};

interface SceneProps {
  roleId: RoleId;
  color: string;
}

const Effects = () => {
  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={1.2} 
        mipmapBlur 
        intensity={0.6} 
        radius={0.2} 
      />
      <Noise opacity={0.01} />
      <Vignette eskil={false} offset={0.05} darkness={0.9} />
      <DepthOfField 
        focusDistance={0.05} 
        focalLength={0.1} 
        bokehScale={0.5} 
        height={480} 
      />
    </EffectComposer>
  );
};

export const SceneModels: React.FC<SceneProps> = ({ roleId, color }) => {
  const renderModel = () => {
    switch (roleId) {
      case 'admin': return <NeuralBrain color={color} />;
      case 'doctor': return <NeuralHeart color={color} />;
      case 'reception': return <DataNetwork />;
      case 'security': return <SecurityLock />;
      case 'ambulance': return <AmbulanceResponse color={color} />;
      default: return null;
    }
  };

  const isSpecial = roleId === 'doctor' || roleId === 'reception' || roleId === 'security' || roleId === 'ambulance';

  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        shadows 
        dpr={[1, 1.5]} 
        gl={{ antialias: true, alpha: true, stencil: false, depth: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={30} />
        <color attach="background" args={[isSpecial ? (roleId === 'security' || roleId === 'reception' || roleId === 'ambulance' ? "#0B0F1A" : "#020617") : "#050508"]} />
        <fog attach="fog" args={[isSpecial ? (roleId === 'security' || roleId === 'reception' || roleId === 'ambulance' ? "#0B0F1A" : "#020617") : "#050508", 5, 25]} />
        
        {/* Medical/Security Grid Overlay */}
        {isSpecial && (
          <group position={[0, 0, -10]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
              <planeGeometry args={[100, 100, 40, 40]} />
              <meshStandardMaterial 
                color={roleId === 'security' ? "#4F46E5" : (roleId === 'reception' || roleId === 'ambulance' ? "#00FFC6" : "#B11226")} 
                wireframe 
                transparent 
                opacity={0.03} 
              />
            </mesh>
          </group>
        )}
        
        <Suspense fallback={null}>
          <ambientLight intensity={0.03} />
          <pointLight 
            position={[10, 10, 10]} 
            color={roleId === 'security' || roleId === 'ambulance' ? "#00FFC6" : (roleId === 'reception' ? "#00FFC6" : (roleId === 'doctor' ? "#B11226" : "#6C2BD9"))} 
            intensity={6} 
          />
          <pointLight 
            position={[-10, -5, -10]} 
            color={roleId === 'security' || roleId === 'ambulance' ? "#4F46E5" : (roleId === 'reception' ? "#4F46E5" : (roleId === 'doctor' ? "#991b1b" : "#4B1D95"))} 
            intensity={4} 
          />
          <spotLight 
            position={[0, 15, 0]} 
            angle={0.2} 
            penumbra={1} 
            intensity={isSpecial ? 4 : 2} 
            castShadow 
            color={roleId === 'security' || roleId === 'ambulance' ? "#00FFC6" : (roleId === 'reception' ? "#00FFC6" : (roleId === 'doctor' ? "#B11226" : "#A78BFA"))} 
          />
          
          <group position={isSpecial ? [0, 0, 0] : [-2.4, 0, 0]} scale={isSpecial ? (roleId === 'security' || roleId === 'ambulance' ? 1.5 : 2.5) : 1.8}> 
            {renderModel()}
          </group>

          <Effects />
          <Environment preset="night" />
          <Stars radius={100} depth={50} count={25} factor={4} saturation={0} fade speed={0.02} />
        </Suspense>
      </Canvas>
    </div>
  );
};
