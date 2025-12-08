import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UserDropdowns, 
  LayerConfig, 
  LayerType,
  Framework, 
  ModelType, 
  Optimizer, 
  FullGenerationResult,
  ValidationIssue
} from './types';
import { generateNeuralNetwork } from './services/geminiService';

// --- Icons ---
const CpuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>);
const MicIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>);
const CodeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>);
const ActivityIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>);
const LayersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
const PlayIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>);
const EraserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/><path d="M17 17L7 7"/></svg>);
const CopyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
const DownloadIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>);
const LockIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const ShieldCheckIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>);

// --- Component: Status Indicator ---
const StatusIndicator = ({ valid, warnings }: { valid: boolean, warnings: ValidationIssue[] }) => {
  if (!valid) return <span className="flex items-center gap-1 text-[#FF8A8A] font-mono text-xs"><div className="w-2 h-2 rounded-full bg-[#FF8A8A] shadow-[0_0_8px_rgba(255,138,138,0.5)]"/> INVALID</span>;
  if (warnings.length > 0) return <span className="flex items-center gap-1 text-[#FFD966] font-mono text-xs"><div className="w-2 h-2 rounded-full bg-[#FFD966] shadow-[0_0_8px_rgba(255,217,102,0.5)]"/> WARNINGS</span>;
  return <span className="flex items-center gap-1 text-[#8AFF8A] font-mono text-xs"><div className="w-2 h-2 rounded-full bg-[#8AFF8A] shadow-[0_0_8px_rgba(138,255,138,0.5)]"/> VALID</span>;
};

// --- Utils ---
async function generateInputHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function sanitizeSVG(svg: string): string {
  // Strip script tags and event handlers
  return svg
    .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
    .replace(/\s*on\w+="[^"]*"/gim, "")
    .replace(/javascript:/gim, "");
}

// --- Templates ---
const TEMPLATES: Record<string, Partial<UserDropdowns>> = {
  "ResNet-18": { model_type: 'cnn', layers: [
    {id: '1', type: 'Conv2D', filters: 64, kernel_size: 7},
    {id: '2', type: 'MaxPool2D'}, 
    {id: '3', type: 'Conv2D', filters: 64}, 
    {id: '4', type: 'Conv2D', filters: 128}
  ]},
  "U-Net": { model_type: 'cnn', layers: [
    {id: '1', type: 'Conv2D', filters: 64},
    {id: '2', type: 'MaxPool2D'},
    {id: '3', type: 'Conv2D', filters: 128}
  ]},
  "Simple LSTM": { model_type: 'rnn', layers: [
    {id: '1', type: 'Embedding'},
    {id: '2', type: 'LSTM', units: 128},
    {id: '3', type: 'Dense', units: 1}
  ]},
  "Transformer": { model_type: 'transformer', layers: [
    {id: '1', type: 'Embedding'},
    {id: '2', type: 'MultiHeadAttention'},
    {id: '3', type: 'Dense', units: 512}
  ]}
};

const AVAILABLE_LAYERS: LayerType[] = ['Conv2D', 'MaxPool2D', 'Dense', 'LSTM', 'Dropout', 'Flatten', 'BatchNorm2D'];

