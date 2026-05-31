"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Pencil, Eraser, Square, Circle, Minus, Pipette, Paintbrush,
  Undo2, Redo2, Trash2, Download, FolderOpen, ZoomIn, ZoomOut,
  Move, Type, Eye, EyeOff, Lock, Unlock, Plus, Copy, ChevronUp, ChevronDown,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Tool =
  | "pencil" | "eraser" | "line" | "rect-stroke" | "rect-fill"
  | "ellipse-stroke" | "ellipse-fill" | "fill" | "eyedrop"
  | "select-rect" | "move" | "text" | "gradient" | "dodge" | "burn";

type BlendMode =
  | "source-over" | "multiply" | "screen" | "overlay" | "darken"
  | "lighten" | "difference" | "exclusion" | "color-dodge" | "color-burn"
  | "hard-light" | "soft-light";

const BLEND_MODES: BlendMode[] = [
  "source-over","multiply","screen","overlay","darken","lighten",
  "difference","exclusion","color-dodge","color-burn","hard-light","soft-light",
];

interface Layer {
  id: string;
  name: string;
  canvas: HTMLCanvasElement;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  locked: boolean;
}

interface Pt { x: number; y: number }
interface SelRect { x: number; y: number; w: number; h: number }

// ── Constants ──────────────────────────────────────────────────────────────
const CANVAS_W = 800;
const CANVAS_H = 520;
const MAX_UNDO = 30;

const PALETTE = [
  "#000000","#1c1c1c","#3a3a3a","#606060","#909090",
  "#b8b8b8","#d4d4d4","#ebebeb","#f5f5f5","#ffffff",
  "#c0392b","#e67e22","#f1c40f","#27ae60","#16a085",
  "#2980b9","#8e44ad","#e91e63","#00bcd4","#795548",
  "#ff6b6b","#ffa07a","#ffd700","#98fb98","#87ceeb",
  "#dda0dd","#f0e68c","#ff69b4","#40e0d0","#cd853f",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1,3),16),
    g: parseInt(hex.slice(3,5),16),
    b: parseInt(hex.slice(5,7),16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
}

function makeLayer(name: string, fill?: string): Layer {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_W; canvas.height = CANVAS_H;
  if (fill) {
    const c = canvas.getContext("2d")!;
    c.fillStyle = fill; c.fillRect(0,0,CANVAS_W,CANVAS_H);
  }
  return {
    id: Math.random().toString(36).slice(2), name, canvas,
    visible: true, opacity: 100, blendMode: "source-over", locked: false,
  };
}

function applyKernel(src: ImageData, kernel: number[], divisor: number): ImageData {
  const dst = new ImageData(src.width, src.height);
  const s = src.data, d = dst.data, W = src.width, H = src.height;
  const ks = Math.sqrt(kernel.length) | 0, half = (ks-1)/2;
  for (let y=0; y<H; y++) for (let x=0; x<W; x++) {
    let r=0,g=0,b=0;
    for (let ky=0; ky<ks; ky++) for (let kx=0; kx<ks; kx++) {
      const px=Math.min(W-1,Math.max(0,x+kx-half)), py=Math.min(H-1,Math.max(0,y+ky-half));
      const idx=(py*W+px)*4, w=kernel[ky*ks+kx];
      r+=s[idx]*w; g+=s[idx+1]*w; b+=s[idx+2]*w;
    }
    const i=(y*W+x)*4;
    d[i]  =Math.min(255,Math.max(0,r/divisor+(divisor===1?128:0)));
    d[i+1]=Math.min(255,Math.max(0,g/divisor+(divisor===1?128:0)));
    d[i+2]=Math.min(255,Math.max(0,b/divisor+(divisor===1?128:0)));
    d[i+3]=s[i+3];
  }
  return dst;
}

// ── Button style helpers ───────────────────────────────────────────────────
const iconBtn: React.CSSProperties = {
  background:"transparent", border:"none", color:"rgba(255,255,255,0.6)",
  cursor:"pointer", padding:"2px 3px", borderRadius:3,
  display:"flex", alignItems:"center",
};
const smallBtn: React.CSSProperties = {
  background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
  color:"rgba(255,255,255,0.65)", cursor:"pointer", padding:"3px 8px",
  borderRadius:3, fontSize:10,
};

