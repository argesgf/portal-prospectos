"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import { cn } from "@/lib/utils";
import type { PersonaNaturalData, EmpresaData } from "@/lib/mock/data";
import {
  User, Building2, AlertCircle, CheckCircle2,
  ArrowRight, Upload, PenLine, Trash2,
} from "lucide-react";

const steps = [
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

const NIVELES_ESTUDIO = [
  "Primaria", "Secundaria", "Técnico Superior", "Universitario", "Postgrado", "Maestría", "Doctorado",
];

const SEXOS = ["Masculino", "Femenino", "Otro"];

export default function DatosPage() {
  const router = useRouter();
  const {
    tipoUsuario, selectedPlan, coverageData, contactStepData,
    personaData, empresaData, setPersonaData, setEmpresaData, resetFlow,
  } = usePlan();
  const showSuccess = (tipoUsuario === "persona" && !!personaData) || (tipoUsuario === "empresa" && !!empresaData);

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, coverageData, contactStepData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title={tipoUsuario === "empresa" ? "Datos empresariales" : "Datos personales"}
        subtitle={selectedPlan.name}
        backHref="/resumen-plan"
        onHome={handleGoHome}
      />
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={4} />
          {showSuccess ? (
            <SuccessView
              tipo={tipoUsuario}
              onContinue={() => router.push("/catastro")}
            />
          ) : (
            <DatosForm
              tipoUsuario={tipoUsuario}
              contactStepData={contactStepData}
              initialPersona={personaData}
              initialEmpresa={empresaData}
              onSavePersona={setPersonaData}
              onSaveEmpresa={setEmpresaData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessView({ tipo, onContinue }: { tipo: "persona" | "empresa"; onContinue: () => void }) {
  return (
    <div className="anim-fade-in flex flex-col items-center text-center py-12 px-6">
      <div
        className="anim-pop flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6"
      >
        <CheckCircle2 size={36} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Datos registrados correctamente</h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-md">
        {tipo === "empresa"
          ? "Los datos del representante legal y la empresa han sido registrados."
          : "Tus datos personales han sido registrados correctamente."}
      </p>
      <button
        onClick={onContinue}
        className="mt-8 px-10 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
      >
        Continuar con dirección
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

function DatosForm({
  tipoUsuario, contactStepData, initialPersona, initialEmpresa,
  onSavePersona, onSaveEmpresa,
}: {
  tipoUsuario: "persona" | "empresa";
  contactStepData: { nombres: string; apellidos: string; telefono: string; correo: string };
  initialPersona: PersonaNaturalData | null;
  initialEmpresa: EmpresaData | null;
  onSavePersona: (d: PersonaNaturalData) => void;
  onSaveEmpresa: (d: EmpresaData) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [nombres, setNombres] = useState(initialPersona?.nombres ?? contactStepData.nombres);
  const [apellidos, setApellidos] = useState(initialPersona?.apellidos ?? contactStepData.apellidos);
  const [telefono, setTelefono] = useState(initialPersona?.telefono ?? contactStepData.telefono);
  const [correo, setCorreo] = useState(initialPersona?.correo ?? contactStepData.correo);
  const [cedula, setCedula] = useState(initialPersona?.cedula ?? "");
  const [rif, setRif] = useState(initialPersona?.rif ?? "");
  const [sexo, setSexo] = useState(initialPersona?.sexo ?? "");
  const [fechaNacimiento, setFechaNacimiento] = useState(initialPersona?.fechaNacimiento ?? "");
  const [nivelEstudio, setNivelEstudio] = useState(initialPersona?.nivelEstudio ?? "");
  const [cedulaImage, setCedulaImage] = useState<string | null>(initialPersona?.cedulaImage ?? null);
  const [rifImage, setRifImage] = useState<string | null>(initialPersona?.rifImage ?? null);
  const [firma, setFirma] = useState<string | null>(initialPersona?.firma ?? null);

  const [repNombre, setRepNombre] = useState(initialEmpresa?.representanteNombre ?? contactStepData.nombres);
  const [repApellido, setRepApellido] = useState(initialEmpresa?.representanteApellido ?? contactStepData.apellidos);
  const [repTelefono, setRepTelefono] = useState(initialEmpresa?.representanteTelefono ?? contactStepData.telefono);
  const [repCorreo, setRepCorreo] = useState(initialEmpresa?.representanteCorreo ?? contactStepData.correo);
  const [repCedula, setRepCedula] = useState(initialEmpresa?.representanteCedula ?? "");
  const [repRif, setRepRif] = useState(initialEmpresa?.representanteRif ?? "");
  const [repFirma, setRepFirma] = useState<string | null>(initialEmpresa?.representanteFirma ?? null);
  const [empRif, setEmpRif] = useState(initialEmpresa?.rif ?? "");
  const [empNombre, setEmpNombre] = useState(initialEmpresa?.nombre ?? "");
  const [empEmail, setEmpEmail] = useState(initialEmpresa?.emailCorporativo ?? "");
  const [empTelefono, setEmpTelefono] = useState(initialEmpresa?.telefono ?? "");
  const [tipoNegocio, setTipoNegocio] = useState(initialEmpresa?.tipoNegocio ?? "");
  const [empRifImage, setEmpRifImage] = useState<string | null>(initialEmpresa?.rifImage ?? null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombres.trim()) e.nombres = "Requerido";
    if (!apellidos.trim()) e.apellidos = "Requerido";
    if (!telefono.trim()) e.telefono = "Requerido";
    else if (!/^[\d\s\-+()]{10,15}$/.test(telefono.trim())) e.telefono = "Formato inválido";
    if (!correo.trim()) e.correo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) e.correo = "Correo inválido";
    if (!cedula.trim()) e.cedula = "Requerido";
    else if (!/^\d{6,8}$/.test(cedula.trim())) e.cedula = "Formato inválido (6-8 dígitos)";
    if (!rif.trim()) e.rif = "Requerido";
    else if (!/^[JVEG]-\d{5,10}-\d$/.test(rif.trim())) e.rif = "Formato: J-12345678-9";
    if (!sexo) e.sexo = "Selecciona una opción";
    if (!fechaNacimiento) e.fechaNacimiento = "Requerido";
    if (!nivelEstudio) e.nivelEstudio = "Selecciona una opción";
    return e;
  };

  const validateEmpresa = () => {
    const e: Record<string, string> = {};
    if (!repNombre.trim()) e.repNombre = "Requerido";
    if (!repApellido.trim()) e.repApellido = "Requerido";
    if (!repTelefono.trim()) e.repTelefono = "Requerido";
    else if (!/^[\d\s\-+()]{10,15}$/.test(repTelefono.trim())) e.repTelefono = "Formato inválido";
    if (!repCorreo.trim()) e.repCorreo = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(repCorreo.trim())) e.repCorreo = "Correo inválido";
    if (!repCedula.trim()) e.repCedula = "Requerido";
    else if (!/^\d{6,8}$/.test(repCedula.trim())) e.repCedula = "Formato inválido";
    if (!repRif.trim()) e.repRif = "Requerido";
    else if (!/^[JVEG]-\d{5,10}-\d$/.test(repRif.trim())) e.repRif = "Formato: J-12345678-9";
    if (!empRif.trim()) e.empRif = "Requerido";
    else if (!/^[JVEG]-\d{5,10}-\d$/.test(empRif.trim())) e.empRif = "Formato: J-12345678-9";
    if (!empNombre.trim()) e.empNombre = "Requerido";
    if (!empEmail.trim()) e.empEmail = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empEmail.trim())) e.empEmail = "Correo inválido";
    if (!empTelefono.trim()) e.empTelefono = "Requerido";
    if (!tipoNegocio.trim()) e.tipoNegocio = "Requerido";
    return e;
  };

  const handleBlur = (field: string) => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const handleSubmitPersona = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const all: Record<string, boolean> = {};
      Object.keys(errs).forEach((k) => (all[k] = true));
      setTouched(all);
      return;
    }
    onSavePersona({
      nombres: nombres.trim(), apellidos: apellidos.trim(), telefono: telefono.trim(),
      correo: correo.trim(), cedula: cedula.trim(), rif: rif.trim(),
      sexo, fechaNacimiento, nivelEstudio, cedulaImage, rifImage, firma,
    });
    setSubmitted(true);
  };

  const handleSubmitEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateEmpresa();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const all: Record<string, boolean> = {};
      Object.keys(errs).forEach((k) => (all[k] = true));
      setTouched(all);
      return;
    }
    onSaveEmpresa({
      representanteNombre: repNombre.trim(), representanteApellido: repApellido.trim(),
      representanteTelefono: repTelefono.trim(), representanteCorreo: repCorreo.trim(),
      representanteCedula: repCedula.trim(), representanteRif: repRif.trim(),
      representanteFirma: repFirma,
      rif: empRif.trim(), nombre: empNombre.trim(), emailCorporativo: empEmail.trim(),
      telefono: empTelefono.trim(), tipoNegocio: tipoNegocio.trim(), rifImage: empRifImage,
    });
    setSubmitted(true);
  };

  if (submitted) return null;

  if (tipoUsuario === "persona") {
    return (
      <form
        onSubmit={handleSubmitPersona}
        className="anim-fade-in-up mt-4 space-y-6"
        noValidate
      >
        <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 flex items-start gap-3">
          <User size={18} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Datos prellenados del paso anterior</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Puedes modificarlos si es necesario</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombres" value={nombres} onChange={setNombres} onBlur={() => handleBlur("nombres")} error={touched.nombres ? errors.nombres : undefined} />
          <Field label="Apellidos" value={apellidos} onChange={setApellidos} onBlur={() => handleBlur("apellidos")} error={touched.apellidos ? errors.apellidos : undefined} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Teléfono" value={telefono} onChange={setTelefono} onBlur={() => handleBlur("telefono")} error={touched.telefono ? errors.telefono : undefined} type="tel" placeholder="Ej: +58 412 1234567" />
          <Field label="Correo electrónico" value={correo} onChange={setCorreo} onBlur={() => handleBlur("correo")} error={touched.correo ? errors.correo : undefined} type="email" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Cédula de identidad" value={cedula} onChange={setCedula} onBlur={() => handleBlur("cedula")} error={touched.cedula ? errors.cedula : undefined} />
          <Field label="RIF" value={rif} onChange={setRif} onBlur={() => handleBlur("rif")} error={touched.rif ? errors.rif : undefined} placeholder="Ej: J-12345678-9" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <SelectField label="Sexo" value={sexo} onChange={setSexo} options={SEXOS} onBlur={() => handleBlur("sexo")} error={touched.sexo ? errors.sexo : undefined} />
          <Field label="Fecha de nacimiento" value={fechaNacimiento} onChange={setFechaNacimiento} onBlur={() => handleBlur("fechaNacimiento")} error={touched.fechaNacimiento ? errors.fechaNacimiento : undefined} type="date" />
        </div>
        <SelectField label="Nivel de estudio" value={nivelEstudio} onChange={setNivelEstudio} options={NIVELES_ESTUDIO} onBlur={() => handleBlur("nivelEstudio")} error={touched.nivelEstudio ? errors.nivelEstudio : undefined} />

        <div className="grid sm:grid-cols-2 gap-4">
          <ImageUpload label="Cédula de identidad (frontal)" value={cedulaImage} onChange={setCedulaImage} />
          <ImageUpload label="RIF" value={rifImage} onChange={setRifImage} />
        </div>

        <SignaturePad label="Firma" value={firma} onChange={setFirma} />

        <button
          type="submit"
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
        >
          Guardar y continuar
          <ArrowRight size={18} />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmitEmpresa}
      className="anim-fade-in-up mt-4 space-y-6"
      noValidate
    >
      <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30 flex items-start gap-3">
        <Building2 size={18} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Datos del representante legal</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Hemos prellenado los datos del contacto anterior</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nombres" value={repNombre} onChange={setRepNombre} onBlur={() => handleBlur("repNombre")} error={touched.repNombre ? errors.repNombre : undefined} />
        <Field label="Apellidos" value={repApellido} onChange={setRepApellido} onBlur={() => handleBlur("repApellido")} error={touched.repApellido ? errors.repApellido : undefined} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Teléfono" value={repTelefono} onChange={setRepTelefono} onBlur={() => handleBlur("repTelefono")} error={touched.repTelefono ? errors.repTelefono : undefined} type="tel" placeholder="Ej: +58 412 1234567" />
        <Field label="Correo electrónico" value={repCorreo} onChange={setRepCorreo} onBlur={() => handleBlur("repCorreo")} error={touched.repCorreo ? errors.repCorreo : undefined} type="email" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Cédula del representante" value={repCedula} onChange={setRepCedula} onBlur={() => handleBlur("repCedula")} error={touched.repCedula ? errors.repCedula : undefined} />
        <Field label="RIF del representante" value={repRif} onChange={setRepRif} onBlur={() => handleBlur("repRif")} error={touched.repRif ? errors.repRif : undefined} placeholder="Ej: J-12345678-9" />
      </div>

      <SignaturePad label="Firma del representante legal" value={repFirma} onChange={setRepFirma} />

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-start gap-3">
        <Building2 size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">Datos de la empresa</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="RIF de la empresa" value={empRif} onChange={setEmpRif} onBlur={() => handleBlur("empRif")} error={touched.empRif ? errors.empRif : undefined} placeholder="Ej: J-12345678-9" />
        <Field label="Nombre de la empresa" value={empNombre} onChange={setEmpNombre} onBlur={() => handleBlur("empNombre")} error={touched.empNombre ? errors.empNombre : undefined} placeholder="Ej: Tecnología Avanzada C.A." />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Correo corporativo" value={empEmail} onChange={setEmpEmail} onBlur={() => handleBlur("empEmail")} error={touched.empEmail ? errors.empEmail : undefined} type="email" placeholder="Ej: info@empresa.com" />
        <Field label="Teléfono de la empresa" value={empTelefono} onChange={setEmpTelefono} onBlur={() => handleBlur("empTelefono")} error={touched.empTelefono ? errors.empTelefono : undefined} type="tel" placeholder="Ej: +58 243 5551234" />
      </div>
      <Field label="Tipo de negocio" value={tipoNegocio} onChange={setTipoNegocio} onBlur={() => handleBlur("tipoNegocio")} error={touched.tipoNegocio ? errors.tipoNegocio : undefined} placeholder="Ej: Comercio electrónico, servicios profesionales" />

      <ImageUpload label="RIF de la empresa" value={empRifImage} onChange={setEmpRifImage} />

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
      >
        Guardar y continuar
        <ArrowRight size={18} />
      </button>
    </form>
  );
}

