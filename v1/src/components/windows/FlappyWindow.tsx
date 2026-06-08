"use client";

import { useRef, useEffect, useCallback } from "react";

// ── Game constants ──────────────────────────────────────────────────────────
const W           = 400;
const H           = 580;
const GRAVITY     = 0.38;
const JUMP        = -7.8;
const BIRD_X      = 80;
const BIRD_R      = 14;
const PIPE_W      = 54;
const PIPE_GAP    = 148;
const PIPE_SPEED  = 2.5;
const PIPE_EVERY  = 1500; // ms
const GROUND_H    = 82;

type Phase = "idle" | "playing" | "dead";

interface GameState {
  phase:     Phase;
  birdY:     number;
  birdVY:    number;
  birdAngle: number;
  pipes:     { x: number; gapY: number; scored: boolean }[];
  score:     number;
  best:      number;
  scroll:    number;
  lastPipe:  number;
  raf:       number;
  lastTs:    number;
}

// ── Canvas helpers ──────────────────────────────────────────────────────────
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function drawBackground(ctx: CanvasRenderingContext2D, scroll: number) {
  // Sky
  const sky = ctx.createLinearGradient(0,0,0,H-GROUND_H);
  sky.addColorStop(0,"#4ec0ca"); sky.addColorStop(1,"#87d8e0");
  ctx.fillStyle = sky; ctx.fillRect(0,0,W,H-GROUND_H);

  // Clouds
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  const clouds = [[55,55,46,18],[155,38,62,22],[275,62,42,16],[340,42,56,20],[480,50,50,18]];
  for (const [cx,cy,cw,ch] of clouds) {
    const rx = ((cx - scroll * 0.28) % (W+140) + W+140) % (W+140) - 70;
    ctx.beginPath(); ctx.ellipse(rx,cy,cw,ch,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(rx-cw*0.42,cy+ch*0.22,cw*0.62,ch*0.76,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(rx+cw*0.38,cy+ch*0.18,cw*0.58,ch*0.72,0,0,Math.PI*2); ctx.fill();
  }

  // Ground dirt
  ctx.fillStyle = "#ded895"; ctx.fillRect(0,H-GROUND_H,W,GROUND_H);
  ctx.fillStyle = "#c4a83d"; ctx.fillRect(0,H-GROUND_H,W,14);
  // Ground stripes
  const stripeW = 38;
  const off = (-(scroll * 1.6) % stripeW + stripeW) % stripeW;
  ctx.fillStyle = "#b89a30";
  for (let x = off - stripeW; x < W; x += stripeW)
    ctx.fillRect(x, H-GROUND_H, stripeW*0.5, 14);

  // Grass
  ctx.fillStyle = "#5cb85c"; ctx.fillRect(0,H-GROUND_H-8,W,10);
  ctx.fillStyle = "#4cae4c"; ctx.fillRect(0,H-GROUND_H-4,W,5);
}

function drawPipe(ctx: CanvasRenderingContext2D, x: number, gapY: number) {
  const half   = PIPE_GAP / 2;
  const topBot = gapY - half;       // bottom edge of top pipe
  const botTop = gapY + half;       // top edge of bottom pipe
  const botBot = H - GROUND_H + 4;

  const grad = (x: number) => {
    const g = ctx.createLinearGradient(x,0,x+PIPE_W,0);
    g.addColorStop(0,"#4ab83f"); g.addColorStop(0.45,"#6ed35f"); g.addColorStop(1,"#2d8027");
    return g;
  };

  // Top shaft
  ctx.fillStyle = grad(x); ctx.fillRect(x, 0, PIPE_W, topBot);
  // Top cap
  ctx.fillStyle = "#54c448"; rrect(ctx, x-6, topBot-28, PIPE_W+12, 30, 4); ctx.fill();
  ctx.strokeStyle = "#237a1e"; ctx.lineWidth = 2; ctx.stroke();

  // Bottom shaft
  ctx.fillStyle = grad(x); ctx.fillRect(x, botTop, PIPE_W, botBot - botTop);
  // Bottom cap
  ctx.fillStyle = "#54c448"; rrect(ctx, x-6, botTop-2, PIPE_W+12, 30, 4); ctx.fill();
  ctx.strokeStyle = "#237a1e"; ctx.lineWidth = 2; ctx.stroke();
}

function drawBird(ctx: CanvasRenderingContext2D, y: number, angle: number) {
  ctx.save();
  ctx.translate(BIRD_X, y);
  ctx.rotate(angle);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.beginPath(); ctx.ellipse(2,BIRD_R+2,BIRD_R*0.9,5,0,0,Math.PI*2); ctx.fill();

  // Body
  ctx.fillStyle = "#f9c93c";
  ctx.beginPath(); ctx.ellipse(0,0,BIRD_R,BIRD_R-1,0,0,Math.PI*2); ctx.fill();

  // Wing
  ctx.fillStyle = "#f4a800";
  ctx.beginPath(); ctx.ellipse(-4,4,9,5,-0.25,0,Math.PI*2); ctx.fill();

  // Eye white
  ctx.fillStyle = "white";
  ctx.beginPath(); ctx.arc(5,-5,5.5,0,Math.PI*2); ctx.fill();
  // Pupil
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.arc(6.5,-5,2.8,0,Math.PI*2); ctx.fill();
  // Shine
  ctx.fillStyle = "white";
  ctx.beginPath(); ctx.arc(7.8,-6.2,1,0,Math.PI*2); ctx.fill();

  // Beak upper
  ctx.fillStyle = "#f05a28";
  ctx.beginPath(); ctx.moveTo(11,-2); ctx.lineTo(19,-4); ctx.lineTo(19,-1); ctx.lineTo(11,1); ctx.closePath(); ctx.fill();
  // Beak lower
  ctx.fillStyle = "#d44010";
  ctx.beginPath(); ctx.moveTo(11,1); ctx.lineTo(19,-1); ctx.lineTo(19,2); ctx.lineTo(11,4); ctx.closePath(); ctx.fill();

  // Belly
  ctx.fillStyle = "#f5e0a0";
  ctx.beginPath(); ctx.ellipse(1,5,7,4.5,0,0,Math.PI*2); ctx.fill();

  ctx.restore();
}

function drawScore(ctx: CanvasRenderingContext2D, score: number) {
  ctx.textAlign = "center";
  ctx.font = "bold 36px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillText(String(score), W/2+2, 56);
  ctx.fillStyle = "#fff";
  ctx.fillText(String(score), W/2, 54);
}

function drawPanel(ctx: CanvasRenderingContext2D, score: number, best: number) {
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(0,0,W,H);

  const px=W/2-115, py=H/2-90, pw=230, ph=180;
  // Panel bg
  ctx.fillStyle = "#f5e6c8"; rrect(ctx,px,py,pw,ph,14); ctx.fill();
  ctx.strokeStyle = "#c8a85a"; ctx.lineWidth = 3; ctx.stroke();

  // Medal area placeholder
  ctx.fillStyle = "#e8d49a"; rrect(ctx,px+12,py+52,60,60,8); ctx.fill();
  ctx.strokeStyle = "#c8a85a"; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = "#cd7f32";
  ctx.beginPath(); ctx.arc(px+42,py+82,22,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#e8a040";
  ctx.beginPath(); ctx.arc(px+42,py+80,18,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#f5c060";
  ctx.font = "bold 18px 'Ubuntu Sans', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(score >= 10 ? "★" : "✦", px+42, py+86);

  // Game Over label
  ctx.fillStyle = "#b83225";
  ctx.font = "bold 22px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", W/2, py+32);

  // Score / Best
  ctx.fillStyle = "#4a3a2a";
  ctx.font = "13px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("SCORE", px+pw-14, py+74);
  ctx.fillText("BEST",  px+pw-14, py+100);
  ctx.font = "bold 18px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(String(score), px+pw-14, py+96);
  ctx.fillText(String(best),  px+pw-14, py+122);

  // Play again button
  ctx.fillStyle = "#5cb85c"; rrect(ctx,W/2-65,py+ph-46,130,40,10); ctx.fill();
  ctx.strokeStyle = "#3d8b3d"; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 15px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("▶  Play Again", W/2, py+ph-20);
}

function drawIdle(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0,0,W,H);

  ctx.textAlign = "center";
  ctx.font = "bold 32px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillText("FLAPPY BIRD", W/2+2, H/2-22);
  ctx.fillStyle = "#fff";
  ctx.fillText("FLAPPY BIRD", W/2, H/2-24);

  ctx.font = "15px 'Ubuntu Sans', system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("Click · Tap · Space  to flap", W/2, H/2+14);
}

// ── Component ───────────────────────────────────────────────────────────────
export default function FlappyWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gs = useRef<GameState>({
    phase:"idle", birdY:H/2, birdVY:0, birdAngle:0,
    pipes:[], score:0, best:0, scroll:0,
    lastPipe:0, raf:0, lastTs:0,
  });

  const flap = useCallback(() => {
    const s = gs.current;
    if (s.phase === "dead") {
      s.phase="playing"; s.birdY=H/2; s.birdVY=JUMP;
      s.birdAngle=0; s.pipes=[]; s.score=0; s.lastPipe=0;
    } else if (s.phase === "idle") {
      s.phase="playing"; s.birdVY=JUMP;
    } else {
      s.birdVY = JUMP;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const s = gs.current;

    const tick = (ts: number) => {
      const dt = Math.min(ts - (s.lastTs || ts), 50) / 16.67;
      s.lastTs = ts;

      if (s.phase === "playing") {
        s.scroll += PIPE_SPEED * dt;

        // Bird physics
        s.birdVY   += GRAVITY * dt;
        s.birdY    += s.birdVY * dt;
        s.birdAngle = Math.max(-0.45, Math.min(Math.PI/2, s.birdVY * 0.07));

        // Spawn pipes
        if (s.lastPipe === 0 || ts - s.lastPipe > PIPE_EVERY) {
          const gapY = 150 + Math.random() * (H - GROUND_H - 300);
          s.pipes.push({ x: W + 20, gapY, scored: false });
          s.lastPipe = ts;
        }

        // Move pipes + score
        for (const p of s.pipes) {
          p.x -= PIPE_SPEED * dt;
          if (!p.scored && p.x + PIPE_W < BIRD_X) { p.scored=true; s.score++; }
        }
        s.pipes = s.pipes.filter(p => p.x > -PIPE_W - 20);

        // Collisions
        const hit = () => { s.phase="dead"; s.best=Math.max(s.best,s.score); };
        if (s.birdY + BIRD_R > H - GROUND_H || s.birdY - BIRD_R < 0) { hit(); }
        for (const p of s.pipes) {
          if (BIRD_X+BIRD_R-3 > p.x && BIRD_X-BIRD_R+3 < p.x+PIPE_W) {
            if (s.birdY-BIRD_R < p.gapY-PIPE_GAP/2 || s.birdY+BIRD_R > p.gapY+PIPE_GAP/2) hit();
          }
        }
      } else if (s.phase === "idle") {
        // Idle bird bob
        s.birdY = H/2 + Math.sin(ts/600)*8;
        s.scroll += 0.8 * dt;
      } else {
        // Dead — bird falls to ground
        s.birdVY  += GRAVITY * dt * 1.5;
        s.birdY   = Math.min(s.birdY + s.birdVY * dt, H - GROUND_H - BIRD_R);
        s.birdAngle = Math.PI / 2;
      }

      // ── Draw ──
      drawBackground(ctx, s.scroll);
      for (const p of s.pipes) drawPipe(ctx, p.x, p.gapY);
      drawBird(ctx, s.birdY, s.birdAngle);

      if (s.phase === "playing")   drawScore(ctx, s.score);
      else if (s.phase === "dead") drawPanel(ctx, s.score, s.best);
      else                         drawIdle(ctx);

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);

    const onKey   = (e: KeyboardEvent) => { if (e.code==="Space"||e.code==="ArrowUp") { e.preventDefault(); flap(); } };
    const onTouch = (e: TouchEvent) => { e.preventDefault(); flap(); };

    canvas.addEventListener("click", flap);
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(s.raf);
      canvas.removeEventListener("click", flap);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKey);
    };
  }, [flap]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ display:"block", width:"100%", height:"100%", cursor:"pointer" }}
    />
  );
}
