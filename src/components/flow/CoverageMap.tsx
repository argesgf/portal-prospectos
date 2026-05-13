"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { usePlan } from "@/lib/context/plan-context";
import type { CoverageResult } from "@/lib/mock/data";
import {
  verificarCobertura,
  buscarDireccionMasCercana,
  obtenerCoordsPorDireccion,
  getSuggestions,
  TURMERO_CENTER,
} from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Search,
  Navigation,
  Zap,
  ShieldCheck,
  Loader2,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Move,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#1d4ed8;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(29,78,216,.4);"><div style="width:12px;height:12px;background:#facc15;border-radius:50%;transform:rotate(45deg);"></div></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markerIconError = L.divIcon({
  className: "custom-marker-error",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#ef4444;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(239,68,68,.4);"><div style="width:12px;height:12px;background:#fff;border-radius:50%;transform:rotate(45deg);"></div></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markerIconSuccess = L.divIcon({
  className: "custom-marker-success",
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;background:#22c55e;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(34,197,94,.4);"><div style="width:12px;height:12px;background:#facc15;border-radius:50%;transform:rotate(45deg);"></div></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface MapControllerProps {
  center: { lat: number; lng: number };
  onMarkerDrag: (lat: number, lng: number) => void;
  result: CoverageResult | null;
}

function MapController({ center, onMarkerDrag, result }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
      duration: 0.5,
    });
  }, [center.lat, center.lng, map]);

  useMapEvents({
    click(e) {
      if (!result) {
        onMarkerDrag(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

function DraggableMarker({
  center,
  onDragEnd,
  result,
}: {
  center: { lat: number; lng: number };
  onDragEnd: (lat: number, lng: number) => void;
  result: CoverageResult | null;
}) {
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useCallback(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          const pos = marker.getLatLng();
          onDragEnd(pos.lat, pos.lng);
        }
      },
    }),
    [onDragEnd]
  );

  const handlers = eventHandlers();

  const icon = !result
    ? markerIcon
    : result.available
      ? markerIconSuccess
      : markerIconError;

  return (
    <Marker
      draggable={!result}
      ref={markerRef}
      position={[center.lat, center.lng]}
      icon={icon}
      eventHandlers={handlers}
    />
  );
}

function CoverageCircle({ result }: { result: CoverageResult | null }) {
  const map = useMap();
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!result) return;
    if (circleRef.current) {
      circleRef.current.remove();
    }

    circleRef.current = L.circle([result.lat, result.lng], {
      radius: 800,
      color: result.available ? "#22c55e" : "#ef4444",
      fillColor: result.available ? "#22c55e" : "#ef4444",
      fillOpacity: 0.12,
      weight: 2,
      dashArray: "6 3",
    }).addTo(map);

    const outer = L.circle([result.lat, result.lng], {
      radius: 1500,
      color: result.available ? "#22c55e" : "#ef4444",
      fillColor: result.available ? "#22c55e" : "#ef4444",
      fillOpacity: 0.05,
      weight: 1,
      dashArray: "3 3",
    }).addTo(map);

    return () => {
      circleRef.current?.remove();
      outer.remove();
    };
  }, [result, map]);

  return null;
}

