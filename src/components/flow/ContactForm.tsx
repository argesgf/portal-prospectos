"use client";

import { usePlan } from "@/lib/context/plan-context";
import type { ContactFormData, TipoUsuario } from "@/lib/mock/data";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface FormErrors {
  nombres?: string;
  apellidos?: string;
  cedula?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  nombreEmpresa?: string;
  rif?: string;
}

function validateForm(
  data: ContactFormData,
  tipoUsuario: TipoUsuario
): FormErrors {
  const errors: FormErrors = {};

  if (!data.nombres.trim()) errors.nombres = "Requerido";
  if (!data.apellidos.trim()) errors.apellidos = "Requerido";
  if (!data.cedula.trim()) {
    errors.cedula = "Requerido";
  } else if (!/^\d{6,8}$/.test(data.cedula.trim())) {
    errors.cedula = "Formato inválido (6-8 dígitos)";
  }
  if (!data.telefono.trim()) {
    errors.telefono = "Requerido";
  } else if (!/^[\d\s\-+()]{10,15}$/.test(data.telefono.trim())) {
    errors.telefono = "Formato inválido";
  }
  if (!data.correo.trim()) {
    errors.correo = "Requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo.trim())) {
    errors.correo = "Correo inválido";
  }
  if (!data.direccion.trim()) errors.direccion = "Requerido";

  if (tipoUsuario === "empresa") {
    if (!data.nombreEmpresa?.trim()) errors.nombreEmpresa = "Requerido";
    if (!data.rif?.trim()) {
      errors.rif = "Requerido";
    } else if (!/^[JVG]-\d{5,10}-\d$/.test(data.rif!.trim())) {
      errors.rif = "Formato: J-12345678-9";
    }
  }

  return errors;
}

export default function ContactForm() {
  const { tipoUsuario, coverageData, setContactData } = usePlan();
  const [formData, setFormData] = useState<ContactFormData>({
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    correo: "",
    direccion: coverageData?.address || "",
    nombreEmpresa: "",
    rif: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newData = { ...formData, [field]: value };
      const newErrors = validateForm(newData, tipoUsuario!);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof ContactFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(formData, tipoUsuario!);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateForm(formData, tipoUsuario!);
    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      const allTouched: Record<string, boolean> = {};
      Object.keys(allErrors).forEach((k) => (allTouched[k] = true));
      setTouched(allTouched);
      return;
    }

    setContactData(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-12 px-6"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Datos registrados correctamente
        </h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-md">
          Tus datos han sido validados. Revisa el resumen de tu contratación a
          continuación.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label="Nombres"
          icon={<User size={16} />}
          value={formData.nombres}
          onChange={(v) => handleChange("nombres", v)}
          onBlur={() => handleBlur("nombres")}
          error={errors.nombres}
          placeholder="Ej: Carlos Eduardo"
        />
        <InputField
          label="Apellidos"
          icon={<User size={16} />}
          value={formData.apellidos}
          onChange={(v) => handleChange("apellidos", v)}
          onBlur={() => handleBlur("apellidos")}
          error={errors.apellidos}
          placeholder="Ej: Pérez González"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InputField
          label={tipoUsuario === "empresa" ? "Cédula del representante" : "Cédula de identidad"}
          icon={<CreditCard size={16} />}
          value={formData.cedula}
          onChange={(v) => handleChange("cedula", v)}
          onBlur={() => handleBlur("cedula")}
          error={errors.cedula}
          placeholder="Ej: 12345678"
        />
        <InputField
          label="Teléfono"
          icon={<Phone size={16} />}
          value={formData.telefono}
          onChange={(v) => handleChange("telefono", v)}
          onBlur={() => handleBlur("telefono")}
          error={errors.telefono}
          placeholder="Ej: +58 412 1234567"
          type="tel"
        />
      </div>

      <InputField
        label="Correo electrónico"
        icon={<Mail size={16} />}
        value={formData.correo}
        onChange={(v) => handleChange("correo", v)}
        onBlur={() => handleBlur("correo")}
        error={errors.correo}
        type="email"
        placeholder="Ej: usuario@correo.com"
      />

      <InputField
        label="Dirección de instalación"
        icon={<MapPin size={16} />}
        value={formData.direccion}
        onChange={(v) => handleChange("direccion", v)}
        onBlur={() => handleBlur("direccion")}
        error={errors.direccion}
        placeholder="Ej: Calle Bolívar, Turmero, Aragua"
      />

      {tipoUsuario === "empresa" && (
        <div className="space-y-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 size={14} />
            Datos de la empresa
          </p>

          <InputField
            label="Nombre de la empresa"
            icon={<Building2 size={16} />}
            value={formData.nombreEmpresa || ""}
            onChange={(v) => handleChange("nombreEmpresa", v)}
            onBlur={() => handleBlur("nombreEmpresa")}
            error={errors.nombreEmpresa}
            placeholder="Ej: Tecnología Avanzada C.A."
          />
          <InputField
            label="RIF"
            icon={<FileText size={16} />}
            value={formData.rif || ""}
            onChange={(v) => handleChange("rif", v)}
            onBlur={() => handleBlur("rif")}
            error={errors.rif}
            placeholder="Ej: J-12345678-9"
          />
        </div>
      )}

      <button
        type="submit"
        className={cn(
          "w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300",
          "bg-blue-700 hover:bg-blue-800 text-white shadow-lg shadow-blue-700/30 hover:shadow-blue-700/50",
          "dark:bg-blue-600 dark:hover:bg-blue-500"
        )}
      >
        {tipoUsuario === "empresa"
          ? "Registrar datos empresariales"
          : "Registrar datos personales"}
      </button>
    </motion.form>
  );
}

function InputField({
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
      <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border-2 bg-white dark:bg-zinc-900 transition-all duration-200 overflow-hidden",
          error
            ? "border-red-400 dark:border-red-500"
            : "border-zinc-200 dark:border-zinc-800 focus-within:border-blue-500"
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