function Field({ label, value, onChange, onBlur, error, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  error?: string; type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      <div className={cn(
        "rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-200 overflow-hidden",
        error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800 focus-within:border-yellow-500"
      )}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full py-3 px-4 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
        />
      </div>
      {error && <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"><AlertCircle size={12} />{error}</span>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, onBlur, error }: {
  label: string; value: string; onChange: (v: string) => void; onBlur: () => void;
  options: string[]; error?: string;
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
          className="w-full py-3 px-4 bg-transparent text-sm text-zinc-900 dark:text-white outline-none appearance-none cursor-pointer"
        >
          <option value="" disabled>Selecciona...</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {error && <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400"><AlertCircle size={12} />{error}</span>}
    </div>
  );
}

function ImageUpload({ label, value, onChange }: {
  label: string; value: string | null; onChange: (v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      {value ? (
        <div className="relative rounded-xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <img src={value} alt={label} className="w-full h-32 object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          <Upload size={24} />
          <span className="text-xs font-medium">Subir imagen (JPG/PNG, máx 5MB)</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}

function SignaturePad({ label, value, onChange }: {
  label: string; value: string | null; onChange: (v: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#020617";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
        <PenLine size={14} />
        {label}
      </label>
      {value ? (
        <div className="relative rounded-xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900">
          <img src={value} alt="Firma" className="w-full h-32 object-contain" />
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={500}
            height={150}
            className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <button
            type="button"
            onClick={clearCanvas}
            className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 hover:text-red-500 transition-colors"
          >
            <Trash2 size={12} />
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
}
