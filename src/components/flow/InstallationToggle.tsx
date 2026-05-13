"use client";

import { usePlan } from "@/lib/context/plan-context";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Router, Antenna } from "lucide-react";
import { motion } from "framer-motion";
import type { TipoInstalacion } from "@/lib/mock/data";
import { COSTO_INSTALACION_WIFI, COSTO_INSTALACION_NO_WIFI } from "@/lib/mock/data";

export default function InstallationToggle() {
  const { tipoInstalacion, setTipoInstalacion } = usePlan();

  const options: {
    value: TipoInstalacion;
    label: string;
    desc: string;
    price: number;
    icon: typeof Wifi;
    features: string[];
  }[] = [
    {
      value: "wifi",
      label: "Con WiFi",
      desc: "Router WiFi 6 incluido con instalación completa",
      price: COSTO_INSTALACION_WIFI,
      icon: Wifi,
      features: [
        "Router WiFi 6 de doble banda",
        "Configuración de red incluida",
        "Contraseña personalizada",
        "Hasta 50 dispositivos conectados",
      ],
    },
    {
      value: "no-wifi",
      label: "Sin WiFi",
      desc: "Solo instalación de fibra óptica, tú pones el router",
      price: COSTO_INSTALACION_NO_WIFI,
      icon: Antenna,
      features: [
        "Instalación de fibra hasta el ONT",
        "Conexión por cable Ethernet",
        "Sin configuración de red",
        "Trae tu propio router",
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Tipo de instalación
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Elige si deseas incluir el router WiFi o solo la instalación de fibra
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const selected = tipoInstalacion === opt.value;
          return (
            <motion.button
              key={opt.value}
              onClick={() => setTipoInstalacion(opt.value)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all duration-300",
                selected
                  ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 shadow-lg shadow-yellow-400/10"
                  : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
              )}
            >
              {selected && (
                <motion.div
                  layoutId="install-indicator"
                  className="absolute top-3 right-3 h-3 w-3 rounded-full bg-yellow-400"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  selected
                    ? "bg-yellow-400 text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                )}
              >
                {opt.value === "wifi" ? (
                  <Router size={20} />
                ) : (
                  <WifiOff size={20} />
                )}
              </div>

              <div>
                <p className="font-bold text-zinc-900 dark:text-white">
                  {opt.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {opt.desc}
                </p>
              </div>

              <p
                className={cn(
                  "text-lg font-bold",
                  selected
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-zinc-600 dark:text-zinc-400"
                )}
              >
                ${opt.price.toLocaleString("es-VE")}
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-500">
                  {" "}
                  único pago
                </span>
              </p>

              <ul className="space-y-1">
                {opt.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                  >
                    <span
                      className={cn(
                        "h-1 w-1 rounded-full",
                        selected
                          ? "bg-yellow-400 dark:bg-yellow-400"
                          : "bg-zinc-300 dark:bg-zinc-600"
                      )}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
