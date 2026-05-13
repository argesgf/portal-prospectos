"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import { motion } from "framer-motion";
import { User, Mail, Phone, AlertCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

export default function ContactoPage() {
  const router = useRouter();
  const { tipoUsuario, selectedPlan, contactStepData, setContactStepData, resetFlow } = usePlan();

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan) {
      router.replace("/");
    }
  }, [tipoUsuario, selectedPlan, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Datos de contacto"
        subtitle={selectedPlan.name}
        onHome={handleGoHome}
      />
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={1} />
          <ContactForm
            initial={contactStepData}
            onSave={(data) => {
              setContactStepData(data);
              router.push("/cobertura");
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ContactForm({
  initial,
  onSave,
}: {
  initial: { nombres: string; apellidos: string; telefono: string; correo: string } | null;
  onSave: (data: { nombres: string; apellidos: string; telefono: string; correo: string }) => void;
}) {
  const [nombres, setNombres] = useState(initial?.nombres ?? "");
  const [apellidos, setApellidos] = useState(initial?.apellidos ?? "");
  const [telefono, setTelefono] = useState(initial?.telefono ?? "");
  const [correo, setCorreo] = useState(initial?.correo ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (field?: string) => {
    const errs: Record<string, string> = {};
    if (!field || field === "nombres") { if (!nombres.trim()) errs.nombres = "Requerido"; }
    if (!field || field === "apellidos") { if (!apellidos.trim()) errs.apellidos = "Requerido"; }
    if (!field || field === "telefono") {
      if (!telefono.trim()) errs.telefono = "Requerido";
      else if (!/^[\d\s\-+()]{10,15}$/.test(telefono.trim())) errs.telefono = "Formato inválido";
    }
    if (!field || field === "correo") {
      if (!correo.trim()) errs.correo = "Requerido";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) errs.correo = "Correo inválido";
    }
    return errs;
  };

  const handleBlur = (field: string) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors((p) => ({ ...p, ...validate(field) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const all: Record<string, boolean> = {};
      Object.keys(errs).forEach((k) => (all[k] = true));
      setTouched(all);
      return;
    }
    onSave({ nombres: nombres.trim(), apellidos: apellidos.trim(), telefono: telefono.trim(), correo: correo.trim() });
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
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Nombres"
          icon={<User size={16} />}
          value={nombres}
          onChange={setNombres}
          onBlur={() => handleBlur("nombres")}
          error={touched.nombres ? errors.nombres : undefined}
          placeholder="Ej: Carlos Eduardo"
        />
        <Field
          label="Apellidos"
          icon={<User size={16} />}
          value={apellidos}
          onChange={setApellidos}
          onBlur={() => handleBlur("apellidos")}
          error={touched.apellidos ? errors.apellidos : undefined}
          placeholder="Ej: Pérez González"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Teléfono"
          icon={<Phone size={16} />}
          value={telefono}
          onChange={setTelefono}
          onBlur={() => handleBlur("telefono")}
          error={touched.telefono ? errors.telefono : undefined}
          type="tel"
          placeholder="Ej: +58 412 1234567"
        />
        <Field
          label="Correo electrónico"
          icon={<Mail size={16} />}
          value={correo}
          onChange={setCorreo}
          onBlur={() => handleBlur("correo")}
          error={touched.correo ? errors.correo : undefined}
          type="email"
          placeholder="Ej: usuario@correo.com"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
      >
        Verificar cobertura
        <ArrowRight size={18} />
      </button>
    </motion.form>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}</label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-200 overflow-hidden",
          error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800 focus-within:border-yellow-500"
        )}
      >
        <span className="ml-3 text-zinc-400 shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 py-3 pr-3 bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
        />
      </div>
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  );
}