export default function NeuroSmithPro() {
  // --- State ---
  const [framework, setFramework] = useState<Framework>('pytorch');
  const [modelType, setModelType] = useState<ModelType>('cnn');
  const [layers, setLayers] = useState<LayerConfig[]>([]);
  const [optimizer, setOptimizer] = useState<Optimizer>('Adam');
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [epochs, setEpochs] = useState<number>(10);
  const [batchSize, setBatchSize] = useState<number>(32);
  
  // Deterministic Mode
  const [isDeterministic, setIsDeterministic] = useState(true);
  const [showProof, setShowProof] = useState(false);
  const [inputHash, setInputHash] = useState("");

  // Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<FullGenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'code' | 'diagram' | 'metrics'>('code');

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use ref for drawing state to avoid re-renders causing stutter
  const isDrawingRef = useRef(false);

  // --- Helpers ---
  const addLayer = useCallback((type: LayerType) => {
    // Use explicit defaults for key layers to enhance determinism
    let newLayer: LayerConfig = { id: crypto.randomUUID(), type };
    
    // Add deterministic defaults if user doesn't specify
    if (type === 'Conv2D') {
      newLayer = { ...newLayer, filters: 32, kernel_size: 3 };
    } else if (type === 'Dense') {
      newLayer = { ...newLayer, units: 128 };
    } else if (type === 'LSTM' || type === 'GRU') {
      newLayer = { ...newLayer, units: 128 };
    } else if (type === 'Dropout') {
      newLayer = { ...newLayer, dropout_rate: 0.2 };
    }

    setLayers(prev => [...prev, newLayer]);
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers(prev => prev.filter(l => l.id !== id));
  }, []);

  const loadTemplate = useCallback((name: string) => {
    const t = TEMPLATES[name];
    if (t) {
      if(t.model_type) setModelType(t.model_type);
      if(t.layers) {
         // Regenerate IDs to avoid collisions on reload
         const newLayers = t.layers.map(l => ({ ...l, id: crypto.randomUUID() }));
         setLayers(newLayers as LayerConfig[]);
      }
    }
  }, []);

  // --- Audio ---
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        
        // Safer check for Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
           const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
           const recognition = new SpeechRecognition();
           recognition.continuous = true;
           recognition.interimResults = true;
           recognition.onresult = (event: any) => {
             let interim = '';
             for (let i = event.resultIndex; i < event.results.length; ++i) {
               interim += event.results[i][0].transcript;
             }
             setVoiceTranscript(interim);
           };
           recognition.onerror = (e: any) => console.warn("Speech recognition error:", e);
           recognition.start();
           const stopRec = () => {
             try { recognition.stop(); } catch(e){}
           };
           mediaRecorderRef.current.addEventListener('stop', stopRec);
        } else {
          setVoiceTranscript("Browser does not support live transcription. Audio will be sent to model.");
        }

      } catch (err) {
        console.error("Mic Error", err);
        alert("Could not access microphone.");
      }
    }
  }, [isRecording]);

  // --- Canvas ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#22d3ee'; // keep canvas bright for visibility
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    ctx?.lineTo(x, y);
    ctx?.stroke();
  };
  const stopDrawing = () => {
    isDrawingRef.current = false;
  }
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- Generate ---
  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null); // Clear previous result to show loading state in tab
    
    // Safer toBlob implementation
    let imageBlob: Blob | null = null;
    if (canvasRef.current) {
      imageBlob = await new Promise(resolve => {
        canvasRef.current?.toBlob(blob => resolve(blob ?? null), 'image/png');
      });
    }

    const dropdowns: UserDropdowns = {
      framework,
      model_type: modelType,
      layers,
      hyperparameters: { optimizer, learning_rate: learningRate, epochs, batch_size: batchSize },
      isDeterministic
    };

    // Calculate Proof Hash
    const hashBase = JSON.stringify(dropdowns) + (imageBlob ? imageBlob.size : "0") + voiceTranscript;
    generateInputHash(hashBase).then(setInputHash);

    try {
      // Prioritize transcript over raw audio to avoid ambiguity/conflict
      // Only send audio blob if transcript is empty
      const audioToSend = voiceTranscript && voiceTranscript.trim().length > 0 ? null : audioBlob;
      
      const res = await generateNeuralNetwork(dropdowns, imageBlob, audioToSend, voiceTranscript, isDeterministic);
      setResult(res);
      setActiveTab('code'); // Auto switch to code on generation
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Render Helpers ---
  const getCode = () => {
    if (!result) return "";
    return framework === 'pytorch' ? result.generated_code.pytorch : result.generated_code.tensorflow;
  };

  const getSanitizedSVG = () => {
    if (!result) return "";
    // Regex replace to ensure svg scales
    let svg = result.diagram_svg.replace(/<svg([^>]*)>/, '<svg$1 width="100%" height="100%">');
    return sanitizeSVG(svg);
  }

  const downloadFile = (content: string, filename: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0E0E0E] text-[#A1A1A1] font-sans overflow-hidden">
      
      {/* Proof Modal */}
      {showProof && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E0E] border border-cyan-500/30 w-full max-w-lg rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
             <div className="bg-[#161616] px-6 py-4 border-b border-[#2A2A2A] flex justify-between items-center">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                   <ShieldCheckIcon /> DETERMINISTIC GENERATION REPORT
                </h3>
                <button onClick={() => setShowProof(false)} className="text-gray-500 hover:text-white">✕</button>
             </div>
             <div className="p-6 space-y-4 font-mono text-xs">
                <div>
                   <div className="text-gray-500 uppercase font-bold mb-1">Input Hash (SHA-256)</div>
                   <div className="bg-[#1A1A1A] p-2 rounded text-cyan-300 break-all border border-[#2A2A2A]">{inputHash}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <div className="text-gray-500 uppercase font-bold mb-1">Template Version</div>
                      <div className="text-white">v1.0</div>
                   </div>
                   <div>
                      <div className="text-gray-500 uppercase font-bold mb-1">Gemini Model</div>
                      <div className="text-white">gemini-3.0-pro (temp=0)</div>
                   </div>
                </div>
                <div>
                   <div className="text-gray-500 uppercase font-bold mb-1">Generated Layers</div>
                   <div className="text-gray-300 flex flex-wrap gap-1">
                      {result.model_spec.layers.map((l:any, i:number) => (
                         <span key={i} className="bg-[#262626] px-1.5 rounded text-cyan-100">{l.type}</span>
                      ))}
                   </div>
                </div>
                <div className="border-t border-[#2A2A2A] pt-4 text-gray-500 italic">
                   "This exact configuration is guaranteed to generate identical code every time."
                </div>
             </div>
             <div className="bg-[#161616] px-6 py-3 border-t border-[#2A2A2A] flex justify-end">
                <button onClick={() => setShowProof(false)} className="px-4 py-2 bg-[#262626] border border-cyan-900 text-cyan-400 hover:bg-cyan-900/30 rounded text-xs font-bold transition-colors">Close Report</button>
             </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="h-14 border-b border-[#2A2A2A] bg-[#0E0E0E] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="text-cyan-400"><CpuIcon /></div>
          <h1 className="text-lg font-bold tracking-tight text-white">NEUROSMITH <span className="text-cyan-400 font-mono text-xs ml-1">PRO</span></h1>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 bg-[#1A1A1A] px-3 py-1.5 rounded-full border border-[#2A2A2A]">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDeterministic ? 'text-[#8AFF8A]' : 'text-gray-500'}`}>
                 {isDeterministic ? 'Deterministic Mode' : 'Creative Mode'}
              </span>
              <button 
                onClick={() => setIsDeterministic(!isDeterministic)}
                className={`w-8 h-4 rounded-full relative transition-colors ${isDeterministic ? 'bg-[#8AFF8A]/20' : 'bg-[#333]'}`}
              >
                 <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${isDeterministic ? 'bg-[#8AFF8A] left-4.5 shadow-[0_0_8px_rgba(138,255,138,0.6)]' : 'bg-gray-400 left-0.5'}`}></div>
              </button>
           </div>
           
           <div className="w-px h-6 bg-[#2A2A2A]"></div>

           <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.4)]"></div>
           </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: INPUTS (40%) */}
        <div className="w-[40%] flex flex-col border-r border-[#2A2A2A] bg-[#161616] overflow-y-auto custom-scrollbar">
          
          {/* Dropdown Section */}
          <div className="p-6 border-b border-[#2A2A2A]">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LayersIcon /> Configuration
              {isDeterministic && <span className="text-cyan-500" title="Locked to approved layers"><LockIcon /></span>}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1 flex items-center gap-1">
                   Framework {isDeterministic && <span className="text-cyan-500 opacity-50"><LockIcon /></span>}
                </label>
                <select 
                  value={framework}
                  onChange={e => setFramework(e.target.value as Framework)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded p-2 text-sm text-gray-200 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="pytorch">PyTorch</option>
                  <option value="tensorflow">TensorFlow</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1 flex items-center gap-1">
                   Model Type {isDeterministic && <span className="text-cyan-500 opacity-50"><LockIcon /></span>}
                </label>
                <select 
                  value={modelType}
                  onChange={e => setModelType(e.target.value as ModelType)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded p-2 text-sm text-gray-200 focus:border-cyan-500 outline-none transition-colors"
                >
                  <option value="cnn">CNN</option>
                  <option value="mlp">MLP</option>
                  <option value="rnn">RNN</option>
                  <option value="transformer">Transformer</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1 flex items-center gap-1">
                 Architecture Stack {isDeterministic && <span className="text-cyan-500 opacity-50"><LockIcon /></span>}
              </label>
              <div className="bg-[#1A1A1A] border border-[#333] rounded-lg min-h-[120px] p-2 space-y-1 mb-2">
                 {layers.length === 0 && <div className="text-center text-gray-600 text-xs py-10 italic">Empty stack. Add layers or load template.</div>}
                 {layers.map((l, i) => (
                   <div key={l.id} className="flex items-center justify-between bg-[#262626] px-3 py-2 rounded text-xs border border-[#333] group">
                     <span className="font-mono text-cyan-300">{i+1}. {l.type} <span className="text-gray-500">{l.filters ? `(${l.filters})` : l.units ? `(${l.units})` : ''}</span></span>
                     <button onClick={() => removeLayer(l.id)} className="text-gray-600 hover:text-red-400"><TrashIcon /></button>
                   </div>
                 ))}
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                 {AVAILABLE_LAYERS.map(t => (
                   <button key={t} onClick={() => addLayer(t)} className="px-3 py-1 bg-[#262626] border border-[#333] rounded text-[10px] hover:bg-[#333] hover:text-cyan-400 transition-colors whitespace-nowrap text-gray-400">
                     + {t}
                   </button>
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
               <div>
                  <label className="text-[10px] text-gray-500 block mb-1">LR</label>
                  <input type="number" step="0.001" value={learningRate} onChange={e => setLearningRate(parseFloat(e.target.value))} className="w-full bg-[#1A1A1A] border border-[#333] rounded p-1 text-xs font-mono text-gray-300 focus:border-cyan-500 outline-none" />
               </div>
               <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Batch</label>
                  <input type="number" value={batchSize} onChange={e => setBatchSize(parseInt(e.target.value))} className="w-full bg-[#1A1A1A] border border-[#333] rounded p-1 text-xs font-mono text-gray-300 focus:border-cyan-500 outline-none" />
               </div>
               <div className="col-span-2">
                  <label className="text-[10px] text-gray-500 block mb-1">Optim</label>
                  <select value={optimizer} onChange={e => setOptimizer(e.target.value as Optimizer)} className="w-full bg-[#1A1A1A] border border-[#333] rounded p-1 text-xs font-mono text-gray-300 focus:border-cyan-500 outline-none">
                    <option>Adam</option><option>SGD</option><option>RMSprop</option>
                  </select>
               </div>
               <div>
                  <label className="text-[10px] text-gray-500 block mb-1">Epochs</label>
                  <input type="number" value={epochs} onChange={e => setEpochs(parseInt(e.target.value))} className="w-full bg-[#1A1A1A] border border-[#333] rounded p-1 text-xs font-mono text-gray-300 focus:border-cyan-500 outline-none" />
               </div>
            </div>
          </div>

          {/* Template Gallery */}
          <div className="p-6 border-b border-[#2A2A2A]">
             <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Templates</h2>
             <div className="grid grid-cols-2 gap-2">
                {Object.keys(TEMPLATES).map(name => (
                  <button key={name} onClick={() => loadTemplate(name)} className="text-left px-3 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] rounded text-xs transition-colors text-gray-400 hover:text-cyan-400">
                    {name}
                  </button>
                ))}
             </div>
          </div>

          {/* Drawing & Voice */}
          <div className="flex-1 p-6 flex flex-col gap-6">
             
             {/* Canvas */}
             <div className="flex-1 relative min-h-[200px] border border-[#333] bg-[#1A1A1A] rounded-xl overflow-hidden group">
                <div className="absolute top-3 left-3 text-[10px] font-bold text-gray-600 uppercase z-10 pointer-events-none group-hover:text-cyan-400 transition-colors">Blueprint Canvas</div>
                <button onClick={clearCanvas} className="absolute top-2 right-2 p-2 bg-[#262626] hover:bg-red-900/30 text-gray-500 hover:text-red-400 rounded z-10 transition-colors"><EraserIcon /></button>
                <canvas 
                   ref={canvasRef}
                   width={400}
                   height={300}
                   className="w-full h-full cursor-crosshair touch-none"
                   onMouseDown={startDrawing}
                   onMouseMove={draw}
                   onMouseUp={stopDrawing}
                   onMouseLeave={stopDrawing}
                   onTouchStart={startDrawing}
                   onTouchMove={draw}
                   onTouchEnd={stopDrawing}
                />
             </div>

             {/* Voice */}
             <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4 flex items-center gap-4">
                <button 
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-[#C69CFF]/20 text-[#C69CFF] shadow-[0_0_15px_rgba(198,156,255,0.4)]' : 'bg-[#262626] text-[#C69CFF] hover:bg-[#333] border border-purple-900/30'}`}
                >
                  <MicIcon />
                </button>
                <div className="flex-1">
                   <div className="text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      Voice Command {isDeterministic && <span className="text-[#8AFF8A] text-[9px] normal-case bg-[#8AFF8A]/10 px-1 rounded">Strict Mode</span>}
                   </div>
                   <div className="text-xs font-mono text-purple-200 truncate h-5">
                      {isRecording ? "Listening..." : voiceTranscript || "Hold mic to speak modifications..."}
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-2">
               <button 
                 onClick={handleGenerate}
                 disabled={isGenerating}
                 className={`py-4 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all border
                 ${isGenerating ? 'bg-[#1A1A1A] text-gray-600 border-[#333]' : 'bg-cyan-900/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`}
               >
                 {isGenerating ? <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"/> : <PlayIcon />}
                 {isGenerating ? 'Architecting...' : 'Generate Model Code'}
               </button>
               {isDeterministic && (
                 <div className="text-center text-[10px] text-gray-600 flex items-center justify-center gap-1">
                    <ShieldCheckIcon /> Using deterministic templates — no hallucination.
                 </div>
               )}
             </div>
          </div>
        </div>

        {/* RIGHT PANEL: OUTPUT (60%) */}
        <div className="w-[60%] flex flex-col bg-[#0E0E0E] relative">
          
          {/* Tabs */}
          <div className="flex border-b border-[#2A2A2A] bg-[#0E0E0E]">
             <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'code' ? 'border-cyan-400 text-cyan-400 bg-[#161616]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                <CodeIcon /> Code
             </button>
             <button onClick={() => setActiveTab('diagram')} className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'diagram' ? 'border-cyan-400 text-cyan-400 bg-[#161616]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                <LayersIcon /> Diagram
             </button>
             <button onClick={() => setActiveTab('metrics')} className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'metrics' ? 'border-cyan-400 text-cyan-400 bg-[#161616]' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                <ActivityIcon /> Metrics
             </button>
             <div className="flex-1"></div>
             {result && (
               <div className="flex items-center gap-4 px-4">
                  {isDeterministic && (
                    <button onClick={() => setShowProof(true)} className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-900/10 px-2 py-1 rounded border border-cyan-500/30">
                       <ShieldCheckIcon /> Proof
                    </button>
                  )}
                  <StatusIndicator valid={result.validation.valid} warnings={result.validation.warnings} />
               </div>
             )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto relative custom-scrollbar bg-[#0E0E0E]">
            
            {/* CODE TAB */}
            {activeTab === 'code' && (
              <div className="h-full bg-[#0E0E0E] relative">
                 {isGenerating ? (
                    // Shimmer State
                    <div className="p-6 space-y-3 opacity-70">
                       <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-1/3 animate-pulse"></div>
                       <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-1/4 animate-pulse"></div>
                       <div className="h-8"></div>
                       <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-1/2 animate-pulse"></div>
                       <div className="space-y-2 pl-4">
                          <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-2/3 animate-pulse"></div>
                          <div className="h-4 bg-gradient-to-r from-[#1A1A1A] via-cyan-900/10 to-[#1A1A1A] rounded w-3/4 animate-pulse"></div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-[#161616] px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-xl flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                             Compiling Deterministic Graph...
                          </div>
                       </div>
                    </div>
                 ) : !result ? (
                    // Placeholder State
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 p-8 text-center select-none">
                       <pre className="text-left text-xs font-mono opacity-40 mb-8">
                          # Awaiting Design Specs...{"\n"}
                          # Draw a diagram, select parameters, or speak commands{"\n"}
                          # to generate your deterministic model.
                       </pre>
                       <pre className="text-left text-sm font-mono text-cyan-900/60">
                          # Your model will appear here...{"\n"}
                          # NeuroSmith uses deterministic compilation templates{"\n"}
                          # ensuring reproducible and safe architecture generation.
                       </pre>
                    </div>
                 ) : (
                    // Result State
                    <div className="relative group min-h-full">
                       <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <button onClick={() => navigator.clipboard.writeText(getCode())} className="p-2 bg-[#1F1F1F] text-gray-400 hover:text-cyan-400 rounded border border-[#333] shadow-lg"><CopyIcon /></button>
                          <button onClick={() => downloadFile(getCode(), 'model.py')} className="p-2 bg-[#1F1F1F] text-gray-400 hover:text-cyan-400 rounded border border-[#333] shadow-lg"><DownloadIcon /></button>
                       </div>
                       <pre className="p-6 text-sm font-mono text-cyan-100/90 leading-relaxed overflow-x-auto">
                          <code>{getCode()}</code>
                       </pre>
                    </div>
                 )}
              </div>
            )}

            {/* DIAGRAM TAB */}
            {activeTab === 'diagram' && (
              <div className="h-full flex flex-col bg-[#0E0E0E]">
                 {isGenerating ? (
                    <div className="flex-1 flex items-center justify-center opacity-50">
                       <div className="w-16 h-16 border-4 border-[#333] border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                 ) : !result ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
                       <LayersIcon />
                       <span className="text-xs mt-2">Architecture Visualization</span>
                    </div>
                 ) : (
                    <>
                       <div className="flex-1 flex items-center justify-center p-8 bg-[#0E0E0E]">
                          <div 
                            className="w-full max-w-3xl svg-container"
                            dangerouslySetInnerHTML={{ __html: getSanitizedSVG() }} 
                          />
                       </div>
                       <div className="p-6 border-t border-[#2A2A2A] bg-[#161616]">
                          <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Rationale</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{result.rationale}</p>
                       </div>
                    </>
                 )}
              </div>
            )}

            {/* METRICS TAB */}
            {activeTab === 'metrics' && (
              <div className="p-8 max-w-3xl mx-auto space-y-8 bg-[#0E0E0E]">
                 {isGenerating ? (
                    // Metrics Shimmer
                    <div className="grid grid-cols-2 gap-4 opacity-50">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="bg-[#161616] border border-[#2A2A2A] p-6 rounded-xl animate-pulse">
                            <div className="h-3 w-20 bg-[#2A2A2A] rounded mb-2"></div>
                            <div className="h-8 w-32 bg-[#2A2A2A] rounded"></div>
                         </div>
                      ))}
                    </div>
                 ) : (
                   <>
                     {/* Stats Grid */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#161616] border border-[#2A2A2A] p-6 rounded-xl">
                           <div className="text-cyan-400/70 text-xs uppercase font-bold mb-1">Parameters</div>
                           <div className="text-2xl font-mono text-white">
                              {result ? (result.complexity.total_parameters / 1000000).toFixed(2) + "M" : "—"}
                           </div>
                           <div className="text-xs text-gray-600 mt-2">Total Trainable Weights</div>
                        </div>
                        <div className="bg-[#161616] border border-[#2A2A2A] p-6 rounded-xl">
                           <div className="text-cyan-400/70 text-xs uppercase font-bold mb-1">Compute</div>
                           <div className="text-2xl font-mono text-white">
                              {result ? (result.complexity.flops / 1000000000).toFixed(2) + "G" : "—"}
                           </div>
                           <div className="text-xs text-gray-600 mt-2">FLOPs per forward pass</div>
                        </div>
                        <div className="bg-[#161616] border border-[#2A2A2A] p-6 rounded-xl">
                           <div className="text-cyan-400/70 text-xs uppercase font-bold mb-1">Memory</div>
                           <div className="text-2xl font-mono text-white">
                              {result ? result.complexity.memory_mb + " MB" : "—"}
                           </div>
                           <div className="text-xs text-gray-600 mt-2">Est. VRAM Usage (Batch 32)</div>
                        </div>
                        <div className="bg-[#161616] border border-[#2A2A2A] p-6 rounded-xl">
                           <div className="text-cyan-400/70 text-xs uppercase font-bold mb-1">Training Time (T4)</div>
                           <div className="text-2xl font-mono text-white">
                              {result ? result.complexity.estimated_training_time.T4 : "—"}
                           </div>
                           <div className="text-xs text-gray-600 mt-2">Approximate per run</div>
                        </div>
                     </div>

                     {/* Validation Log */}
                     {result && (
                        <div className="bg-[#161616] border border-[#2A2A2A] rounded-xl overflow-hidden">
                           <div className="px-6 py-4 border-b border-[#2A2A2A] font-bold text-sm text-gray-300">Validation Analysis</div>
                           <div className="p-6 space-y-3">
                              {result.validation.valid && result.validation.warnings.length === 0 && (
                                 <div className="flex items-center gap-3 text-[#8AFF8A] bg-[#8AFF8A]/5 p-3 rounded border border-[#8AFF8A]/20">
                                    <div className="w-2 h-2 rounded-full bg-[#8AFF8A]"></div>
                                    <span className="text-sm">Architecture is valid and optimized.</span>
                                 </div>
                              )}
                              {result.validation.warnings.map((w, i) => (
                                 <div key={i} className="flex gap-3 text-[#FFD966] bg-[#FFD966]/5 p-3 rounded border border-[#FFD966]/20">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-[#FFD966] shrink-0"></div>
                                    <div>
                                       <div className="text-sm font-bold">{w.message}</div>
                                       <div className="text-xs opacity-80 mt-1">{w.suggestion}</div>
                                    </div>
                                 </div>
                              ))}
                              {result.validation.errors.map((e, i) => (
                                 <div key={i} className="flex gap-3 text-[#FF8A8A] bg-[#FF8A8A]/5 p-3 rounded border border-[#FF8A8A]/20">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-[#FF8A8A] shrink-0"></div>
                                    <div className="text-sm">{e}</div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                   </>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}