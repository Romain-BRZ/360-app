/* global React, THREE */
const { useState, useRef, useEffect, useCallback } = React;

const Ink = "#1a1a1a";
const Paper = "#fbf8f3";

const sketchBox = (extra = {}) => ({
  border: `2px solid ${Ink}`,
  borderRadius: "14px 12px 16px 10px / 10px 14px 12px 16px",
  background: Paper,
  ...extra,
});

const PIN_COLORS = ["#ffd166", "#a8dadc", "#e63946", "#b5e48c", "#cdb4db"];

// Tiny weather / material glyphs (SVG)
const WeatherIcon = ({ kind }) => {
  const k = (kind || "").toLowerCase();
  if (k.includes("wood") || k.includes("bois")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="2" y="2" width="2.5" height="12" fill="#c89060" stroke="#1a1a1a" strokeWidth="0.8" />
        <rect x="5" y="2" width="2.5" height="12" fill="#a87040" stroke="#1a1a1a" strokeWidth="0.8" />
        <rect x="8" y="2" width="2.5" height="12" fill="#c89060" stroke="#1a1a1a" strokeWidth="0.8" />
        <rect x="11" y="2" width="2.5" height="12" fill="#a87040" stroke="#1a1a1a" strokeWidth="0.8" />
      </svg>
    );
  }
  if (k.includes("glass") || k.includes("verre")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="2" y="2" width="12" height="12" fill="#cfe9f6" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="2" y1="8" x2="14" y2="8" stroke="#1a1a1a" strokeWidth="0.8" />
        <line x1="8" y1="2" x2="8" y2="14" stroke="#1a1a1a" strokeWidth="0.8" />
        <path d="M3 4 L6 11" stroke="#fff" strokeWidth="1.5" />
        <path d="M9 4 L12 11" stroke="#fff" strokeWidth="1.5" />
      </svg>
    );
  }
  if (k.includes("brick") || k.includes("brique")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="2" y="2" width="12" height="12" fill="#c44a3c" stroke="#1a1a1a" strokeWidth="0.8" />
        <line x1="2" y1="6" x2="14" y2="6" stroke="#1a1a1a" strokeWidth="0.6" />
        <line x1="2" y1="10" x2="14" y2="10" stroke="#1a1a1a" strokeWidth="0.6" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="#1a1a1a" strokeWidth="0.6" />
        <line x1="5" y1="6" x2="5" y2="10" stroke="#1a1a1a" strokeWidth="0.6" />
        <line x1="11" y1="6" x2="11" y2="10" stroke="#1a1a1a" strokeWidth="0.6" />
        <line x1="8" y1="10" x2="8" y2="14" stroke="#1a1a1a" strokeWidth="0.6" />
      </svg>
    );
  }
  if (k.includes("rain") || k.includes("pluie") || k.includes("pluvieux")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <path d="M3 8 a3 3 0 0 1 3-3 a4 4 0 0 1 7 1 a2.5 2.5 0 0 1 -1 5 H5 a2 2 0 0 1 -2 -3 Z" fill="#a8dadc" stroke="#1a1a1a" strokeWidth="1" />
        <line x1="6" y1="12" x2="5" y2="15" stroke="#3a7ca5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="9" y1="12" x2="8" y2="15" stroke="#3a7ca5" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="12" y1="12" x2="11" y2="15" stroke="#3a7ca5" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (k.includes("snow") || k.includes("neige") || k.includes("neigeux")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <g stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round">
          <line x1="8" y1="2" x2="8" y2="14" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="3.5" y1="3.5" x2="12.5" y2="12.5" />
          <line x1="12.5" y1="3.5" x2="3.5" y2="12.5" />
        </g>
      </svg>
    );
  }
  if (k.includes("mist") || k.includes("fog") || k.includes("overcast") || k.includes("couvert") || k.includes("brume")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <line x1="2" y1="5" x2="14" y2="5" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="3" y1="8" x2="13" y2="8" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="2" y1="11" x2="14" y2="11" stroke="#1a1a1a" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (k.includes("sun") || k.includes("ensoleill") || k.includes("soleil")) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="3" fill="#ffd166" stroke="#1a1a1a" strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line
            key={a}
            x1={8 + 5 * Math.cos((a * Math.PI) / 180)}
            y1={8 + 5 * Math.sin((a * Math.PI) / 180)}
            x2={8 + 7 * Math.cos((a * Math.PI) / 180)}
            y2={8 + 7 * Math.sin((a * Math.PI) / 180)}
            stroke="#1a1a1a"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }
  // morning / matin / golden hour / sunset
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M2 12 L14 12" stroke="#1a1a1a" strokeWidth="1.2" />
      <path d="M4 12 a4 4 0 0 1 8 0 Z" fill="#f5b6a5" stroke="#1a1a1a" strokeWidth="1" />
      <line x1="2" y1="14" x2="14" y2="14" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
};

