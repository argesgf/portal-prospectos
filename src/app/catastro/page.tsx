"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowRight, Building2, Home, AlertCircle, MapPin,
} from "lucide-react";
import {
  TIPOS_AMBITO, ambitosPorTipo, EDIFICIOS_POR_AMBITO,
  type CatastroData,
} from "@/lib/mock/data";

const steps = [
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

export default function CatastroPage() {
  const router = useRouter();
  const {
    tipoUsuario, selectedPlan, coverageData, contactStepData,
    personaData, empresaData, catastroData, setCatastroData, resetFlow,
  } = usePlan();
  const hasPersonaData = tipoUsuario === "persona" && !!personaData;
  const hasEmpresaData = tipoUsuario === "empresa" && !!empresaData;

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
      router.replace("/");
    }
    if (!hasPersonaData && !hasEmpresaData) {
      router.replace("/datos");
    }
  }, [tipoUsuario, selectedPlan, coverageData, contactStepData, hasPersonaData, hasEmpresaData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  const handleSave = useCallback((data: CatastroData) => {
    setCatastroData(data);
    router.push("/resumen");
  }, [setCatastroData, router]);

  if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Dirección de instalación"
        subtitle={selectedPlan.name}
        backHref="/datos"
        onHome={handleGoHome}
      />
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={5} />
          <CatastroForm initial={catastroData} coverageAddress={coverageData.address} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}

