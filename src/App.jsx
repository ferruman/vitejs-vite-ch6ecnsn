import { useState, useRef, useEffect, useCallback } from "react";

const ICONS = {
  upload: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  flipH: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><line x1="12" y1="20" x2="12" y2="4"/>
    </svg>
  ),
  flipV: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"/><line x1="4" y1="12" x2="20" y2="12"/>
    </svg>
  ),
  invert: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"/>
    </svg>
  ),
  camera: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  freeze: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  reset: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
    </svg>
  ),
};

// Grid overlay component
function GridOverlay({ mode }) {
  if (mode === "none") return null;

  const lines = [];

  if (mode === "thirds" || mode === "both") {
    // Rule of thirds
    lines.push(
      <line key="v1" x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="rgba(232,255,90,0.7)" strokeWidth="1"/>,
      <line key="v2" x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="rgba(232,255,90,0.7)" strokeWidth="1"/>,
      <line key="h1" x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="rgba(232,255,90,0.7)" strokeWidth="1"/>,
      <line key="h2" x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="rgba(232,255,90,0.7)" strokeWidth="1"/>,
    );
  }

  if (mode === "square" || mode === "both") {
    // 4x4 grid
    for (let i = 1; i < 4; i++) {
      lines.push(
        <line key={`sv${i}`} x1={`${i * 25}%`} y1="0" x2={`${i * 25}%`} y2="100%" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5"/>,
        <line key={`sh${i}`} x1="0" y1={`${i * 25}%`} x2="100%" y2={`${i * 25}%`} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5"/>,
      );
    }
  }

  // Center cross
  lines.push(
    <line key="cx" x1="50%" y1="45%" x2="50%" y2="55%" stroke="rgba(232,255,90,0.9)" strokeWidth="1"/>,
    <line key="cy" x1="45%" y1="50%" x2="55%" y2="50%" stroke="rgba(232,255,90,0.9)" strokeWidth="1"/>,
  );

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 5 }}
    >
      {lines}
    </svg>
  );
}

const GRID_MODES = ["none", "thirds", "square", "both"];
const GRID_LABELS = { none: "Grid", thirds: "Thirds", square: "Square", both: "Both" };