// ============================================================
// Three.js panorama scene
// ============================================================
function usePanoScene(canvasRef, panoUrl) {
  const stateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    material: null,
    yaw: 0, // start looking at +Z back of sphere
    pitch: 0,
    fov: 75,
    isReady: false,
    onFrameCallbacks: new Set(),
  });
  const [loading, setLoading] = useState(true);

  // Build scene once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1100);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const geometry = new THREE.SphereGeometry(500, 80, 60);
    geometry.scale(-1, 1, 1);

    const material = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.renderer = renderer;
    stateRef.current.material = material;

    let raf;
    const update = () => {
      const s = stateRef.current;
      s.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, s.pitch));
      const cosPitch = Math.cos(s.pitch);
      const x = cosPitch * Math.sin(s.yaw);
      const y = Math.sin(s.pitch);
      const z = cosPitch * Math.cos(s.yaw);
      camera.lookAt(x, y, z);
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
      s.onFrameCallbacks.forEach((cb) => cb(s));
      raf = requestAnimationFrame(update);
    };
    update();

    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (material.map) material.map.dispose();
    };
  }, []);

  // Load texture whenever panoUrl changes
  useEffect(() => {
    const mat = stateRef.current.material;
    if (!mat) {
      // material not built yet — try again next tick
      const id = requestAnimationFrame(() => {
        if (stateRef.current.material) loadTex();
      });
      return () => cancelAnimationFrame(id);
    }
    loadTex();

    function loadTex() {
      setLoading(true);
      const mat = stateRef.current.material;
      const prevMap = mat.map;
      new THREE.TextureLoader().load(
        panoUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          mat.map = texture;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
          if (prevMap) prevMap.dispose();
          stateRef.current.isReady = true;
          setLoading(false);
        },
        undefined,
        () => setLoading(false),
      );
    }
  }, [panoUrl]);

  return { stateRef, loading };
}

// project 3D direction to screen coords
function projectToScreen(camera, canvas, yaw, pitch) {
  const v = new THREE.Vector3(
    Math.cos(pitch) * Math.sin(yaw),
    Math.sin(pitch),
    Math.cos(pitch) * Math.cos(yaw)
  );
  v.project(camera);
  const x = (v.x * 0.5 + 0.5) * canvas.clientWidth;
  const y = (-v.y * 0.5 + 0.5) * canvas.clientHeight;
  const behind = v.z > 1; // behind camera
  return { x, y, behind };
}

// screen coords → direction (yaw/pitch) via raycasting
function unprojectToDirection(camera, canvas, sx, sy) {
  const rect = canvas.getBoundingClientRect();
  const ndc = new THREE.Vector2(
    ((sx - rect.left) / rect.width) * 2 - 1,
    -((sy - rect.top) / rect.height) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(ndc, camera);
  const dir = raycaster.ray.direction.clone().normalize();
  const yaw = Math.atan2(dir.x, dir.z);
  const pitch = Math.asin(dir.y);
  return { yaw, pitch };
}

// ============================================================
// Note Pin component
// ============================================================
const NotePin = ({ note, x, y, behind, active, onClick }) => {
  if (behind) return null;
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        width: active ? 38 : 32,
        height: active ? 38 : 32,
        borderRadius: "50%",
        background: note.color,
        border: `2.5px solid ${Ink}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--hand)",
        fontWeight: 700,
        fontSize: active ? 16 : 14,
        boxShadow: active ? `0 0 0 4px #ffffff88, 3px 3px 0 ${Ink}` : `2px 2px 0 ${Ink}`,
        cursor: "pointer",
        zIndex: 1,
        transition: "width .15s, height .15s",
        padding: 0,
      }}
    >
      {note.num}
    </button>
  );
};

