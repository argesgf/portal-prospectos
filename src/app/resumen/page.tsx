"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/context/plan-context";
import FlowHeader from "@/components/flow/FlowHeader";
import StepIndicator from "@/components/flow/StepIndicator";
import PlanSummaryCard from "@/components/flow/PlanSummaryCard";
import {
  User, Mail, Phone, CreditCard, FileText, Building2, MapPin,
  ShieldCheck, CheckCircle2, Home, Layers, ArrowRight,
} from "lucide-react";
import {
  COSTO_INSTALACION_WIFI, COSTO_INSTALACION_NO_WIFI, RECARGO_FINANCIAMIENTO,
} from "@/lib/mock/data";

const steps = [
  { label: "Contacto", number: 1 },
  { label: "Cobertura", number: 2 },
  { label: "Plan", number: 3 },
  { label: "Datos", number: 4 },
  { label: "Dirección", number: 5 },
  { label: "Resumen", number: 6 },
];

export default function ResumenPage() {
  const router = useRouter();
  const {
    tipoUsuario, selectedPlan, coverageData, contactStepData,
    personaData, empresaData, catastroData,
    tipoInstalacion, tipoFinanciamiento, resetFlow,
  } = usePlan();
  const [confirmed, setConfirmed] = useState(false);

  const hasPersonaData = tipoUsuario === "persona" && !!personaData;
  const hasEmpresaData = tipoUsuario === "empresa" && !!empresaData;

  useEffect(() => {
    if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData || !catastroData) {
      router.replace("/");
    }
    if (!hasPersonaData && !hasEmpresaData) {
      router.replace("/datos");
    }
  }, [tipoUsuario, selectedPlan, coverageData, contactStepData, catastroData, hasPersonaData, hasEmpresaData, router]);

  const handleGoHome = useCallback(() => {
    resetFlow();
    router.push("/");
  }, [resetFlow, router]);

  if (!tipoUsuario || !selectedPlan || !coverageData?.available || !contactStepData || !catastroData) {
    return <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950" />;
  }

  const data = tipoUsuario === "persona" ? personaData : empresaData;
  if (!data) return null;

  const costoInstalacion = tipoInstalacion === "wifi" ? COSTO_INSTALACION_WIFI : COSTO_INSTALACION_NO_WIFI;
  const recargo = tipoFinanciamiento === "financiamiento" ? RECARGO_FINANCIAMIENTO : 0;
  const recargoMonto = Math.round(selectedPlan.price * recargo);
  const totalMensual = selectedPlan.price + recargoMonto;
  const granTotal = totalMensual + costoInstalacion;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="anim-fade-in flex flex-col items-center text-center py-12 px-6 max-w-md">
          <div
            className="anim-pop flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-yellow-400 text-white shadow-2xl shadow-blue-600/30 mb-6"
          >
            <CheckCircle2 size={42} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
            Contratación confirmada
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-md">
            Tu solicitud ha sido registrada con éxito. Un asesor se comunicará contigo en las próximas 24 horas para coordinar la instalación.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2">
            <ShieldCheck size={16} className="text-green-500" />
            Tus datos están protegidos y encriptados
          </div>
          <button
            onClick={() => { resetFlow(); router.push("/"); }}
            className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-700/30 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <FlowHeader
        title="Resumen de contratación"
        subtitle={selectedPlan.name}
        backHref="/catastro"
        onHome={handleGoHome}
      />
      <div className="pt-16">
        <div className="mx-auto max-w-2xl px-6 pt-6 pb-16">
          <StepIndicator steps={steps} currentStep={6} />
          <div className="anim-fade-in-up mt-4 space-y-6">
            <PlanSummaryCard />

            <Section title="Datos del contrato">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
                <Row icon={<User size={16} />} label="Nombre" value={
                  tipoUsuario === "persona"
                    ? `${personaData?.nombres} ${personaData?.apellidos}`
                    : `${empresaData?.representanteNombre} ${empresaData?.representanteApellido}`
                } />
                <Row icon={<Mail size={16} />} label="Correo" value={
                  tipoUsuario === "persona" ? personaData?.correo ?? "" : empresaData?.representanteCorreo ?? ""
                } />
                <Row icon={<Phone size={16} />} label="Teléfono" value={
                  tipoUsuario === "persona" ? personaData?.telefono ?? "" : empresaData?.representanteTelefono ?? ""
                } />
                <Row icon={<CreditCard size={16} />} label="Cédula" value={
                  tipoUsuario === "persona" ? personaData?.cedula ?? "" : empresaData?.representanteCedula ?? ""
                } />
                <Row icon={<FileText size={16} />} label="RIF" value={
                  tipoUsuario === "persona" ? personaData?.rif ?? "" : empresaData?.representanteRif ?? ""
                } />
                {tipoUsuario === "empresa" && (
                  <>
                    <hr className="border-zinc-200 dark:border-zinc-800" />
                    <Row icon={<Building2 size={16} />} label="Empresa" value={`${empresaData?.nombre} - ${empresaData?.rif}`} />
                    <Row icon={<Mail size={16} />} label="Correo corporativo" value={empresaData?.emailCorporativo ?? ""} />
                    <Row icon={<Phone size={16} />} label="Tel. empresa" value={empresaData?.telefono ?? ""} />
                    <Row icon={<FileText size={16} />} label="Tipo de negocio" value={empresaData?.tipoNegocio ?? ""} />
                  </>
                )}
              </div>
            </Section>

            <Section title="Dirección de instalación">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
                <Row icon={<Home size={16} />} label="Tipo de vivienda" value={catastroData.tipoVivienda === "horizontal" ? "Horizontal" : "Vertical"} />
                <Row icon={catastroData.tipoPropiedad === "casa" ? <Home size={16} /> : <Building2 size={16} />} label="Propiedad" value={catastroData.tipoPropiedad === "casa" ? "Casa" : "Apartamento"} />
                {catastroData.tipoPropiedad === "apartamento" && (
                  <>
                    {catastroData.edificio && <Row icon={<Building2 size={16} />} label="Edificio" value={catastroData.edificio} />}
                    <Row icon={<Building2 size={16} />} label="Nro / Piso" value={`${catastroData.nroApto}, Piso ${catastroData.piso}`} />
                  </>
                )}
                {catastroData.tipoPropiedad === "casa" && (
                  <Row icon={<Home size={16} />} label="Nro de casa" value={catastroData.nroCasa} />
                )}
                <Row icon={<Layers size={16} />} label="Ámbito" value={`${catastroData.tipoAmbito} ${catastroData.ambito}`} />
                <Row icon={<MapPin size={16} />} label="Dirección" value={catastroData.direccion} />
              </div>
            </Section>

            {tipoUsuario === "persona" && personaData?.firma && (
              <Section title="Documentos adjuntos">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
                  {personaData.cedulaImage && <DocPreview label="Cédula de identidad" src={personaData.cedulaImage} />}
                  {personaData.rifImage && <DocPreview label="RIF" src={personaData.rifImage} />}
                  {personaData.firma && <DocPreview label="Firma" src={personaData.firma} />}
                </div>
              </Section>
            )}

            {tipoUsuario === "empresa" && (
              <Section title="Documentos adjuntos">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-4">
                  {empresaData?.rifImage && <DocPreview label="RIF de la empresa" src={empresaData.rifImage} />}
                  {empresaData?.representanteFirma && <DocPreview label="Firma del representante legal" src={empresaData.representanteFirma} />}
                </div>
              </Section>
            )}

            <Section title="Totales">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Plan {selectedPlan.name}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">${selectedPlan.price.toLocaleString("es-VE")}/mes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Instalación {tipoInstalacion === "wifi" ? "con WiFi" : "sin WiFi"}</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">${costoInstalacion.toLocaleString("es-VE")}</span>
                </div>
                {tipoFinanciamiento === "financiamiento" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Recargo financiamiento (15%)</span>
                    <span className="font-semibold text-yellow-600 dark:text-yellow-400">+${recargoMonto.toLocaleString("es-VE")}/mes</span>
                  </div>
                )}
                <hr className="border-zinc-200 dark:border-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-900 dark:text-white">Total mensual</span>
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">${totalMensual.toLocaleString("es-VE")}<span className="text-sm font-normal">/mes</span></span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-400/30">
                  <span className="font-bold text-zinc-900 dark:text-white">Primer mes + instalación</span>
                  <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">${granTotal.toLocaleString("es-VE")}</span>
                </div>
              </div>
            </Section>

            <button
              onClick={() => setConfirmed(true)}
              className="w-full py-4 rounded-xl text-base font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-xl shadow-blue-700/30 hover:shadow-blue-700/50 dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500 dark:text-zinc-900 dark:shadow-yellow-400/30"
            >
              Confirmar contratación
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
              Al confirmar, aceptas nuestros términos y condiciones. Sin permanencia forzosa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-yellow-600 dark:text-yellow-400 shrink-0">{icon}</span>
      <span className="text-zinc-500 dark:text-zinc-400 min-w-[80px]">{label}:</span>
      <span className="text-zinc-900 dark:text-white font-medium">{value}</span>
    </div>
  );
}

function DocPreview({ label, src }: { label: string; src: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{label}</p>
      <img src={src} alt={label} className="w-full h-28 object-contain rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950" />
    </div>
  );
}