export default function CoverageMap() {
  const { setCoverageData, coverageData } = usePlan();
  const [center, setCenter] = useState(
    coverageData
      ? { lat: coverageData.lat, lng: coverageData.lng }
      : TURMERO_CENTER
  );
  const [address, setAddress] = useState(coverageData?.address ?? "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CoverageResult | null>(coverageData ?? null);
  const [locating, setLocating] = useState(false);
  const [mapError, setMapError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkerDrag = useCallback(
    (lat: number, lng: number) => {
      const addr = buscarDireccionMasCercana(lat, lng);
      setCenter({ lat, lng });
      setAddress(addr);
    },
    []
  );

  const handleInputChange = (value: string) => {
    setAddress(value);
    const filtered = getSuggestions(value);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const selectAddress = (addr: string) => {
    setAddress(addr);
    setShowSuggestions(false);
    const coords = obtenerCoordsPorDireccion(addr);
    if (coords) {
      setCenter(coords);
    }
  };

  const handleCheck = async () => {
    if (!address.trim()) return;
    setChecking(true);
    setMapError("");

    await new Promise((r) => setTimeout(r, 1200));
    const coverage = verificarCobertura(center.lat, center.lng, address);
    setResult(coverage);
    setCoverageData(coverage);
    setChecking(false);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setMapError("La geolocalización no está disponible en este navegador.");
      return;
    }
    setLocating(true);
    setMapError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        const addr = buscarDireccionMasCercana(lat, lng);
        setAddress(addr);
        setSuggestions([]);
        setShowSuggestions(false);
      },
      () => {
        setLocating(false);
        setMapError(
          "No se pudo obtener tu ubicación. Verifica los permisos e intenta de nuevo."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCheckAnother = () => {
    setResult(null);
    setCoverageData(null);
    setCenter(TURMERO_CENTER);
    setAddress("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <section className="relative flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative h-[420px] sm:h-[500px] rounded-2xl overflow-hidden border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-zinc-900 shadow-inner">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            className="h-full w-full"
            style={{ background: "transparent" }}
            whenReady={() => setMapReady(true)}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController
              center={center}
              onMarkerDrag={handleMarkerDrag}
              result={result}
            />
            <DraggableMarker
              center={center}
              onDragEnd={handleMarkerDrag}
              result={result}
            />
            <CoverageCircle result={result} />
          </MapContainer>

          {!mapReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-zinc-900">
              <Loader2 size={32} className="animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 z-[1000]">
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 shadow-lg border border-white/50 dark:border-zinc-800/50">
              <MapPin size={12} className="text-blue-600 dark:text-blue-400" />
              Turmero, Edo. Aragua
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-zinc-600 dark:text-zinc-400 shadow-lg border border-white/50 dark:border-zinc-800/50">
              <Move size={12} className="text-yellow-500" />
              Arrastra el marcador
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-300 overflow-hidden",
                result?.available
                  ? "border-green-500/50 dark:border-green-600/50"
                  : result && !result.available
                    ? "border-red-400/50 dark:border-red-500/50"
                    : "border-blue-200 dark:border-blue-900/30 focus-within:border-blue-500"
              )}
            >
              <Search size={18} className="ml-4 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCheck();
                }}
                placeholder="Escribe tu dirección en Turmero..."
                className="flex-1 py-3.5 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                disabled={!!result}
              />
              {address && !result && (
                <button
                  onClick={() => {
                    setAddress("");
                    setSuggestions([]);
                  }}
                  className="mr-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  &times;
                </button>
              )}
            </div>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-[1001] max-h-48 overflow-y-auto"
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => selectAddress(s)}
                      className="flex items-center gap-2 w-full px-4 py-3 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <MapPin size={14} className="text-blue-500 shrink-0" />
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleUseLocation}
            disabled={locating}
            className={cn(
              "shrink-0 flex items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all duration-300",
              "bg-yellow-400 hover:bg-yellow-500 text-zinc-900 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40",
              "dark:bg-yellow-500 dark:hover:bg-yellow-400 dark:text-zinc-900",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {locating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Navigation size={16} />
            )}
            <span className="hidden sm:inline">Usar mi ubicación</span>
            <span className="sm:hidden">GPS</span>
          </button>
        </div>

        {!result && (
          <button
            onClick={handleCheck}
            disabled={!address.trim() || checking}
            className={cn(
              "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300",
              "bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50",
              "dark:bg-blue-600 dark:hover:bg-blue-500",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            {checking ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Verificando cobertura...
              </span>
            ) : (
              "Verificar disponibilidad"
            )}
          </button>
        )}

        {mapError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl p-3"
          >
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{mapError}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {result && (
            <CoverageResultCard
              result={result}
              onCheckAnother={handleCheckAnother}
            />
          )}
        </AnimatePresence>
      </div>

      <InfoSidebar />
    </section>
  );
}

function CoverageResultCard({
  result,
  onCheckAnother,
}: {
  result: CoverageResult;
  onCheckAnother: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border-2 p-5 backdrop-blur-xl",
        result.available
          ? "border-green-400/40 dark:border-green-500/30 bg-green-50/80 dark:bg-green-950/30"
          : "border-red-400/40 dark:border-red-500/30 bg-red-50/80 dark:bg-red-950/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "shrink-0 flex h-10 w-10 items-center justify-center rounded-xl",
            result.available
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          )}
        >
          {result.available ? <CheckCircle2 size={22} /> : <AlertTriangle size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            {result.available
              ? "Cobertura disponible"
              : "Sin cobertura en esta zona"}
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {result.available
              ? `Dirección verificada: ${result.address}`
              : "Lamentablemente aún no llegamos a esta dirección. Te notificaremos cuando estemos disponibles."}
          </p>

          {result.available && (
            <div className="mt-3 flex flex-wrap gap-2">
              {result.tecnologias.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400"
                >
                  <Wifi size={12} />
                  {t}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                <Zap size={12} />
                {result.velocidadMaxima}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <ShieldCheck size={12} />
                Zona {result.codigoZona}
              </span>
            </div>
          )}
        </div>
      </div>

      {!result.available && (
        <button
          onClick={onCheckAnother}
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
        >
          Verificar otra dirección
        </button>
      )}
    </motion.div>
  );
}

function InfoSidebar() {
  const features = [
    {
      icon: Zap,
      title: "Fibra óptica FTTH",
      desc: "Tecnología de última generación con hasta 1 Gbps de velocidad simétrica.",
    },
    {
      icon: Wifi,
      title: "WiFi 6 incluido",
      desc: "Router de última generación para máxima cobertura en todo tu espacio.",
    },
    {
      icon: ShieldCheck,
      title: "Soporte técnico 24/7",
      desc: "Equipo de soporte disponible cualquier día a cualquier hora.",
    },
  ];

  return (
    <div className="lg:w-80 shrink-0">
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-white dark:bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
          ¿Por qué elegirnos?
        </h3>
        <div className="space-y-4">
          {features.map((f) => (
            <div key={f.title} className="flex gap-3">
              <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                <f.icon size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {f.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