export default function ARDrawing() {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const wakeLockRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [image, setImage] = useState(null);
  const [opacity, setOpacity] = useState(50);
  const [scale, setScale] = useState(80);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [invert, setInvert] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [activeCamera, setActiveCamera] = useState("environment");
  const [cameraError, setCameraError] = useState(null);
  const [panelVisible, setPanelVisible] = useState(true);
  const [imgPos, setImgPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [locked, setLocked] = useState(false);
  const [gridMode, setGridMode] = useState("none");
  const [rotation, setRotation] = useState(0);
  const dragStart = useRef(null);

  // Pinch-to-zoom state
  const pinchRef = useRef(null); // { dist, scale }

  const startCamera = useCallback(async (facingMode = "environment") => {
    try {
      if (stream) stream.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        if (frozen) setFrozen(false);
      }
      setCameraError(null);
    } catch (e) {
      setCameraError(e.message || "Camera access denied");
    }
  }, [stream, frozen]);

  useEffect(() => {
    startCamera("environment");
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // Wake lock
  useEffect(() => {
    const acquire = async () => {
      if ("wakeLock" in navigator) {
        try { wakeLockRef.current = await navigator.wakeLock.request("screen"); } catch (_) {}
      }
    };
    acquire();
    return () => { if (wakeLockRef.current) wakeLockRef.current.release(); };
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFreeze = () => {
    if (!videoRef.current) return;
    if (!frozen) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setFrozen(f => !f);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setImgPos({ x: 0, y: 0 });
    setScale(80);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setImage(url);
    setImgPos({ x: 0, y: 0 });
    setScale(80);
  };

  // Mouse drag
  const onMouseDown = (e) => {
    if (e.target !== imgRef.current) return;
    if (locked) return;
    e.preventDefault();
    setDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, ix: imgPos.x, iy: imgPos.y };
  };

  const onMouseMove = (e) => {
    if (!dragging || !dragStart.current) return;
    setImgPos({
      x: dragStart.current.ix + e.clientX - dragStart.current.mx,
      y: dragStart.current.iy + e.clientY - dragStart.current.my,
    });
  };

  const onMouseUp = () => setDragging(false);

  const onTouchStart = (e) => {
    if (e.target !== imgRef.current) return;
    if (locked) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      setDragging(true);
      pinchRef.current = null;
      dragStart.current = { mx: t.clientX, my: t.clientY, ix: imgPos.x, iy: imgPos.y };
    } else if (e.touches.length === 2) {
      setDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      pinchRef.current = { dist, scale, angle, rotation };
    }
  };
  
  const onTouchMove = (e) => {
    if (e.target !== imgRef.current) return;
    e.preventDefault();
  
    if (e.touches.length === 1 && dragging && dragStart.current) {
      const t = e.touches[0];
      setImgPos({
        x: dragStart.current.ix + t.clientX - dragStart.current.mx,
        y: dragStart.current.iy + t.clientY - dragStart.current.my,
      });
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
      // scale
      const newScale = Math.round(Math.min(Math.max(pinchRef.current.scale * (dist / pinchRef.current.dist), 10), 300));
      setScale(newScale);
  
      // rotation
      const angleDelta = angle - pinchRef.current.angle;
      const newRotation = Math.round(((pinchRef.current.rotation + angleDelta) % 360 + 360) % 360);
      setRotation(newRotation > 180 ? newRotation - 360 : newRotation);
    }
  };
  
  const onTouchEnd = (e) => {
    if (e.touches.length === 0) {
      setDragging(false);
      pinchRef.current = null;
    } else if (e.touches.length === 1 && pinchRef.current) {
      const t = e.touches[0];
      setDragging(true);
      dragStart.current = { mx: t.clientX, my: t.clientY, ix: imgPos.x, iy: imgPos.y };
      pinchRef.current = null;
    }
  };

  const switchCamera = async () => {
    const next = activeCamera === "environment" ? "user" : "environment";
    setActiveCamera(next);
    await startCamera(next);
  };

  const cycleGrid = () => {
    setGridMode(m => {
      const idx = GRID_MODES.indexOf(m);
      return GRID_MODES[(idx + 1) % GRID_MODES.length];
    });
  };

  const imgTransform = [
    `translate(calc(-50% + ${imgPos.x}px), calc(-50% + ${imgPos.y}px))`,
    `rotate(${rotation}deg)`,
    `scale(${scale / 100})`,
    flipH ? "scaleX(-1)" : "",
    flipV ? "scaleY(-1)" : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed", inset: 0, background: "#0a0a0a",
        fontFamily: "'Inter', system-ui, sans-serif",
        userSelect: "none", overflow: "hidden",
      }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay playsInline muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* GRID */}
      <GridOverlay mode={gridMode} />

      {/* IMAGE OVERLAY */}
      {image && (
        <img
          ref={imgRef}
          src={image}
          alt="overlay"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            position: "absolute", top: "50%", left: "50%",
            maxWidth: "90vw", maxHeight: "90vh",
            transform: imgTransform,
            opacity: opacity / 100,
            filter: invert ? "invert(1)" : "none",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            pointerEvents: "auto",
            zIndex: 6,
          }}
        />
      )}

      {/* CAMERA ERROR */}
      {cameraError && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          color: "#fff", gap: 12, zIndex: 10,
        }}>
          <div style={{ fontSize: 40 }}>📷</div>
          <div style={{ fontSize: 16, color: "#aaa", textAlign: "center", maxWidth: 280 }}>
            Camera access blocked.<br />Please allow camera in browser settings.
          </div>
          <button onClick={() => startCamera(activeCamera)} style={{ background: "#e8ff5a", color: "#0a0a0a", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!image && !cameraError && (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: "absolute", inset: 0, display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 7,
          }}
        >
          <div style={{
            border: "2px dashed rgba(232,255,90,0.35)", borderRadius: 16,
            padding: "36px 48px", display: "flex", flexDirection: "column",
            alignItems: "center", gap: 12,
            background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)",
          }}>
            <div style={{ fontSize: 44, lineHeight: 1 }}>🖼️</div>
            <div style={{ color: "#e8ff5a", fontWeight: 600, fontSize: 15, letterSpacing: "0.02em" }}>
              Upload image to trace
            </div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>tap here or drag & drop</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{
        position: "absolute", top: 16, left: 16, right: 16,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        zIndex: 15, pointerEvents: "none",
      }}>
        <div style={{ display: "flex", gap: 8, pointerEvents: "auto" }}>
          {frozen && (
            <div style={{
              background: "rgba(232,100,50,0.85)", backdropFilter: "blur(6px)",
              borderRadius: 8, padding: "5px 12px",
              color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            }}>
              ⏸ FROZEN
            </div>
          )}
          {locked && (
            <div style={{
              background: "rgba(100,150,255,0.85)", backdropFilter: "blur(6px)",
              borderRadius: 8, padding: "5px 12px",
              color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            }}>
              🔒 LOCKED
            </div>
          )}
          {gridMode !== "none" && (
            <div style={{
              background: "rgba(232,255,90,0.15)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(232,255,90,0.3)",
              borderRadius: 8, padding: "5px 12px",
              color: "#e8ff5a", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            }}>
              ⊞ {GRID_LABELS[gridMode].toUpperCase()}
            </div>
          )}
        </div>
        <button
          onClick={() => setPanelVisible(v => !v)}
          style={{
            pointerEvents: "auto",
            background: "rgba(20,20,20,0.75)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
            padding: "6px 10px", color: "#e8ff5a", fontSize: 11,
            fontWeight: 600, letterSpacing: "0.05em", cursor: "pointer",
          }}
        >
          {panelVisible ? "HIDE" : "SHOW"} CONTROLS
        </button>
      </div>

      {/* CONTROL PANEL */}
      {panelVisible && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(12,12,12,0.88)", backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 20px 24px", zIndex: 20,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {/* Sliders */}
          <div style={{ display: "flex", gap: 20 }}>
            <SliderControl label="OPACITY" value={opacity} onChange={setOpacity} min={0} max={100} accent="#e8ff5a" />
            <SliderControl label="ROTATE" value={rotation} onChange={setRotation} min={-180} max={180} accent="#e8ff5a" />
            <SliderControl label="SIZE" value={scale} onChange={setScale} min={10} max={300} accent="#e8ff5a" />
          </div>

          {/* Buttons */}
          <div className="btn-row" style={{
            display: "flex", gap: 8, alignItems: "center",
            overflowX: "auto", overflowY: "hidden",
            paddingBottom: 4,
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE
            }}>
            <style>{`.btn-row::-webkit-scrollbar { display: none; }`}</style>
            <IconBtn icon={ICONS.upload} label="Image" onClick={() => fileInputRef.current?.click()} accent />
            {image && <IconBtn icon={ICONS.close} label="Clear" onClick={() => setImage(null)} />}
            <Divider />
            <IconBtn icon={ICONS.grid} label={GRID_LABELS[gridMode]} onClick={cycleGrid} active={gridMode !== "none"} />
            <Divider />
            <IconBtn icon={ICONS.reset} label="Reset" onClick={() => { setImgPos({ x: 0, y: 0 }); setScale(80); setRotation(0); }} />
            <IconBtn icon={ICONS.lock} label={locked ? "Unlock" : "Lock"} onClick={() => setLocked(l => !l)} active={locked} />
            <Divider />
            <IconBtn icon={ICONS.flipH} label="Flip H" onClick={() => setFlipH(f => !f)} active={flipH} />
            <IconBtn icon={ICONS.flipV} label="Flip V" onClick={() => setFlipV(f => !f)} active={flipV} />
            <IconBtn icon={ICONS.invert} label="Invert" onClick={() => setInvert(f => !f)} active={invert} />
            <Divider />
            <IconBtn icon={ICONS.freeze} label={frozen ? "Unfreeze" : "Freeze"} onClick={toggleFreeze} active={frozen} />
            <IconBtn icon={ICONS.camera} label="Cam" onClick={switchCamera} />
          
          </div>

          {image && (
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, letterSpacing: "0.03em" }}>
              1 finger drag · 2 finger pinch to zoom
            </div>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, background: "rgba(255,255,255,0.1)", height: 28, margin: "0 2px" }} />;
}

function SliderControl({ label, value, onChange, min, max, accent }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ color: accent, fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}{label === "ROTATE" ? "°" : "%"}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 3, accentColor: accent, cursor: "pointer",
          background: `linear-gradient(to right, ${accent} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.12) 0%)`,
          borderRadius: 2, outline: "none", border: "none",
        }}
      />
    </div>
  );
}

function IconBtn({ icon, label, onClick, active = false, accent = false }) {
  return (
    <button
      onClick={onClick} title={label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        background: accent ? "#e8ff5a" : active ? "rgba(232,255,90,0.15)" : "rgba(255,255,255,0.06)",
        border: active && !accent ? "1px solid rgba(232,255,90,0.4)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 8, padding: "7px 10px", cursor: "pointer",
        color: accent ? "#0a0a0a" : active ? "#e8ff5a" : "rgba(255,255,255,0.6)",
        fontSize: 9, fontWeight: 600, letterSpacing: "0.05em",
        minWidth: 44, transition: "all 0.1s",
      }}
    >
      {icon}
      <span style={{ marginTop: 1 }}>{label}</span>
    </button>
  );
}