// ============================================================
// New-note editor (floats next to clicked spot)
// ============================================================
const NoteEditor = ({ x, y, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        left: Math.min(x + 16, window.innerWidth - 280),
        top: Math.max(20, y - 30),
        width: 240,
        ...sketchBox({ padding: 12, background: "#fff", boxShadow: `4px 4px 0 ${Ink}` }),
        zIndex: 10,
      }}
    >
      <div style={{ fontFamily: "var(--mono)", fontSize: 10, opacity: .6, marginBottom: 6 }}>NOUVELLE NOTE</div>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="titre"
        style={{
          width: "100%",
          padding: "6px 8px",
          border: `1.5px solid ${Ink}`,
          borderRadius: 6,
          fontFamily: "var(--hand)",
          fontSize: 16,
          background: "#fff",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="description…"
        rows={2}
        style={{
          width: "100%",
          padding: "6px 8px",
          border: `1.5px dashed ${Ink}`,
          borderRadius: 6,
          fontFamily: "var(--hand)",
          fontSize: 14,
          background: "#fff",
          outline: "none",
          marginTop: 6,
          resize: "none",
          boxSizing: "border-box",
        }}
      />
      <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            ...sketchBox({ padding: "4px 10px", background: "#fff", boxShadow: `2px 2px 0 ${Ink}` }),
            fontFamily: "var(--hand)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          annuler
        </button>
        <button
          onClick={() => onSave({ title: title.trim() || "Sans titre", body: body.trim() })}
          style={{
            ...sketchBox({ padding: "4px 10px", background: "#ffd166", boxShadow: `2px 2px 0 ${Ink}` }),
            fontFamily: "var(--hand)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          enregistrer
        </button>
      </div>
    </div>
  );
};

// ---------- State encoding (URL hash) ----------
const DEFAULT_NOTES_BY_SITE = {
  A: [],
  B: [],
  C: [],
};

function encodeState({ notesBySite, currentSiteId, view }) {
  const n = {};
  for (const id of Object.keys(notesBySite || {})) {
    n[id] = (notesBySite[id] || []).map((nt) => [nt.num, nt.color, nt.title, nt.body || "", +nt.yaw.toFixed(4), +nt.pitch.toFixed(4)]);
  }
  const slim = { n };
  if (currentSiteId) slim.s = currentSiteId;
  if (view) slim.v = [+view.yaw.toFixed(3), +view.pitch.toFixed(3), Math.round(view.fov)];
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(slim))))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

function decodeState(hash) {
  if (!hash) return null;
  try {
    const b64 = hash.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(b64 + "===".slice((b64.length + 3) % 4))));
    const slim = JSON.parse(json);
    const notesBySite = {};
    // legacy format (flat note list)
    if (Array.isArray(slim.n)) {
      notesBySite.A = slim.n.map((a, i) => ({
        id: Date.now() + i, num: a[0], color: a[1], title: a[2], body: a[3], yaw: a[4], pitch: a[5],
      }));
    } else if (slim.n && typeof slim.n === "object") {
      for (const id of Object.keys(slim.n)) {
        notesBySite[id] = slim.n[id].map((a, i) => ({
          id: Date.now() + i + Math.random(),
          num: a[0], color: a[1], title: a[2], body: a[3], yaw: a[4], pitch: a[5],
        }));
      }
    }
    const view = slim.v ? { yaw: slim.v[0], pitch: slim.v[1], fov: slim.v[2] } : null;
    return { notesBySite, currentSiteId: slim.s || null, view };
  } catch {
    return null;
  }
}