function CatastroForm({
  initial,
  coverageAddress,
  onSave,
}: {
  initial: CatastroData | null;
  coverageAddress: string;
  onSave: (data: CatastroData) => void;
}) {
  const [tipoVivienda, setTipoVivienda] = useState<"horizontal" | "vertical" | null>(initial?.tipoVivienda ?? null);
  const [tipoPropiedad, setTipoPropiedad] = useState<"casa" | "apartamento" | null>(initial?.tipoPropiedad ?? null);
  const [edificio, setEdificio] = useState(initial?.edificio ?? "");
  const [nroApto, setNroApto] = useState(initial?.nroApto ?? "");
  const [piso, setPiso] = useState(initial?.piso ?? "");
  const [nroCasa, setNroCasa] = useState(initial?.nroCasa ?? "");
  const [tipoAmbito, setTipoAmbito] = useState(initial?.tipoAmbito ?? "");
  const [ambito, setAmbito] = useState(initial?.ambito ?? "");
  const [direccion, setDireccion] = useState(initial?.direccion ?? coverageAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const ambitosDisponibles = tipoAmbito ? ambitosPorTipo[tipoAmbito] ?? [] : [];
  const edificiosDisponibles = ambito ? EDIFICIOS_POR_AMBITO[ambito] ?? [] : [];

  const handleBlur = (field: string) => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!tipoVivienda) errs.tipoVivienda = "Selecciona una opción";
    if (!tipoPropiedad) errs.tipoPropiedad = "Selecciona una opción";
    if (tipoPropiedad === "apartamento") {
      if (!edificio.trim()) errs.edificio = "Requerido";
      if (!nroApto.trim()) errs.nroApto = "Requerido";
      if (!piso.trim()) errs.piso = "Requerido";
    }
    if (tipoPropiedad === "casa" && !nroCasa.trim()) errs.nroCasa = "Requerido";
    if (!tipoAmbito) errs.tipoAmbito = "Selecciona una opción";
    if (!ambito) errs.ambito = "Selecciona una opción";
    if (!direccion.trim()) errs.direccion = "Requerido";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const all: Record<string, boolean> = {};
      Object.keys(errs).forEach((k) => (all[k] = true));
      setTouched(all);
      return;
    }

    onSave({
      tipoVivienda, tipoPropiedad, edificio: edificio.trim(), nroApto: nroApto.trim(),
      piso: piso.trim(), nroCasa: nroCasa.trim(), tipoAmbito, ambito, direccion: direccion.trim(),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="mt-4 space-y-6"
      noValidate
    >
      <div>
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Tipo de vivienda</p>
        <div className="grid grid-cols-2 gap-3">
          {(["horizontal", "vertical"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTipoVivienda(t); setTipoPropiedad(null); }}
              className={cn(
                "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200",
                tipoVivienda === t
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 shadow-lg shadow-yellow-400/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {t === "horizontal" ? <Home size={28} className={tipoVivienda === t ? "text-yellow-600" : "text-zinc-400"} /> : <Building2 size={28} className={tipoVivienda === t ? "text-yellow-600" : "text-zinc-400"} />}
              <span className="font-semibold text-sm text-zinc-900 dark:text-white capitalize">{t}</span>
            </button>
          ))}
        </div>
        {touched.tipoVivienda && errors.tipoVivienda && <ErrorMsg msg={errors.tipoVivienda} />}
      </div>

      {tipoVivienda && (
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            {tipoVivienda === "vertical" ? "Tipo de propiedad" : "Tipo de vivienda"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(["casa", "apartamento"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoPropiedad(t)}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200",
                  tipoPropiedad === t
                    ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 shadow-lg shadow-yellow-400/10"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                )}
              >
                {t === "casa" ? <Home size={24} className={tipoPropiedad === t ? "text-yellow-600" : "text-zinc-400"} /> : <Building2 size={24} className={tipoPropiedad === t ? "text-yellow-600" : "text-zinc-400"} />}
                <span className="font-semibold text-sm text-zinc-900 dark:text-white capitalize">{t}</span>
              </button>
            ))}
          </div>
          {touched.tipoPropiedad && errors.tipoPropiedad && <ErrorMsg msg={errors.tipoPropiedad} />}
        </div>
      )}

      {tipoPropiedad === "apartamento" && ambito && edificiosDisponibles.length > 0 && (
        <SelectField label="Edificio" value={edificio} onChange={setEdificio} options={edificiosDisponibles} onBlur={() => handleBlur("edificio")} error={touched.edificio ? errors.edificio : undefined} />
      )}
      {tipoPropiedad === "apartamento" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nro de apartamento" value={nroApto} onChange={setNroApto} onBlur={() => handleBlur("nroApto")} error={touched.nroApto ? errors.nroApto : undefined} placeholder="Ej: 4-A" />
          <Field label="Piso" value={piso} onChange={setPiso} onBlur={() => handleBlur("piso")} error={touched.piso ? errors.piso : undefined} placeholder="Ej: 4" />
        </div>
      )}
      {tipoPropiedad === "casa" && (
        <Field label="Nro de casa" value={nroCasa} onChange={setNroCasa} onBlur={() => handleBlur("nroCasa")} error={touched.nroCasa ? errors.nroCasa : undefined} placeholder="Ej: 42" />
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Tipo de ámbito" value={tipoAmbito} onChange={(v) => { setTipoAmbito(v); setAmbito(""); }} options={TIPOS_AMBITO} onBlur={() => handleBlur("tipoAmbito")} error={touched.tipoAmbito ? errors.tipoAmbito : undefined} />
        <SelectField label="Ámbito" value={ambito} onChange={setAmbito} options={ambitosDisponibles} onBlur={() => handleBlur("ambito")} error={touched.ambito ? errors.ambito : undefined} disabled={!tipoAmbito} />
      </div>

      <Field label="Dirección completa" value={direccion} onChange={setDireccion} onBlur={() => handleBlur("direccion")} error={touched.direccion ? errors.direccion : undefined} placeholder="Ej: Calle Bolívar, Turmero, Aragua" icon={<MapPin size={16} />} />

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
      >
        Continuar al resumen
        <ArrowRight size={18} />
      </button>
    </motion.form>
  );
}

function Field({ label, value, onChange, onBlur, error, type = "text", placeholder, icon }: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  error?: string; type?: string; placeholder?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      <div className={cn(
        "flex items-center gap-3 rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-200 overflow-hidden",
        error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800 focus-within:border-yellow-500"
      )}>
        {icon && <span className="ml-3 text-zinc-400 shrink-0">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 py-3 pr-3 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
        />
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function SelectField({ label, value, onChange, options, onBlur, error, disabled }: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  options: string[]; error?: string; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      <div className={cn(
        "rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-200 overflow-hidden",
        error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800 focus-within:border-yellow-500"
      )}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className="w-full py-3 px-4 bg-transparent text-sm text-zinc-900 dark:text-white outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="" disabled>{disabled ? "Selecciona un tipo de ámbito primero" : "Selecciona..."}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function ErrorMsg({ msg }: { msg: string }) {
  return <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1"><AlertCircle size={12} />{msg}</span>;
}
