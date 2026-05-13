"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Plan,
  CoverageResult,
  ContactFormData,
  ContactStepData,
  PersonaNaturalData,
  EmpresaData,
  CatastroData,
  TipoUsuario,
  TipoInstalacion,
  TipoFinanciamiento,
} from "@/lib/mock/data";

interface PlanContextValue {
  tipoUsuario: TipoUsuario | null;
  selectedPlan: Plan | null;
  coverageData: CoverageResult | null;
  contactData: ContactFormData | null;
  contactStepData: ContactStepData | null;
  personaData: PersonaNaturalData | null;
  empresaData: EmpresaData | null;
  catastroData: CatastroData | null;
  tipoInstalacion: TipoInstalacion;
  tipoFinanciamiento: TipoFinanciamiento;
  setTipoUsuario: (t: TipoUsuario) => void;
  setSelectedPlan: (p: Plan) => void;
  setCoverageData: (c: CoverageResult | null) => void;
  setContactData: (d: ContactFormData | null) => void;
  setContactStepData: (d: ContactStepData | null) => void;
  setPersonaData: (d: PersonaNaturalData | null) => void;
  setEmpresaData: (d: EmpresaData | null) => void;
  setCatastroData: (d: CatastroData | null) => void;
  setTipoInstalacion: (t: TipoInstalacion) => void;
  setTipoFinanciamiento: (t: TipoFinanciamiento) => void;
  resetFlow: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

const STORAGE_KEY = "netportal-flow";

interface PersistedState {
  tipoUsuario: TipoUsuario | null;
  selectedPlan: Plan | null;
  coverageData: CoverageResult | null;
  contactData: ContactFormData | null;
  contactStepData: ContactStepData | null;
  personaData: PersonaNaturalData | null;
  empresaData: EmpresaData | null;
  catastroData: CatastroData | null;
  tipoInstalacion: TipoInstalacion;
  tipoFinanciamiento: TipoFinanciamiento;
}

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return {
      tipoUsuario: null,
      selectedPlan: null,
      coverageData: null,
      contactData: null,
      contactStepData: null,
      personaData: null,
      empresaData: null,
      catastroData: null,
      tipoInstalacion: "wifi",
      tipoFinanciamiento: "contado",
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    //
  }
  return {
    tipoUsuario: null,
    selectedPlan: null,
    coverageData: null,
    contactData: null,
    contactStepData: null,
    personaData: null,
    empresaData: null,
    catastroData: null,
    tipoInstalacion: "wifi",
    tipoFinanciamiento: "contado",
  };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => loadState());
  const [tipoUsuario, setTipoUsuarioState] = useState<TipoUsuario | null>(initial.tipoUsuario);
  const [selectedPlan, setSelectedPlanState] = useState<Plan | null>(initial.selectedPlan);
  const [coverageData, setCoverageDataState] = useState<CoverageResult | null>(initial.coverageData);
  const [contactData, setContactDataState] = useState<ContactFormData | null>(initial.contactData);
  const [contactStepData, setContactStepDataState] = useState<ContactStepData | null>(initial.contactStepData);
  const [personaData, setPersonaDataState] = useState<PersonaNaturalData | null>(initial.personaData);
  const [empresaData, setEmpresaDataState] = useState<EmpresaData | null>(initial.empresaData);
  const [catastroData, setCatastroDataState] = useState<CatastroData | null>(initial.catastroData);
  const [tipoInstalacion, setTipoInstalacionState] = useState<TipoInstalacion>(initial.tipoInstalacion);
  const [tipoFinanciamiento, setTipoFinanciamientoState] = useState<TipoFinanciamiento>(initial.tipoFinanciamiento);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const persist = useCallback(
    (overrides: Partial<PersistedState>) => {
      if (!mountedRef.current) return;
      const current = {
        tipoUsuario,
        selectedPlan,
        coverageData,
        contactData,
        contactStepData,
        personaData,
        empresaData,
        catastroData,
        tipoInstalacion,
        tipoFinanciamiento,
        ...overrides,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        //
      }
    },
    [tipoUsuario, selectedPlan, coverageData, contactData, contactStepData, personaData, empresaData, catastroData, tipoInstalacion, tipoFinanciamiento]
  );

  const setTipoUsuario = useCallback(
    (t: TipoUsuario) => {
      setTipoUsuarioState(t);
      persist({ tipoUsuario: t });
    },
    [persist]
  );

  const setSelectedPlan = useCallback(
    (p: Plan) => {
      setSelectedPlanState(p);
      persist({ selectedPlan: p });
    },
    [persist]
  );

  const setCoverageData = useCallback(
    (c: CoverageResult | null) => {
      setCoverageDataState(c);
      persist({ coverageData: c });
    },
    [persist]
  );

  const setContactData = useCallback(
    (d: ContactFormData | null) => {
      setContactDataState(d);
      persist({ contactData: d });
    },
    [persist]
  );

  const setContactStepData = useCallback(
    (d: ContactStepData | null) => {
      setContactStepDataState(d);
      persist({ contactStepData: d });
    },
    [persist]
  );

  const setPersonaData = useCallback(
    (d: PersonaNaturalData | null) => {
      setPersonaDataState(d);
      persist({ personaData: d });
    },
    [persist]
  );

  const setEmpresaData = useCallback(
    (d: EmpresaData | null) => {
      setEmpresaDataState(d);
      persist({ empresaData: d });
    },
    [persist]
  );

  const setCatastroData = useCallback(
    (d: CatastroData | null) => {
      setCatastroDataState(d);
      persist({ catastroData: d });
    },
    [persist]
  );

  const setTipoInstalacion = useCallback(
    (t: TipoInstalacion) => {
      setTipoInstalacionState(t);
      persist({ tipoInstalacion: t });
    },
    [persist]
  );

  const setTipoFinanciamiento = useCallback(
    (t: TipoFinanciamiento) => {
      setTipoFinanciamientoState(t);
      persist({ tipoFinanciamiento: t });
    },
    [persist]
  );

  const resetFlow = useCallback(() => {
    setTipoUsuarioState(null);
    setSelectedPlanState(null);
    setCoverageDataState(null);
    setContactDataState(null);
    setContactStepDataState(null);
    setPersonaDataState(null);
    setEmpresaDataState(null);
    setCatastroDataState(null);
    setTipoInstalacionState("wifi");
    setTipoFinanciamientoState("contado");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      //
    }
  }, []);

  return (
    <PlanContext.Provider
      value={{
        tipoUsuario,
        selectedPlan,
        coverageData,
        contactData,
        contactStepData,
        personaData,
        empresaData,
        catastroData,
        tipoInstalacion,
        tipoFinanciamiento,
        setTipoUsuario,
        setSelectedPlan,
        setCoverageData,
        setContactData,
        setContactStepData,
        setPersonaData,
        setEmpresaData,
        setCatastroData,
        setTipoInstalacion,
        setTipoFinanciamiento,
        resetFlow,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan debe usarse dentro de PlanProvider");
  return ctx;
}