// ============================================================
// Share dialog
// ============================================================
const ShareDialog = ({ url, includeView, onToggleView, onClose }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0,
        background: "#1a1a1a55",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          ...sketchBox({ padding: 22, background: "#fff", boxShadow: `5px 5px 0 ${Ink}` }),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 12 }}>
          <div style={{ fontFamily: "var(--hand)", fontSize: 28, lineHeight: 1, whiteSpace: "nowrap" }}>Partager cette visite</div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", fontFamily: "var(--hand)", fontSize: 22, cursor: "pointer", lineHeight: 1, padding: 0 }}
          >×</button>
        </div>
        <div style={{ fontFamily: "var(--hand)", fontSize: 15, opacity: .7, marginBottom: 14, lineHeight: 1.3 }}>
          envoyez ce lien à n’importe qui — il verra la visite et vos notes (tous les sites).<br />
          s’il ajoute des notes, il peut renvoyer le lien pour les transmettre.
        </div>

        <div
          style={{
            ...sketchBox({ padding: "10px 12px", background: Paper, boxShadow: `2px 2px 0 ${Ink}` }),
            display: "flex", gap: 8, alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {url}
          </span>
          <button
            onClick={copy}
            style={{
              ...sketchBox({ padding: "6px 14px", background: copied ? "#b5e48c" : "#ffd166", boxShadow: `2px 2px 0 ${Ink}` }),
              fontFamily: "var(--hand)", fontSize: 15, cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {copied ? "✓ copié" : "copier le lien"}
          </button>
        </div>

        <label style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "center", cursor: "pointer" }}>
          <div
            style={{
              width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${Ink}`,
              background: includeView ? "#ffd166" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--hand)", fontSize: 15, fontWeight: 700,
              boxShadow: `2px 2px 0 ${Ink}`,
              flexShrink: 0,
            }}
          >
            {includeView ? "✓" : ""}
          </div>
          <input type="checkbox" checked={includeView} onChange={onToggleView} style={{ display: "none" }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "var(--hand)", fontSize: 16, whiteSpace: "nowrap" }}>ouvrir sur ma vue actuelle</div>
            <div style={{ fontFamily: "var(--hand)", fontSize: 13, opacity: .6 }}>
              le lien démarrera sur l’angle et le zoom actuels
            </div>
          </div>
        </label>

        <div style={{ marginTop: 16, fontFamily: "var(--hand)", fontSize: 13, opacity: .55, lineHeight: 1.4 }}>
          astuce : les notes sont intégrées à l’URL — pas de compte, pas de serveur.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main viewer
// ============================================================
const PanoViewer = ({
  sites = [
    {
      id: "A",
      label: "Site A — Pavillon",
      planX: 52, planY: 78,
      panos: [
        { url: "assets/Site-A-wood.jpg", label: "bois" },
        { url: "assets/Site-A-glass.jpg", label: "verre" },
        { url: "assets/Site-A-bricks.jpg", label: "briques" },
      ],
    },
    {
      id: "B",
      label: "Site B — Entrée",
      planX: 24, planY: 72,
      panos: [
        { url: "assets/Site-B-morning.jpg", label: "matin" },
        { url: "assets/Site-B-sunny.jpg", label: "ensoleillé" },
        { url: "assets/Site-B-snowy.jpg", label: "neige" },
      ],
    },
    {
      id: "C",
      label: "Site C — Zone Dépose",
      planX: 35, planY: 24,
      panos: [
        { url: "assets/Site-C-morning.jpg", label: "matin" },
        { url: "assets/Site-C-overcast.jpg", label: "couvert" },
        { url: "assets/Site-C-rainy.jpg", label: "pluie" },
      ],
    },
  ],
  title = "Déchetterie - 360°",
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // hydrate state from URL hash → localStorage → defaults
  const initial = decodeState(window.location.hash.replace(/^#/, ""));
  const fromStorage = (() => {
    try {
      const raw = localStorage.getItem("pano-notes-by-site");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();
  const seedNotes = initial?.notesBySite ?? fromStorage ?? DEFAULT_NOTES_BY_SITE;
  const seedNotesNormalized = { A: [], B: [], C: [], ...seedNotes };

  const [currentSiteId, setCurrentSiteId] = useState(initial?.currentSiteId || sites[0].id);
  const [panoIndexBySite, setPanoIndexBySite] = useState(() =>
    Object.fromEntries(sites.map((s) => [s.id, 0]))
  );
  const [notesBySite, setNotesBySite] = useState(seedNotesNormalized);

  const currentSite = sites.find((s) => s.id === currentSiteId) || sites[0];
  const panoIndex = panoIndexBySite[currentSite.id] ?? 0;
  const currentPano = currentSite.panos[panoIndex];
  const notes = notesBySite[currentSite.id] || [];
  const setNotes = (updater) => {
    setNotesBySite((ns) => {
      const prev = ns[currentSite.id] || [];
      const next = typeof updater === "function" ? updater(prev) : updater;
      return { ...ns, [currentSite.id]: next };
    });
  };

  const { stateRef, loading } = usePanoScene(canvasRef, currentPano.url);
  const [weatherOpen, setWeatherOpen] = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);

  // Persist notes-by-site locally so reload keeps them
  useEffect(() => {
    try { localStorage.setItem("pano-notes-by-site", JSON.stringify(notesBySite)); } catch {}
  }, [notesBySite]);
  const [activeId, setActiveId] = useState(null);
  const [editor, setEditor] = useState(null); // { yaw, pitch, sx, sy }
  const [panelOpen, setPanelOpen] = useState(true);
  const [addMode, setAddMode] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareIncludeView, setShareIncludeView] = useState(false);

  // Apply initial view from URL hash when scene is ready
  useEffect(() => {
    if (initial?.view) {
      const apply = () => {
        const s = stateRef.current;
        if (s.camera) {
          s.yaw = initial.view.yaw;
          s.pitch = initial.view.pitch;
          s.fov = initial.view.fov;
        } else {
          requestAnimationFrame(apply);
        }
      };
      apply();
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build share URL when dialog is open or notes/view change
  const buildShareUrl = () => {
    const s = stateRef.current;
    const view = shareIncludeView && s.camera ? { yaw: s.yaw, pitch: s.pitch, fov: s.fov } : null;
    const hash = encodeState({ notesBySite, currentSiteId, view });
    return `${window.location.origin}${window.location.pathname}#${hash}`;
  };

  // Projection tick — force re-render of pin positions each frame
  const [, forceTick] = useState(0);
  useEffect(() => {
    const s = stateRef.current;
    const cb = () => forceTick((n) => (n + 1) % 1000000);
    s.onFrameCallbacks.add(cb);
    return () => s.onFrameCallbacks.delete(cb);
  }, []);

  // ---------- Drag-pan + wheel-zoom ----------
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    let dragging = false;
    let lx = 0, ly = 0;
    let downX = 0, downY = 0;
    let moved = false;

    const onDown = (e) => {
      dragging = true;
      moved = false;
      lx = e.clientX;
      ly = e.clientY;
      downX = e.clientX;
      downY = e.clientY;
      el.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 4) moved = true;
      lx = e.clientX;
      ly = e.clientY;
      const s = stateRef.current;
      const sens = (s.fov * Math.PI) / 180 / el.clientHeight;
      s.yaw += dx * sens;
      s.pitch += dy * sens;
    };
    const onUp = (e) => {
      const wasDragging = dragging;
      dragging = false;
      el.style.cursor = addMode ? "crosshair" : "grab";
      if (!wasDragging || moved) return;
      if (addMode) {
        const s = stateRef.current;
        const dir = unprojectToDirection(s.camera, el, e.clientX, e.clientY);
        const rect = el.getBoundingClientRect();
        setEditor({ yaw: dir.yaw, pitch: dir.pitch, sx: e.clientX - rect.left, sy: e.clientY - rect.top });
      } else {
        setActiveId(null);
      }
    };
    const onWheel = (e) => {
      e.preventDefault();
      const s = stateRef.current;
      s.fov = Math.max(30, Math.min(115, s.fov + e.deltaY * 0.05));
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.style.cursor = addMode ? "crosshair" : "grab";

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [addMode]);

  // ---------- Note ops ----------
  const saveNewNote = (data) => {
    if (!editor) return;
    const nextNum = (notes.length ? Math.max(...notes.map((n) => n.num)) : 0) + 1;
    setNotes([
      ...notes,
      {
        id: Date.now(),
        num: nextNum,
        color: PIN_COLORS[notes.length % PIN_COLORS.length],
        title: data.title,
        body: data.body,
        yaw: editor.yaw,
        pitch: editor.pitch,
      },
    ]);
    setEditor(null);
    setAddMode(false);
  };
  const deleteNote = (id) => {
    setNotes((ns) => ns.filter((n) => n.id !== id).map((n, i) => ({ ...n, num: i + 1 })));
    if (activeId === id) setActiveId(null);
  };
  const flyTo = (note) => {
    const s = stateRef.current;
    // smooth-ish: just set yaw/pitch, lerp via simple animation
    const startYaw = s.yaw;
    const startPitch = s.pitch;
    // Choose shortest yaw path
    let targetYaw = note.yaw;
    let d = targetYaw - startYaw;
    while (d > Math.PI) { targetYaw -= 2 * Math.PI; d = targetYaw - startYaw; }
    while (d < -Math.PI) { targetYaw += 2 * Math.PI; d = targetYaw - startYaw; }
    const startT = performance.now();
    const dur = 600;
    const step = (t) => {
      const k = Math.min(1, (t - startT) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      s.yaw = startYaw + (targetYaw - startYaw) * e;
      s.pitch = startPitch + (note.pitch - startPitch) * e;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    setActiveId(note.id);
  };

  // Compute current screen positions of pins
  const s = stateRef.current;
  const canvas = canvasRef.current;
  const pinPositions = (canvas && s.camera)
    ? notes.map((n) => ({ n, ...projectToScreen(s.camera, canvas, n.yaw, n.pitch) }))
    : [];

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%", background: Paper, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          cursor: addMode ? "crosshair" : "grab",
          touchAction: "none",
        }}
      />

      {/* Title chip */}
      <div style={{ position: "absolute", left: 20, top: 20, display: "flex", gap: 10, alignItems: "center", pointerEvents: "none", zIndex: 4 }}>
        <div style={{ fontFamily: "var(--hand)", fontSize: 18, background: "#fff", padding: "4px 14px", border: `2px solid ${Ink}`, borderRadius: 20, boxShadow: `2px 2px 0 ${Ink}`, whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div style={{ fontFamily: "var(--hand)", fontSize: 15, background: "#ffd166", padding: "4px 12px", border: `2px solid ${Ink}`, borderRadius: 20, boxShadow: `2px 2px 0 ${Ink}`, whiteSpace: "nowrap" }}>
          {currentSite.label}
        </div>
      </div>

      {/* Share button */}
      <button
        onClick={() => setShareOpen(true)}
        style={{
          position: "absolute",
          right: panelOpen ? 320 : 80,
          top: 20,
          ...sketchBox({ padding: "0 14px", height: 36, background: "#fff", boxShadow: `2px 2px 0 ${Ink}` }),
          fontFamily: "var(--hand)",
          fontSize: 15,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
          zIndex: 4,
          transition: "right .3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
          <path d="M7 11 L7 3 M3 7 L7 3 L11 7" stroke={Ink} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        partager
      </button>

      {/* Weather picker (below title) */}
      {currentSite.panos.length > 1 && (
        <div style={{ position: "absolute", left: 20, top: 70, zIndex: 5 }}>
          <button
            onClick={() => setWeatherOpen((o) => !o)}
            style={{
              ...sketchBox({ padding: "0 12px", height: 36, background: "#fff", boxShadow: `2px 2px 0 ${Ink}` }),
              fontFamily: "var(--hand)",
              fontSize: 15,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            <WeatherIcon kind={currentPano.label} />
            <span>{currentPano.label}</span>
            <span style={{ fontSize: 11, opacity: .55, marginLeft: 2 }}>▾</span>
          </button>

          {weatherOpen && (
            <>
              {/* click-outside catcher */}
              <div
                onClick={() => setWeatherOpen(false)}
                style={{ position: "fixed", inset: 0, zIndex: 1 }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  left: 0,
                  minWidth: 160,
                  ...sketchBox({ padding: 6, background: "#fff", boxShadow: `3px 3px 0 ${Ink}` }),
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  zIndex: 2,
                }}
              >
                {currentSite.panos.map((p, i) => (
                  <button
                    key={p.url}
                    onClick={() => {
                      setPanoIndexBySite((ix) => ({ ...ix, [currentSite.id]: i }));
                      setWeatherOpen(false);
                    }}
                    style={{
                      ...sketchBox({
                        padding: "6px 10px",
                        background: i === panoIndex ? "#ffd166" : Paper,
                        boxShadow: `1.5px 1.5px 0 ${Ink}`,
                      }),
                      fontFamily: "var(--hand)",
                      fontSize: 15,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <WeatherIcon kind={p.label} />
                    <span style={{ flex: 1 }}>{p.label}</span>
                    {i === panoIndex && <span style={{ fontSize: 13 }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Loading shade */}
      {loading && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 120,
            ...sketchBox({ padding: "6px 14px", background: "#fff", boxShadow: `2px 2px 0 ${Ink}` }),
            fontFamily: "var(--hand)",
            fontSize: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 12, height: 12, borderRadius: "50%",
              border: `2px solid ${Ink}`,
              borderRightColor: "transparent",
              animation: "pano-spin 1s linear infinite",
              display: "inline-block",
            }}
          />
          chargement {currentPano.label}…
        </div>
      )}

      {/* Site plan (bottom-left) */}
      {!planExpanded ? (
        <button
          onClick={() => setPlanExpanded(true)}
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            ...sketchBox({ padding: "0 14px", height: 36, background: "#fff", boxShadow: `2px 2px 0 ${Ink}` }),
            fontFamily: "var(--hand)",
            fontSize: 15,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            whiteSpace: "nowrap",
            zIndex: 4,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <rect x="1.5" y="1.5" width="11" height="11" stroke={Ink} strokeWidth="1.3" fill="none" />
            <line x1="1.5" y1="5" x2="12.5" y2="5" stroke={Ink} strokeWidth="1.1" />
            <line x1="5" y1="5" x2="5" y2="12.5" stroke={Ink} strokeWidth="1.1" />
          </svg>
          Plan du site
          <span style={{ fontSize: 13, opacity: .55 }}>↗</span>
        </button>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 420,
            ...sketchBox({ padding: 8, background: "#fff", boxShadow: `3px 3px 0 ${Ink}` }),
            display: "flex",
            flexDirection: "column",
            gap: 6,
            zIndex: 4,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0 4px" }}>
            <div style={{ fontFamily: "var(--hand)", fontSize: 15, lineHeight: 1 }}>Plan du site</div>
            <button
              onClick={() => setPlanExpanded(false)}
              title="masquer"
              style={{
                background: "transparent",
                border: "none",
                fontFamily: "var(--hand)",
                fontSize: 16,
                cursor: "pointer",
                padding: 0,
                lineHeight: 1,
                color: Ink,
              }}
            >
              ↙
            </button>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              border: `1.5px solid ${Ink}`,
              background: `#fff url(assets/site-plan.jpg) center / cover no-repeat`,
            }}
          >
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSiteId(s.id);
                  setActiveId(null);
                  setEditor(null);
                  setAddMode(false);
                }}
                title={s.label}
                style={{
                  position: "absolute",
                  left: `${s.planX}%`,
                  top: `${s.planY}%`,
                  transform: "translate(-50%, -50%)",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: `2.5px solid ${Ink}`,
                  background: s.id === currentSite.id ? "#ffd166" : "#fff",
                  boxShadow: s.id === currentSite.id
                    ? `0 0 0 4px #ffffff99, 3px 3px 0 ${Ink}`
                    : `2px 2px 0 ${Ink}`,
                  cursor: "pointer",
                  fontFamily: "var(--hand)",
                  fontWeight: 700,
                  fontSize: 18,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Ink,
                  lineHeight: 1,
                }}
              >
                {s.id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pins */}
      {pinPositions.map(({ n, x, y, behind }) => (
        <NotePin
          key={n.id}
          note={n}
          x={x}
          y={y}
          behind={behind}
          active={activeId === n.id}
          onClick={(e) => { e.stopPropagation(); setActiveId(n.id); }}
        />
      ))}

      {/* Active pin popover */}
      {activeId && (() => {
        const pp = pinPositions.find((p) => p.n.id === activeId);
        if (!pp || pp.behind) return null;
        const n = pp.n;
        return (
          <div
            style={{
              position: "absolute",
              left: Math.min(pp.x + 24, (canvas?.clientWidth ?? 1000) - 240),
              top: Math.max(20, pp.y - 30),
              width: 220,
              ...sketchBox({ padding: 10, background: "#fff", boxShadow: `3px 3px 0 ${Ink}` }),
              zIndex: 2,
            }}
          >
            <div style={{ fontFamily: "var(--hand)", fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>{n.title}</div>
            {n.body && <div style={{ fontFamily: "var(--hand)", fontSize: 14, opacity: .75, marginTop: 4, lineHeight: 1.3 }}>{n.body}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}>
              <button
                onClick={() => deleteNote(n.id)}
                style={{ ...sketchBox({ padding: "2px 8px", background: "#fff", boxShadow: `1.5px 1.5px 0 ${Ink}` }), fontFamily: "var(--hand)", fontSize: 13, cursor: "pointer" }}
              >
                delete
              </button>
              <button
                onClick={() => setActiveId(null)}
                style={{ ...sketchBox({ padding: "2px 8px", background: "#a8dadc", boxShadow: `1.5px 1.5px 0 ${Ink}` }), fontFamily: "var(--hand)", fontSize: 13, cursor: "pointer" }}
              >
                fermer
              </button>
            </div>
          </div>
        );
      })()}

      {/* New-note editor */}
      {editor && (
        <NoteEditor
          x={editor.sx}
          y={editor.sy}
          onSave={saveNewNote}
          onCancel={() => { setEditor(null); setAddMode(false); }}
        />
      )}

      {/* Add note button */}
      <button
        onClick={() => { setAddMode((m) => !m); setEditor(null); }}
        style={{
          position: "absolute",
          right: panelOpen ? 320 : 80,
          bottom: 20,
          ...sketchBox({
            background: addMode ? "#e63946" : "#ffd166",
            padding: "0 18px",
            height: 44,
            boxShadow: `3px 3px 0 ${Ink}`,
            color: addMode ? "#fff" : Ink,
          }),
          fontFamily: "var(--hand)",
          fontSize: 18,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          zIndex: 4,
          transition: "right .3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {addMode ? "× annuler" : "＋ ajouter une note"}
      </button>

      {/* Share dialog */}
      {shareOpen && (
        <ShareDialog
          url={buildShareUrl()}
          includeView={shareIncludeView}
          onToggleView={() => setShareIncludeView((v) => !v)}
          onClose={() => setShareOpen(false)}
        />
      )}

      {/* Side panel — overlays the viewer, slides in/out */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 300,
          borderLeft: `2px solid ${Ink}`,
          background: "#fff",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflow: "hidden",
          transform: panelOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.4,0,.2,1)",
          boxShadow: panelOpen ? `-4px 0 16px #1a1a1a22` : "none",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "var(--hand)", fontSize: 24 }}>Notes</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: .6 }}>{notes.length} épingle{notes.length === 1 ? "" : "s"}</div>
        </div>
        <svg width="70" height="6" viewBox="0 0 70 6">
          <path d="M2 3 Q 14 0 28 3 T 54 3 T 68 3" stroke={Ink} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {notes.length === 0 && (
            <div style={{ ...sketchBox({ padding: 14, background: Paper, boxShadow: `2px 2px 0 ${Ink}` }), fontFamily: "var(--hand)", fontSize: 14, textAlign: "center", opacity: .8 }}>
              aucune note pour l’instant.<br />cliquez sur <b>＋ ajouter une note</b>, puis sur la scène.
            </div>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => flyTo(note)}
              style={{
                ...sketchBox({
                  padding: 10,
                  background: activeId === note.id ? "#fff8e1" : "#fff",
                  boxShadow: `2px 2px 0 ${Ink}`,
                  borderColor: activeId === note.id ? Ink : "#1a1a1a99",
                }),
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                position: "relative",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: note.color,
                  border: `2px solid ${Ink}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--hand)",
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {note.num}
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 22 }}>
                <div style={{ fontFamily: "var(--hand)", fontSize: 16, fontWeight: 700, lineHeight: 1.1 }}>{note.title}</div>
                {note.body && <div style={{ fontFamily: "var(--hand)", fontSize: 13, opacity: .75, lineHeight: 1.3 }}>{note.body}</div>}
              </div>
              <button
                title="supprimer la note"
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                style={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  border: `1.5px solid ${Ink}`,
                  background: "#fff",
                  boxShadow: `1.5px 1.5px 0 ${Ink}`,
                  cursor: "pointer",
                  fontFamily: "var(--hand)",
                  fontSize: 14,
                  lineHeight: 1,
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Ink,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "auto", fontFamily: "var(--hand)", fontSize: 12, opacity: .6, textAlign: "center" }}>
          cliquez sur une note → la caméra vole vers l’épingle
        </div>
      </div>

      {/* Panel toggle — slides with the panel */}
      <button
        onClick={() => setPanelOpen((o) => !o)}
        title={panelOpen ? "masquer les notes" : "afficher les notes"}
        style={{
          position: "absolute",
          right: panelOpen ? 300 : 0,
          top: "50%",
          transform: "translate(50%, -50%)",
          width: 32,
          height: 56,
          border: `2px solid ${Ink}`,
          background: "#fff",
          boxShadow: `2px 2px 0 ${Ink}`,
          borderRadius: "10px 14px 10px 14px / 14px 10px 14px 10px",
          cursor: "pointer",
          fontFamily: "var(--hand)",
          fontSize: 22,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 11,
          lineHeight: 1,
          transition: "right .3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {panelOpen ? "›" : "‹"}
      </button>
    </div>
  );
};

window.PanoViewer = PanoViewer;