// ── Component ──────────────────────────────────────────────────────────────
export default function GimpWindow() {
  const displayRef = useRef<HTMLCanvasElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  // Layers in a ref to prevent React re-creating canvases
  const layersRef   = useRef<Layer[]>([]);
  const activeIdRef = useRef<string>("");
  const [layerVer, setLayerVer] = useState(0);
  const forceUpdate = useCallback(() => setLayerVer(v => v+1), []);

  // Drawing refs
  const snapshotRef = useRef<ImageData | null>(null);
  const isDrawing   = useRef(false);
  const startPt     = useRef<Pt | null>(null);
  const lastPt      = useRef<Pt | null>(null);
  const marchOff    = useRef(0);
  const marchRaf    = useRef<number>(0);

  // Undo/redo
  type UndoFrame = { layerId: string; data: ImageData }[];
  const undoStack = useRef<UndoFrame[]>([]);
  const redoStack = useRef<UndoFrame[]>([]);

  // UI state
  const [tool,       setTool]       = useState<Tool>("pencil");
  const [fgColor,    setFgColor]    = useState("#000000");
  const [bgColor,    setBgColor]    = useState("#ffffff");
  const [brushSize,  setBrushSize]  = useState(4);
  const [opacity,    setOpacity]    = useState(100);
  const [hardness,   setHardness]   = useState(80);
  const [zoom,       setZoom]       = useState(1);
  const [coords,     setCoords]     = useState<Pt>({x:0,y:0});
  const [openMenu,   setOpenMenu]   = useState<string|null>(null);
  const [canUndo,    setCanUndo]    = useState(false);
  const [canRedo,    setCanRedo]    = useState(false);
  const [selection,  setSelection]  = useState<SelRect | null>(null);
  const [clipboard,  setClipboard]  = useState<ImageData | null>(null);
  const [textInput,  setTextInput]  = useState("");
  const [textPos,    setTextPos]    = useState<Pt | null>(null);
  const [fontSize,   setFontSize]   = useState(20);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [rightTab,   setRightTab]   = useState<"layers"|"channels"|"paths">("layers");
  const selStartRef = useRef<Pt | null>(null);

  // ── Layer helpers ──
  const getActive = () => layersRef.current.find(l => l.id === activeIdRef.current) ?? null;
  const lctxOf    = (l: Layer) => l.canvas.getContext("2d")!;

  // ── Composite display canvas ──
  const composite = useCallback(() => {
    const dc = displayRef.current?.getContext("2d");
    if (!dc) return;
    dc.clearRect(0,0,CANVAS_W,CANVAS_H);
    // Checkerboard for transparency preview
    for (let y=0; y<CANVAS_H; y+=8) for (let x=0; x<CANVAS_W; x+=8) {
      dc.fillStyle = ((x+y)/8)%2===0 ? "#ccc":"#fff";
      dc.fillRect(x,y,8,8);
    }
    for (const l of layersRef.current) {
      if (!l.visible) continue;
      dc.globalAlpha = l.opacity/100;
      dc.globalCompositeOperation = l.blendMode as GlobalCompositeOperation;
      dc.drawImage(l.canvas,0,0);
    }
    dc.globalAlpha=1; dc.globalCompositeOperation="source-over";
  }, []);

  // ── Init ──
  useEffect(() => {
    const bg = makeLayer("Background","#ffffff");
    layersRef.current = [bg]; activeIdRef.current = bg.id;
    composite(); forceUpdate();
  }, [composite, forceUpdate]);

  // ── Marching ants ──
  useEffect(() => {
    if (!selection) { cancelAnimationFrame(marchRaf.current); return; }
    const draw = () => {
      composite();
      const dc = displayRef.current?.getContext("2d");
      if (dc && selection) {
        marchOff.current = (marchOff.current + 0.3) % 10;
        dc.save();
        dc.lineWidth=1;
        dc.setLineDash([5,5]);
        for (const [color, offset] of [["#000",-marchOff.current],["#fff",-(marchOff.current+5)]] as [string,number][]) {
          dc.strokeStyle=color; dc.lineDashOffset=offset;
          dc.strokeRect(selection.x+.5,selection.y+.5,selection.w,selection.h);
        }
        dc.restore();
      }
      marchRaf.current = requestAnimationFrame(draw);
    };
    marchRaf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(marchRaf.current);
  }, [selection, composite]);

  // ── Undo/Redo ──
  const pushUndo = useCallback(() => {
    const snap: UndoFrame = layersRef.current.map(l => ({
      layerId: l.id,
      data: lctxOf(l).getImageData(0,0,CANVAS_W,CANVAS_H),
    }));
    undoStack.current = [...undoStack.current.slice(-MAX_UNDO), snap];
    redoStack.current = [];
    setCanUndo(true); setCanRedo(false);
  }, []);

  const undo = useCallback(() => {
    if (!undoStack.current.length) return;
    const cur: UndoFrame = layersRef.current.map(l => ({ layerId:l.id, data:lctxOf(l).getImageData(0,0,CANVAS_W,CANVAS_H) }));
    redoStack.current = [...redoStack.current, cur];
    const prev = undoStack.current.at(-1)!;
    undoStack.current = undoStack.current.slice(0,-1);
    prev.forEach(e => { const l=layersRef.current.find(x=>x.id===e.layerId); if(l) lctxOf(l).putImageData(e.data,0,0); });
    composite(); setCanUndo(undoStack.current.length>0); setCanRedo(true);
  }, [composite]);

  const redo = useCallback(() => {
    if (!redoStack.current.length) return;
    const cur: UndoFrame = layersRef.current.map(l => ({ layerId:l.id, data:lctxOf(l).getImageData(0,0,CANVAS_W,CANVAS_H) }));
    undoStack.current = [...undoStack.current, cur];
    const next = redoStack.current.at(-1)!;
    redoStack.current = redoStack.current.slice(0,-1);
    next.forEach(e => { const l=layersRef.current.find(x=>x.id===e.layerId); if(l) lctxOf(l).putImageData(e.data,0,0); });
    composite(); setCanUndo(true); setCanRedo(redoStack.current.length>0);
  }, [composite]);

  // ── Point helper ──
  const getPoint = (e: React.MouseEvent): Pt => {
    const rect = displayRef.current!.getBoundingClientRect();
    return {
      x: Math.round((e.clientX-rect.left)*(CANVAS_W/rect.width)),
      y: Math.round((e.clientY-rect.top) *(CANVAS_H/rect.height)),
    };
  };

  // ── Brush drawing ──
  const drawBrush = (lctx: CanvasRenderingContext2D, x: number, y: number) => {
    const r = brushSize/2;
    if (hardness >= 95) {
      lctx.beginPath(); lctx.arc(x,y,r,0,Math.PI*2);
      lctx.fillStyle = tool==="eraser" ? "#ffffff" : fgColor;
      lctx.fill();
    } else {
      const col = tool==="eraser" ? "255,255,255" : (()=>{const {r:rr,g,b}=hexToRgb(fgColor);return `${rr},${g},${b}`;})();
      const a = opacity/100, fall = hardness/100;
      const grad = lctx.createRadialGradient(x,y,0,x,y,r);
      grad.addColorStop(fall, `rgba(${col},${a})`);
      grad.addColorStop(1,    `rgba(${col},0)`);
      lctx.beginPath(); lctx.arc(x,y,r,0,Math.PI*2);
      lctx.fillStyle = grad; lctx.fill();
    }
  };

  // ── Mouse events ──
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const pt = getPoint(e);

    if (tool==="eyedrop") {
      const dc = displayRef.current?.getContext("2d"); if (!dc) return;
      const px = dc.getImageData(pt.x,pt.y,1,1).data;
      setFgColor(rgbToHex(px[0],px[1],px[2])); return;
    }
    if (tool==="select-rect") {
      setSelection(null); selStartRef.current=pt; isDrawing.current=true; return;
    }
    if (tool==="text") { setTextPos(pt); return; }

    const layer = getActive(); if (!layer||layer.locked) return;
    const lctx = lctxOf(layer);

    if (tool==="fill") { pushUndo(); floodFill(lctx,pt.x,pt.y,fgColor); composite(); return; }

    pushUndo();
    snapshotRef.current = lctx.getImageData(0,0,CANVAS_W,CANVAS_H);
    isDrawing.current=true; startPt.current=pt; lastPt.current=pt;

    if (tool==="pencil"||tool==="eraser") {
      lctx.globalAlpha = opacity/100;
      if (tool==="eraser") lctx.globalCompositeOperation="destination-out";
      drawBrush(lctx,pt.x,pt.y);
      if (tool==="eraser") lctx.globalCompositeOperation="source-over";
      lctx.globalAlpha=1; composite();
    }
    if (tool==="dodge"||tool==="burn") { dodgeBurn(lctx,pt.x,pt.y); composite(); }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const pt = getPoint(e); setCoords(pt);
    if (!isDrawing.current) return;

    if (tool==="select-rect" && selStartRef.current) {
      const s=selStartRef.current;
      setSelection({x:Math.min(s.x,pt.x),y:Math.min(s.y,pt.y),w:Math.abs(pt.x-s.x),h:Math.abs(pt.y-s.y)});
      return;
    }

    const layer=getActive(); if (!layer||layer.locked) return;
    const lctx=lctxOf(layer);

    if (tool==="pencil"||tool==="eraser") {
      const from=lastPt.current!, steps=Math.max(1,Math.ceil(Math.hypot(pt.x-from.x,pt.y-from.y)/(brushSize*0.3)));
      lctx.globalAlpha=opacity/100;
      if (tool==="eraser") lctx.globalCompositeOperation="destination-out";
      for (let i=1;i<=steps;i++) drawBrush(lctx, from.x+(pt.x-from.x)*i/steps, from.y+(pt.y-from.y)*i/steps);
      if (tool==="eraser") lctx.globalCompositeOperation="source-over";
      lctx.globalAlpha=1; lastPt.current=pt; composite(); return;
    }
    if (tool==="dodge"||tool==="burn") { dodgeBurn(lctx,pt.x,pt.y); composite(); return; }
    if (tool==="move") {
      const from=lastPt.current!;
      const dx=pt.x-from.x, dy=pt.y-from.y;
      const tmp=document.createElement("canvas"); tmp.width=CANVAS_W; tmp.height=CANVAS_H;
      const tc=tmp.getContext("2d")!; tc.drawImage(layer.canvas,0,0);
      lctx.clearRect(0,0,CANVAS_W,CANVAS_H); lctx.drawImage(tmp,dx,dy);
      lastPt.current=pt; composite(); return;
    }

    // Shape preview
    if (snapshotRef.current) lctx.putImageData(snapshotRef.current,0,0);
    const s=startPt.current!;
    lctx.globalAlpha=opacity/100; lctx.strokeStyle=fgColor; lctx.fillStyle=fgColor;
    lctx.lineWidth=brushSize; lctx.lineCap="round"; lctx.lineJoin="round";
    lctx.beginPath();
    if (tool==="line") { lctx.moveTo(s.x,s.y); lctx.lineTo(pt.x,pt.y); lctx.stroke(); }
    else if (tool==="rect-stroke") { lctx.strokeRect(s.x,s.y,pt.x-s.x,pt.y-s.y); }
    else if (tool==="rect-fill")   { lctx.fillRect(s.x,s.y,pt.x-s.x,pt.y-s.y); }
    else if (tool==="ellipse-stroke"||tool==="ellipse-fill") {
      const rx=Math.abs(pt.x-s.x)/2, ry=Math.abs(pt.y-s.y)/2;
      lctx.ellipse(s.x+(pt.x-s.x)/2,s.y+(pt.y-s.y)/2,rx||.1,ry||.1,0,0,Math.PI*2);
      tool==="ellipse-fill" ? lctx.fill() : lctx.stroke();
    }
    else if (tool==="gradient") {
      if (snapshotRef.current) lctx.putImageData(snapshotRef.current,0,0);
      const grad=lctx.createLinearGradient(s.x,s.y,pt.x,pt.y);
      grad.addColorStop(0,fgColor); grad.addColorStop(1,bgColor);
      lctx.globalAlpha=opacity/100; lctx.fillStyle=grad; lctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    }
    lctx.globalAlpha=1; composite();
  };

  const onMouseUp = () => {
    selStartRef.current=null; isDrawing.current=false;
    snapshotRef.current=null; startPt.current=null; lastPt.current=null;
  };

  // ── Dodge/Burn ──
  const dodgeBurn = (lctx: CanvasRenderingContext2D, x: number, y: number) => {
    const r=brushSize*2, ox=Math.max(0,x-r), oy=Math.max(0,y-r);
    const img=lctx.getImageData(ox,oy,r*2,r*2);
    const f=tool==="dodge"?1.15:0.85;
    for (let i=0;i<img.data.length;i+=4) {
      img.data[i]  =Math.min(255,img.data[i]*f);
      img.data[i+1]=Math.min(255,img.data[i+1]*f);
      img.data[i+2]=Math.min(255,img.data[i+2]*f);
    }
    lctx.putImageData(img,ox,oy);
  };

  // ── Flood fill ──
  const floodFill = (lctx: CanvasRenderingContext2D, sx: number, sy: number, color: string) => {
    const img=lctx.getImageData(0,0,CANVAS_W,CANVAS_H), d=img.data;
    const {r:nr,g:ng,b:nb}=hexToRgb(color);
    const si=(Math.floor(sy)*CANVAS_W+Math.floor(sx))*4;
    const [sr,sg,sb,sa]=[d[si],d[si+1],d[si+2],d[si+3]];
    if (sr===nr&&sg===ng&&sb===nb) return;
    const stack=[si], seen=new Uint8Array(d.length/4);
    while (stack.length) {
      const i=stack.pop()!, p=i>>2;
      if (seen[p]||d[i]!==sr||d[i+1]!==sg||d[i+2]!==sb||d[i+3]!==sa) continue;
      seen[p]=1; d[i]=nr; d[i+1]=ng; d[i+2]=nb; d[i+3]=255;
      const x=p%CANVAS_W, y=Math.floor(p/CANVAS_W);
      if (x>0) stack.push(i-4);
      if (x<CANVAS_W-1) stack.push(i+4);
      if (y>0) stack.push(i-CANVAS_W*4);
      if (y<CANVAS_H-1) stack.push(i+CANVAS_W*4);
    }
    lctx.putImageData(img,0,0);
  };

  // ── Text commit ──
  const commitText = () => {
    if (!textPos||!textInput) return;
    const layer=getActive(); if (!layer) return;
    pushUndo();
    const lctx=lctxOf(layer);
    lctx.font=`${fontSize}px ${fontFamily}`; lctx.fillStyle=fgColor;
    lctx.globalAlpha=opacity/100; lctx.fillText(textInput,textPos.x,textPos.y);
    lctx.globalAlpha=1; setTextPos(null); setTextInput(""); composite();
  };

  // ── Layer operations ──
  const addLayer = () => {
    const l=makeLayer(`Layer ${layersRef.current.length+1}`);
    layersRef.current=[...layersRef.current,l]; activeIdRef.current=l.id;
    composite(); forceUpdate();
  };

  const deleteLayer = () => {
    if (layersRef.current.length<=1) return;
    layersRef.current=layersRef.current.filter(l=>l.id!==activeIdRef.current);
    activeIdRef.current=layersRef.current.at(-1)!.id;
    composite(); forceUpdate();
  };

  const duplicateLayer = () => {
    const a=getActive(); if (!a) return;
    const dup:Layer={...a, id:Math.random().toString(36).slice(2), name:a.name+" copy",
      canvas:(()=>{const c=document.createElement("canvas");c.width=CANVAS_W;c.height=CANVAS_H;c.getContext("2d")!.drawImage(a.canvas,0,0);return c;})()};
    const idx=layersRef.current.findIndex(l=>l.id===a.id);
    layersRef.current=[...layersRef.current.slice(0,idx+1),dup,...layersRef.current.slice(idx+1)];
    activeIdRef.current=dup.id; composite(); forceUpdate();
  };

  const mergeVisible = () => {
    pushUndo();
    const m=makeLayer("Merged"); const mc=lctxOf(m);
    for (const l of layersRef.current) {
      if (!l.visible) continue;
      mc.globalAlpha=l.opacity/100; mc.globalCompositeOperation=l.blendMode as GlobalCompositeOperation;
      mc.drawImage(l.canvas,0,0);
    }
    mc.globalAlpha=1; mc.globalCompositeOperation="source-over";
    layersRef.current=[m]; activeIdRef.current=m.id; composite(); forceUpdate();
  };

  const moveLayer = (dir: 1|-1) => {
    const idx=layersRef.current.findIndex(l=>l.id===activeIdRef.current);
    const next=idx+dir;
    if (next<0||next>=layersRef.current.length) return;
    const arr=[...layersRef.current];
    [arr[idx],arr[next]]=[arr[next],arr[idx]];
    layersRef.current=arr; composite(); forceUpdate();
  };

  const toggleVisible = (id:string) => {
    const l=layersRef.current.find(x=>x.id===id); if(!l) return;
    l.visible=!l.visible; composite(); forceUpdate();
  };

  const toggleLock = (id:string) => {
    const l=layersRef.current.find(x=>x.id===id); if(!l) return;
    l.locked=!l.locked; forceUpdate();
  };

  const setLayerOp = (id:string, val:number) => {
    const l=layersRef.current.find(x=>x.id===id); if(!l) return;
    l.opacity=val; composite(); forceUpdate();
  };

  const setLayerBm = (id:string, bm:BlendMode) => {
    const l=layersRef.current.find(x=>x.id===id); if(!l) return;
    l.blendMode=bm; composite(); forceUpdate();
  };

  // ── Selection ops ──
  const copySelection = useCallback(() => {
    if (!selection) return;
    const layer=getActive(); if (!layer) return;
    setClipboard(lctxOf(layer).getImageData(selection.x,selection.y,Math.max(1,selection.w),Math.max(1,selection.h)));
  }, [selection]);

  const cutSelection = useCallback(() => {
    if (!selection) return;
    const layer=getActive(); if (!layer||layer.locked) return;
    pushUndo();
    const lctx=lctxOf(layer);
    setClipboard(lctx.getImageData(selection.x,selection.y,Math.max(1,selection.w),Math.max(1,selection.h)));
    lctx.clearRect(selection.x,selection.y,selection.w,selection.h); composite();
  }, [selection, pushUndo, composite]);

  const pasteClipboard = useCallback(() => {
    if (!clipboard) return;
    const layer=getActive(); if (!layer||layer.locked) return;
    pushUndo(); lctxOf(layer).putImageData(clipboard,0,0); composite();
  }, [clipboard, pushUndo, composite]);

  // ── Image operations ──
  const withActive = (fn: (lctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void) => {
    const layer=getActive(); if (!layer||layer.locked) return;
    pushUndo(); fn(lctxOf(layer), layer.canvas); composite();
  };

  const withTemp = (fn:(tc:CanvasRenderingContext2D,src:HTMLCanvasElement)=>void) => {
    withActive((lctx,src)=>{
      const t=document.createElement("canvas"); t.width=CANVAS_W; t.height=CANVAS_H;
      fn(t.getContext("2d")!,src);
      lctx.clearRect(0,0,CANVAS_W,CANVAS_H); lctx.drawImage(t,0,0);
    });
  };

  const flipH = () => withTemp((tc,s)=>{ tc.translate(CANVAS_W,0); tc.scale(-1,1); tc.drawImage(s,0,0); });
  const flipV = () => withTemp((tc,s)=>{ tc.translate(0,CANVAS_H); tc.scale(1,-1); tc.drawImage(s,0,0); });
  const rotate90 = () => withTemp((tc,s)=>{ tc.translate(CANVAS_W/2,CANVAS_H/2); tc.rotate(Math.PI/2); tc.drawImage(s,-CANVAS_W/2,-CANVAS_H/2); });

  const invertColors = () => withActive(lctx=>{
    const img=lctx.getImageData(0,0,CANVAS_W,CANVAS_H);
    for (let i=0;i<img.data.length;i+=4){ img.data[i]=255-img.data[i]; img.data[i+1]=255-img.data[i+1]; img.data[i+2]=255-img.data[i+2]; }
    lctx.putImageData(img,0,0);
  });

  const grayscale = () => withActive(lctx=>{
    const img=lctx.getImageData(0,0,CANVAS_W,CANVAS_H);
    for (let i=0;i<img.data.length;i+=4){ const g=0.299*img.data[i]+0.587*img.data[i+1]+0.114*img.data[i+2]; img.data[i]=img.data[i+1]=img.data[i+2]=g; }
    lctx.putImageData(img,0,0);
  });

  const brightness = (delta:number) => withActive(lctx=>{
    const img=lctx.getImageData(0,0,CANVAS_W,CANVAS_H);
    for (let i=0;i<img.data.length;i+=4){ img.data[i]=Math.min(255,Math.max(0,img.data[i]+delta)); img.data[i+1]=Math.min(255,Math.max(0,img.data[i+1]+delta)); img.data[i+2]=Math.min(255,Math.max(0,img.data[i+2]+delta)); }
    lctx.putImageData(img,0,0);
  });

  const applyBlur = () => withActive((lctx,src)=>{
    const t=document.createElement("canvas"); t.width=CANVAS_W; t.height=CANVAS_H;
    const tc=t.getContext("2d")!; tc.filter="blur(3px)"; tc.drawImage(src,0,0); tc.filter="none";
    lctx.clearRect(0,0,CANVAS_W,CANVAS_H); lctx.drawImage(t,0,0);
  });

  const applySharpen = () => withActive(lctx=>{ lctx.putImageData(applyKernel(lctx.getImageData(0,0,CANVAS_W,CANVAS_H),[0,-1,0,-1,5,-1,0,-1,0],1),0,0); });
  const applyEmboss  = () => withActive(lctx=>{ lctx.putImageData(applyKernel(lctx.getImageData(0,0,CANVAS_W,CANVAS_H),[-2,-1,0,-1,1,1,0,1,2],1),0,0); });

  // ── Export ──
  const exportPng  = () => { const a=document.createElement("a"); a.download="image.png";  a.href=displayRef.current!.toDataURL("image/png"); a.click(); };
  const exportJpeg = () => { const a=document.createElement("a"); a.download="image.jpg";  a.href=displayRef.current!.toDataURL("image/jpeg",0.92); a.click(); };

  const openImage = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]; if (!file) return;
    const url=URL.createObjectURL(file), img=new Image();
    img.onload=()=>{ const l=getActive(); if(!l) return; pushUndo(); lctxOf(l).drawImage(img,0,0,CANVAS_W,CANVAS_H); URL.revokeObjectURL(url); composite(); };
    img.src=url; e.target.value="";
  };

  // ── Keyboard shortcuts ──
  useEffect(()=>{
    const toolMap:Record<string,Tool>={p:"pencil",e:"eraser",l:"line",r:"rect-stroke",o:"ellipse-stroke",f:"fill",k:"eyedrop",s:"select-rect",m:"move",t:"text",g:"gradient",d:"dodge",b:"burn"};
    const fn=(ev:KeyboardEvent)=>{
      if ((ev.target as HTMLElement).tagName==="INPUT"||(ev.target as HTMLElement).tagName==="TEXTAREA") return;
      if (toolMap[ev.key.toLowerCase()]) setTool(toolMap[ev.key.toLowerCase()]);
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="z"){ev.preventDefault();undo();}
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="y"){ev.preventDefault();redo();}
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="a"){ev.preventDefault();setSelection({x:0,y:0,w:CANVAS_W,h:CANVAS_H});}
      if (ev.key==="Escape"){setSelection(null);setTextPos(null);}
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="c") copySelection();
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="x") cutSelection();
      if ((ev.ctrlKey||ev.metaKey)&&ev.key==="v") pasteClipboard();
    };
    window.addEventListener("keydown",fn);
    return ()=>window.removeEventListener("keydown",fn);
  },[undo,redo,copySelection,cutSelection,pasteClipboard]);

  // ── Menu definitions ──
  type MenuItem = {label:string;shortcut?:string;action?:()=>void;disabled?:boolean;sep?:boolean};
  const MENUS:Record<string,MenuItem[]> = {
    File:[
      {label:"New",          shortcut:"Ctrl+N",       action:()=>withActive(lctx=>{lctx.fillStyle="#fff";lctx.fillRect(0,0,CANVAS_W,CANVAS_H);})},
      {label:"Open Image…",  shortcut:"Ctrl+O",       action:()=>fileRef.current?.click()},
      {sep:true,label:""},
      {label:"Export as PNG", shortcut:"Shift+Ctrl+E", action:exportPng},
      {label:"Export as JPEG",                          action:exportJpeg},
      {sep:true,label:""},
      {label:"Quit",          shortcut:"Ctrl+Q",       action:()=>{}},
    ],
    Edit:[
      {label:"Undo",       shortcut:"Ctrl+Z", action:undo,          disabled:!canUndo},
      {label:"Redo",       shortcut:"Ctrl+Y", action:redo,          disabled:!canRedo},
      {sep:true,label:""},
      {label:"Cut",        shortcut:"Ctrl+X", action:cutSelection,  disabled:!selection},
      {label:"Copy",       shortcut:"Ctrl+C", action:copySelection, disabled:!selection},
      {label:"Paste",      shortcut:"Ctrl+V", action:pasteClipboard,disabled:!clipboard},
      {sep:true,label:""},
      {label:"Select All", shortcut:"Ctrl+A", action:()=>setSelection({x:0,y:0,w:CANVAS_W,h:CANVAS_H})},
      {label:"Deselect",   shortcut:"Esc",    action:()=>setSelection(null), disabled:!selection},
    ],
    Image:[
      {label:"Flip Horizontally", action:flipH},
      {label:"Flip Vertically",   action:flipV},
      {label:"Rotate 90° CW",     action:rotate90},
      {sep:true,label:""},
      {label:"Invert Colors",     shortcut:"Ctrl+I", action:invertColors},
      {label:"Desaturate",                            action:grayscale},
      {label:"Brightness +20",    action:()=>brightness(20)},
      {label:"Brightness -20",    action:()=>brightness(-20)},
      {sep:true,label:""},
      {label:"Merge Visible",     action:mergeVisible},
    ],
    Filters:[
      {label:"Blur",    action:applyBlur},
      {label:"Sharpen", action:applySharpen},
      {label:"Emboss",  action:applyEmboss},
    ],
    "Script-Fu":[
      {label:"Console…", action:()=>alert("Script-Fu Console\n\nNot implemented in this mock.")},
    ],
    Help:[
      {label:"About GIMP 2.10", action:()=>alert("GNU Image Manipulation Program\nVersion 2.10 (mock)\nrodriwu.io")},
    ],
  };

  // ── Tools ──
  const TOOLS:{id:Tool;icon:React.ElementType;label:string;key:string}[] = [
    {id:"pencil",         icon:Pencil,    label:"Pencil",        key:"P"},
    {id:"eraser",         icon:Eraser,    label:"Eraser",        key:"E"},
    {id:"select-rect",    icon:Square,    label:"Rect Select",   key:"S"},
    {id:"move",           icon:Move,      label:"Move",          key:"M"},
    {id:"line",           icon:Minus,     label:"Line",          key:"L"},
    {id:"rect-stroke",    icon:Square,    label:"Rectangle",     key:"R"},
    {id:"ellipse-stroke", icon:Circle,    label:"Ellipse",       key:"O"},
    {id:"rect-fill",      icon:Square,    label:"Filled Rect",   key:""},
    {id:"ellipse-fill",   icon:Circle,    label:"Filled Ellipse",key:""},
    {id:"fill",           icon:Paintbrush,label:"Bucket Fill",   key:"F"},
    {id:"gradient",       icon:Paintbrush,label:"Gradient",      key:"G"},
    {id:"text",           icon:Type,      label:"Text",          key:"T"},
    {id:"eyedrop",        icon:Pipette,   label:"Color Picker",  key:"K"},
    {id:"dodge",          icon:Pencil,    label:"Dodge",         key:"D"},
    {id:"burn",           icon:Pencil,    label:"Burn",          key:"B"},
  ];

  // ── Colors ──
  const BG="#3c3c3c", BG2="#4a4a4a", BG3="#2e2e2e";
  const BORDER="#222", TEXT="rgba(255,255,255,0.82)", TEXTD="rgba(255,255,255,0.35)";
  const ACCENT="#6a9ec5";

  const layers=layersRef.current, activeId=activeIdRef.current;
  const activeLayer=layers.find(l=>l.id===activeId);

  const CURSOR_MAP:Record<Tool,string>={
    pencil:"crosshair",eraser:"cell","select-rect":"crosshair",move:"move",
    line:"crosshair","rect-stroke":"crosshair","rect-fill":"crosshair",
    "ellipse-stroke":"crosshair","ellipse-fill":"crosshair",
    fill:"crosshair",gradient:"crosshair",text:"text",
    eyedrop:"zoom-in",dodge:"crosshair",burn:"crosshair",
  };

  return (
    <div
      style={{height:"100%",display:"flex",flexDirection:"column",background:BG,userSelect:"none",fontFamily:"JetBrains Mono, monospace",fontSize:12,color:TEXT}}
      onPointerDown={()=>setOpenMenu(null)}
    >
      {/* ── Menu bar ── */}
      <div style={{display:"flex",alignItems:"center",background:BG2,borderBottom:`1px solid ${BORDER}`,flexShrink:0,paddingLeft:4}}
        onPointerDown={e=>e.stopPropagation()}>
        {Object.entries(MENUS).map(([name,items])=>(
          <div key={name} style={{position:"relative"}}>
            <button onClick={()=>setOpenMenu(openMenu===name?null:name)}
              style={{padding:"4px 10px",background:openMenu===name?"rgba(255,255,255,0.14)":"transparent",border:"none",color:TEXT,cursor:"pointer",fontSize:12,borderRadius:3}}>
              {name}
            </button>
            {openMenu===name&&(
              <div style={{position:"absolute",top:"100%",left:0,zIndex:999,background:"#4a4a4a",border:`1px solid ${BORDER}`,boxShadow:"0 6px 20px rgba(0,0,0,0.5)",borderRadius:4,minWidth:220,padding:"3px 0"}}
                onPointerDown={e=>e.stopPropagation()}>
                {items.map((item,i)=>item.sep?(
                  <div key={i} style={{height:1,background:"rgba(255,255,255,0.1)",margin:"3px 0"}}/>
                ):(
                  <button key={i} disabled={item.disabled} onClick={()=>{item.action?.();setOpenMenu(null);}}
                    style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"5px 14px",background:"transparent",border:"none",color:item.disabled?TEXTD:TEXT,cursor:item.disabled?"default":"pointer",fontSize:12,gap:24,textAlign:"left"}}
                    onMouseEnter={e=>{if(!item.disabled)(e.currentTarget.style.background="rgba(255,255,255,0.12)");}}
                    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                    <span>{item.label}</span>
                    {item.shortcut&&<span style={{fontSize:10,color:TEXTD}}>{item.shortcut}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div style={{flex:1}}/>
        <button onClick={()=>fileRef.current?.click()} style={{...iconBtn,padding:"4px 7px"}} title="Open"><FolderOpen size={13}/></button>
        <button onClick={exportPng} style={{...iconBtn,padding:"4px 7px"}} title="Export PNG"><Download size={13}/></button>
        <button onClick={undo} disabled={!canUndo} style={{...iconBtn,padding:"4px 7px",color:canUndo?TEXT:TEXTD,cursor:canUndo?"pointer":"default"}} title="Undo"><Undo2 size={13}/></button>
        <button onClick={redo} disabled={!canRedo} style={{...iconBtn,padding:"4px 7px",color:canRedo?TEXT:TEXTD,cursor:canRedo?"pointer":"default"}} title="Redo"><Redo2 size={13}/></button>
        <input ref={fileRef} type="file" accept="image/*" onChange={openImage} style={{display:"none"}}/>
      </div>

      {/* ── Body ── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── Toolbox ── */}
        <div style={{width:52,flexShrink:0,background:"#3a3a3a",borderRight:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"6px 4px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
            {TOOLS.map(({id,icon:Icon,label,key})=>(
              <button key={id} onClick={()=>setTool(id)} title={`${label}${key?" ("+key+")":""}`}
                style={{width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:3,cursor:"pointer",
                  background:tool===id?"rgba(255,255,255,0.22)":"rgba(0,0,0,0.18)",
                  border:tool===id?"1px solid rgba(255,255,255,0.35)":"1px solid rgba(0,0,0,0.4)",
                  color:tool===id?"rgba(255,255,255,0.98)":"rgba(255,255,255,0.55)"}}
                onMouseEnter={e=>{if(tool!==id)(e.currentTarget.style.background="rgba(255,255,255,0.1)");}}
                onMouseLeave={e=>{if(tool!==id)(e.currentTarget.style.background="rgba(0,0,0,0.18)");}}
              ><Icon size={11} strokeWidth={1.8}/></button>
            ))}
          </div>

          <div style={{width:44,borderTop:"1px solid rgba(255,255,255,0.1)",margin:"2px auto"}}/>

          {/* FG/BG */}
          <div style={{padding:"4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{position:"relative",width:34,height:30}}>
              <div onClick={()=>{const t=fgColor;setFgColor(bgColor);setBgColor(t);}} title="Swap"
                style={{position:"absolute",bottom:0,right:0,width:16,height:16,borderRadius:2,background:bgColor,border:"1.5px solid rgba(0,0,0,0.6)",cursor:"pointer"}}/>
              <label style={{position:"absolute",top:0,left:0,cursor:"pointer"}}>
                <div style={{width:18,height:18,borderRadius:2,background:fgColor,border:"1.5px solid rgba(0,0,0,0.6)",boxShadow:"0 2px 5px rgba(0,0,0,0.55)"}}/>
                <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} style={{position:"absolute",opacity:0,width:0,height:0}}/>
              </label>
            </div>
          </div>

          <div style={{width:44,borderTop:"1px solid rgba(255,255,255,0.1)",margin:"2px auto"}}/>

          {/* Brush size */}
          <div style={{padding:"4px 6px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{color:TEXTD,fontSize:8,letterSpacing:"0.06em"}}>SIZE</span>
            <button onClick={()=>setBrushSize(s=>Math.max(1,s-1))} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:14,lineHeight:1,padding:"1px 3px"}}>−</button>
            <span style={{color:TEXT,fontSize:10,minWidth:20,textAlign:"center"}}>{brushSize}</span>
            <button onClick={()=>setBrushSize(s=>Math.min(200,s+1))} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:14,lineHeight:1,padding:"1px 3px"}}>+</button>
            <div style={{marginTop:2,borderRadius:"50%",background:fgColor,border:"1px solid rgba(255,255,255,0.2)",flexShrink:0,
              width:Math.min(38,Math.max(3,brushSize)),height:Math.min(38,Math.max(3,brushSize))}}/>
          </div>
        </div>

        {/* ── Center: tool options + canvas ── */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>

          {/* Tool options strip */}
          <div style={{flexShrink:0,background:BG3,borderBottom:`1px solid ${BORDER}`,padding:"4px 10px",display:"flex",alignItems:"center",gap:14,fontSize:11}}>
            <span style={{color:TEXTD}}>Opacity</span>
            <input type="range" min={1} max={100} value={opacity} onChange={e=>setOpacity(+e.target.value)} style={{width:70,accentColor:ACCENT}}/>
            <span style={{color:TEXT,minWidth:26}}>{opacity}%</span>
            {(tool==="pencil"||tool==="eraser")&&<>
              <span style={{color:TEXTD}}>Hardness</span>
              <input type="range" min={0} max={100} value={hardness} onChange={e=>setHardness(+e.target.value)} style={{width:70,accentColor:ACCENT}}/>
              <span style={{color:TEXT,minWidth:26}}>{hardness}%</span>
            </>}
            {tool==="text"&&<>
              <span style={{color:TEXTD}}>Size</span>
              <input type="number" min={6} max={200} value={fontSize} onChange={e=>setFontSize(+e.target.value)}
                style={{width:44,background:"rgba(0,0,0,0.3)",border:`1px solid ${BORDER}`,color:TEXT,padding:"1px 4px",borderRadius:3}}/>
              <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)}
                style={{background:BG2,border:`1px solid ${BORDER}`,color:TEXT,padding:"1px 4px",borderRadius:3,fontSize:11}}>
                {["sans-serif","serif","monospace","cursive"].map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </>}
            <div style={{flex:1}}/>
            {selection&&<span style={{color:TEXTD,fontSize:10}}>Sel: {selection.w}×{selection.h}</span>}
          </div>

          {/* Canvas scroll area */}
          <div style={{flex:1,overflow:"auto",background:"#2a2a2a",padding:16,display:"flex",alignItems:"flex-start",justifyContent:"flex-start",position:"relative"}}>
            <div style={{transform:`scale(${zoom})`,transformOrigin:"top left",boxShadow:"0 6px 32px rgba(0,0,0,0.7)",display:"inline-block",lineHeight:0,position:"relative"}}>
              <canvas ref={displayRef} width={CANVAS_W} height={CANVAS_H}
                style={{display:"block",cursor:CURSOR_MAP[tool]}}
                onMouseDown={onMouseDown} onMouseMove={onMouseMove}
                onMouseUp={onMouseUp} onMouseLeave={onMouseUp}/>
              {textPos&&(
                <div style={{position:"absolute",top:textPos.y*zoom,left:textPos.x*zoom,zIndex:10}}>
                  <input autoFocus value={textInput} onChange={e=>setTextInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")commitText();if(e.key==="Escape"){setTextPos(null);setTextInput("");}}}
                    style={{background:"rgba(0,0,0,0.55)",border:"1px solid rgba(255,255,255,0.4)",color:fgColor,padding:"2px 4px",fontSize:`${fontSize*zoom}px`,fontFamily,outline:"none",minWidth:80}}/>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Layers panel ── */}
        <div style={{width:194,flexShrink:0,background:"#3a3a3a",borderLeft:`1px solid ${BORDER}`,display:"flex",flexDirection:"column"}}>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:`1px solid ${BORDER}`}}>
            {(["layers","channels","paths"] as const).map(tab=>(
              <button key={tab} onClick={()=>setRightTab(tab)}
                style={{flex:1,padding:"5px 2px",background:rightTab===tab?"rgba(255,255,255,0.08)":"transparent",border:"none",
                  borderBottom:rightTab===tab?`2px solid ${ACCENT}`:"2px solid transparent",
                  color:rightTab===tab?TEXT:TEXTD,cursor:"pointer",fontSize:10,textTransform:"capitalize",letterSpacing:"0.04em"}}>
                {tab}
              </button>
            ))}
          </div>

          {rightTab==="layers"&&<>
            {/* Layer controls row */}
            <div style={{padding:"5px 7px",display:"flex",alignItems:"center",gap:3,borderBottom:`1px solid ${BORDER}`}}>
              <span style={{color:TEXTD,fontSize:10,flex:1}}>Layers</span>
              <button onClick={addLayer}       title="New"       style={iconBtn}><Plus       size={11}/></button>
              <button onClick={duplicateLayer} title="Duplicate" style={iconBtn}><Copy       size={11}/></button>
              <button onClick={deleteLayer}    title="Delete"    style={{...iconBtn,color:layers.length<=1?TEXTD:"rgba(255,255,255,0.6)"}} disabled={layers.length<=1}><Trash2     size={11}/></button>
              <button onClick={()=>moveLayer(1)}  title="Up"    style={iconBtn}><ChevronUp   size={11}/></button>
              <button onClick={()=>moveLayer(-1)} title="Down"  style={iconBtn}><ChevronDown size={11}/></button>
            </div>

            {/* Active layer opacity + blend mode */}
            {activeLayer&&(
              <div style={{padding:"5px 8px",borderBottom:`1px solid ${BORDER}`,display:"flex",flexDirection:"column",gap:4}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:TEXTD,fontSize:10,minWidth:38}}>Opacity</span>
                  <input type="range" min={0} max={100} value={activeLayer.opacity} onChange={e=>setLayerOp(activeId,+e.target.value)} style={{flex:1,accentColor:ACCENT}}/>
                  <span style={{color:TEXT,fontSize:10,minWidth:22,textAlign:"right"}}>{activeLayer.opacity}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:TEXTD,fontSize:10,minWidth:38}}>Mode</span>
                  <select value={activeLayer.blendMode} onChange={e=>setLayerBm(activeId,e.target.value as BlendMode)}
                    style={{flex:1,background:BG2,border:`1px solid ${BORDER}`,color:TEXT,fontSize:10,padding:"1px 2px",borderRadius:3}}>
                    {BLEND_MODES.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* Layer list */}
            <div style={{flex:1,overflowY:"auto"}}>
              {[...layers].reverse().map(layer=>(
                <div key={layer.id} onClick={()=>{activeIdRef.current=layer.id;forceUpdate();}}
                  style={{display:"flex",alignItems:"center",gap:4,padding:"5px 7px",cursor:"pointer",
                    background:layer.id===activeId?"rgba(106,158,197,0.2)":"transparent",
                    borderBottom:`1px solid rgba(0,0,0,0.2)`}}
                  onMouseEnter={e=>{if(layer.id!==activeId)(e.currentTarget.style.background="rgba(255,255,255,0.05)");}}
                  onMouseLeave={e=>{if(layer.id!==activeId)(e.currentTarget.style.background="transparent");}}>
                  <button onClick={e=>{e.stopPropagation();toggleVisible(layer.id);}} style={{...iconBtn,padding:0,color:layer.visible?TEXT:TEXTD}}>
                    {layer.visible?<Eye size={11}/>:<EyeOff size={11}/>}
                  </button>
                  <button onClick={e=>{e.stopPropagation();toggleLock(layer.id);}} style={{...iconBtn,padding:0,color:layer.locked?"#ffa":TEXTD}}>
                    {layer.locked?<Lock size={10}/>:<Unlock size={10}/>}
                  </button>
                  {/* Thumbnail - key forces re-mount on layerVer change */}
                  <canvas key={`${layer.id}-${layerVer}`} width={28} height={20}
                    style={{borderRadius:2,border:`1px solid rgba(255,255,255,0.15)`,flexShrink:0}}
                    ref={el=>{if(el){const tc=el.getContext("2d")!;tc.clearRect(0,0,28,20);tc.drawImage(layer.canvas,0,0,28,20);}}}/>
                  <span style={{flex:1,fontSize:10,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                    color:layer.id===activeId?TEXT:TEXTD}}>
                    {layer.name}
                  </span>
                </div>
              ))}
            </div>

            <div style={{padding:"5px 8px",borderTop:`1px solid ${BORDER}`,display:"flex",gap:4}}>
              <button onClick={mergeVisible} style={smallBtn}>Merge visible</button>
            </div>
          </>}

          {rightTab==="channels"&&(
            <div style={{padding:10,color:TEXTD,fontSize:11}}>
              <p style={{marginBottom:8}}>Channels</p>
              {["Red","Green","Blue","Alpha"].map(ch=>(
                <div key={ch} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}>
                  <Eye size={10} style={{color:TEXT}}/>
                  <div style={{width:20,height:14,background:ch==="Red"?"#f00":ch==="Green"?"#0f0":ch==="Blue"?"#00f":"#888",borderRadius:2,opacity:0.7}}/>
                  <span style={{fontSize:10}}>{ch}</span>
                </div>
              ))}
            </div>
          )}

          {rightTab==="paths"&&(
            <div style={{padding:10,color:TEXTD,fontSize:11}}>
              <p>No paths defined.</p>
              <p style={{marginTop:6,fontSize:10,opacity:0.5}}>Use the path tool to create Bezier curves.</p>
            </div>
          )}

          {/* Color palette */}
          <div style={{borderTop:`1px solid ${BORDER}`,padding:"5px",display:"flex",flexWrap:"wrap",gap:2}}>
            {PALETTE.map(c=>(
              <button key={c} onClick={()=>setFgColor(c)} onContextMenu={e=>{e.preventDefault();setBgColor(c);}} title={c}
                style={{width:13,height:13,borderRadius:2,background:c,cursor:"pointer",flexShrink:0,
                  border:fgColor===c?"2px solid rgba(255,255,255,0.9)":"1px solid rgba(0,0,0,0.5)"}}/>
            ))}
            <label title="Custom color" style={{cursor:"pointer"}}>
              <div style={{width:13,height:13,borderRadius:2,background:"conic-gradient(red,yellow,lime,cyan,blue,magenta,red)",border:"1px solid rgba(255,255,255,0.18)"}}/>
              <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} style={{position:"absolute",opacity:0,width:0,height:0}}/>
            </label>
          </div>
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{flexShrink:0,padding:"3px 10px",background:BG2,borderTop:`1px solid ${BORDER}`,display:"flex",alignItems:"center",gap:16,fontSize:11,color:TEXTD}}>
        <span>{CANVAS_W}×{CANVAS_H} px</span>
        <span>x:{coords.x} y:{coords.y}</span>
        <span style={{textTransform:"capitalize"}}>{tool}</span>
        <span>{layers.length} layer{layers.length!==1?"s":""}</span>
        <div style={{flex:1}}/>
        <button onClick={()=>setZoom(z=>Math.max(0.25,+(z-0.25).toFixed(2)))} style={{...iconBtn,color:TEXTD}}><ZoomOut size={11}/></button>
        <span style={{minWidth:36,textAlign:"center",color:TEXT}}>{Math.round(zoom*100)}%</span>
        <button onClick={()=>setZoom(z=>Math.min(4,+(z+0.25).toFixed(2)))} style={{...iconBtn,color:TEXTD}}><ZoomIn size={11}/></button>
      </div>
    </div>
  );
}

