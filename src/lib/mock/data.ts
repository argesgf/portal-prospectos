export type TipoUsuario = "persona" | "empresa";

export interface Plan {
  id: string;
  name: string;
  speed: string;
  speedMbps: number;
  price: number;
  priceLabel: string;
  popular?: boolean;
  features: string[];
  tipoUsuario: TipoUsuario;
}

export interface CoverageResult {
  available: boolean;
  address: string;
  lat: number;
  lng: number;
  tecnologias: string[];
  velocidadMaxima: string;
  codigoZona: string;
}

export interface ContactFormData {
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  direccion: string;
  nombreEmpresa?: string;
  rif?: string;
}

export type TipoInstalacion = "wifi" | "no-wifi";
export type TipoFinanciamiento = "contado" | "financiamiento";

export interface ContactStepData {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
}

export interface PersonaNaturalData {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  cedula: string;
  rif: string;
  sexo: string;
  fechaNacimiento: string;
  nivelEstudio: string;
  cedulaImage: string | null;
  rifImage: string | null;
  firma: string | null;
}

export interface EmpresaData {
  representanteNombre: string;
  representanteApellido: string;
  representanteTelefono: string;
  representanteCorreo: string;
  representanteCedula: string;
  representanteRif: string;
  representanteFirma: string | null;
  rif: string;
  nombre: string;
  emailCorporativo: string;
  telefono: string;
  tipoNegocio: string;
  rifImage: string | null;
}

export interface CatastroData {
  tipoVivienda: "horizontal" | "vertical" | null;
  tipoPropiedad: "casa" | "apartamento" | null;
  edificio: string;
  nroApto: string;
  piso: string;
  nroCasa: string;
  tipoAmbito: string;
  ambito: string;
  direccion: string;
}

export const TIPOS_AMBITO = [
  "Avenida Principal",
  "Avenida",
  "Calle",
  "Carrera",
  "Barrio",
  "Sector",
  "Urbanización",
  "Residencias",
  "Conjunto Residencial",
  "Pasaje",
  "Verieda",
];

export const ambitosPorTipo: Record<string, string[]> = {
  "Avenida Principal": ["Jabillar", "Macaro", "Los Naranjos", "El Recurso", "Samán de Güere"],
  "Avenida": ["Miranda", "Bermúdez", "Intercomunal Turmero-Maracay", "Principal de San Joaquín"],
  "Calle": ["Bolívar", "Sucre", "Páez", "Mariño", "Urdaneta", "Ribas", "5 de Julio", "Negro Primero", "Real de Turmero"],
  Barrio: ["Las Mercedes", "El Cambur", "La Candelaria", "El Limón"],
  Sector: ["El Recurso", "Samán de Güere", "El Cambur", "La Candelaria", "El Limón"],
  Urbanización: ["La Trinidad", "San Joaquín", "El Centro", "Villas del Parque", "Los Naranjos"],
  Residencias: ["Turmero Center", "Parque Residencial", "Don Bosco"],
  "Conjunto Residencial": ["Los Jardines", "Las Acacias", "San Miguel"],
  Pasaje: ["1", "2", "3", "4", "5", "6", "7", "8"],
  Verieda: ["La Mora", "El Rincón", "Los Mangos"],
};

export const EDIFICIOS_POR_AMBITO: Record<string, string[]> = {
  "Villas del Parque": ["Edif. Alameda", "Edif. Los Geranios", "Edif. Los Girasoles", "Edif. Las Orquídeas"],
  "Los Naranjos": ["Edif. A", "Edif. B", "Edif. C", "Edif. D"],
  "Turmero Center": ["Torre A", "Torre B", "Torre C"],
  "Parque Residencial": ["Edif. 1", "Edif. 2", "Edif. 3"],
};

export const planesPersonas: Plan[] = [
  {
    id: "basico-persona",
    name: "Básico",
    speed: "100 Mbps",
    speedMbps: 100,
    price: 599,
    priceLabel: "$599/mes",
    features: ["Fibra óptica 100 Mbps", "WiFi 6 incluido", "Soporte 8-18hs", "Instalación gratis"],
    tipoUsuario: "persona",
  },
  {
    id: "estandar-persona",
    name: "Estándar",
    speed: "300 Mbps",
    speedMbps: 300,
    price: 899,
    priceLabel: "$899/mes",
    popular: true,
    features: ["Fibra óptica 300 Mbps", "WiFi 6 mesh", "Soporte 24/7", "Instalación gratis", "Router incluido"],
    tipoUsuario: "persona",
  },
  {
    id: "premium-persona",
    name: "Premium",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 1499,
    priceLabel: "$1,499/mes",
    features: ["Fibra óptica 1 Gbps", "WiFi 6 Pro mesh", "Soporte 24/7 prioritario", "Instalación gratis", "Router + repetidor", "TV digital incluida"],
    tipoUsuario: "persona",
  },
];

export const planesEmpresas: Plan[] = [
  {
    id: "startup-empresa",
    name: "Startup",
    speed: "500 Mbps",
    speedMbps: 500,
    price: 2499,
    priceLabel: "$2,499/mes",
    features: ["Fibra simétrica 500 Mbps", "IP fija incluida", "SLA 99.5%", "Soporte 24/7", "Hasta 10 dispositivos"],
    tipoUsuario: "empresa",
  },
  {
    id: "business-empresa",
    name: "Business",
    speed: "1 Gbps",
    speedMbps: 1000,
    price: 4999,
    priceLabel: "$4,999/mes",
    popular: true,
    features: ["Fibra simétrica 1 Gbps", "5 IPs fijas", "SLA 99.9%", "Soporte 24/7 dedicado", "Hasta 30 dispositivos", "Backup 4G incluido"],
    tipoUsuario: "empresa",
  },
  {
    id: "enterprise-empresa",
    name: "Enterprise",
    speed: "10 Gbps",
    speedMbps: 10000,
    price: 0,
    priceLabel: "A medida",
    features: ["Fibra dedicada 10 Gbps", "IPs fijas ilimitadas", "SLA 99.99%", "Soporte con ingeniero asignado", "Red SD-WAN", "Backup redundante", "SLA con penalidades"],
    tipoUsuario: "empresa",
  },
];

export const COSTO_INSTALACION_WIFI = 800;
export const COSTO_INSTALACION_NO_WIFI = 400;
export const RECARGO_FINANCIAMIENTO = 0.15;

export interface DireccionGeocoded {
  address: string;
  lat: number;
  lng: number;
}

export const direccionesTurmero: DireccionGeocoded[] = [
  { address: "Calle Bolívar, Turmero, Aragua", lat: 10.2755, lng: -67.4718 },
  { address: "Avenida Miranda, Turmero, Aragua", lat: 10.2782, lng: -67.4741 },
  { address: "Calle Sucre, Turmero, Aragua", lat: 10.2738, lng: -67.4692 },
  { address: "Urbanización La Trinidad, Turmero, Aragua", lat: 10.2712, lng: -67.4681 },
  { address: "Sector El Recurso, Turmero, Aragua", lat: 10.2801, lng: -67.4755 },
  { address: "Calle Páez, Turmero, Aragua", lat: 10.2773, lng: -67.4702 },
  { address: "Avenida Bermúdez, Turmero, Aragua", lat: 10.2741, lng: -67.4733 },
  { address: "Urbanización San Joaquín, Turmero, Aragua", lat: 10.2698, lng: -67.4665 },
  { address: "Calle Mariño, Turmero, Aragua", lat: 10.2762, lng: -67.4729 },
  { address: "Sector Samán de Güere, Turmero, Aragua", lat: 10.2728, lng: -67.4771 },
  { address: "Urbanización El Centro, Turmero, Aragua", lat: 10.2749, lng: -67.4711 },
  { address: "Calle Urdaneta, Turmero, Aragua", lat: 10.2788, lng: -67.4698 },
  { address: "Barrio Las Mercedes, Turmero, Aragua", lat: 10.2823, lng: -67.4785 },
  { address: "Sector El Cambur, Turmero, Aragua", lat: 10.2675, lng: -67.4638 },
  { address: "Calle Real de Turmero, Turmero, Aragua", lat: 10.2759, lng: -67.4708 },
  { address: "Avenida Intercomunal Turmero-Maracay, Turmero, Aragua", lat: 10.2704, lng: -67.4798 },
  { address: "Urbanización Villas del Parque, Turmero, Aragua", lat: 10.2732, lng: -67.4659 },
  { address: "Calle 5 de Julio, Turmero, Aragua", lat: 10.2768, lng: -67.4721 },
  { address: "Sector La Candelaria, Turmero, Aragua", lat: 10.2815, lng: -67.4768 },
  { address: "Calle Ribas, Turmero, Aragua", lat: 10.2745, lng: -67.4689 },
  { address: "Urbanización Los Naranjos, Turmero, Aragua", lat: 10.2779, lng: -67.4672 },
  { address: "Avenida Principal de San Joaquín, Turmero, Aragua", lat: 10.2689, lng: -67.4641 },
  { address: "Calle Negro Primero, Turmero, Aragua", lat: 10.2794, lng: -67.4736 },
  { address: "Sector El Limón, Turmero, Aragua", lat: 10.2835, lng: -67.4812 },
];

export const TURMERO_CENTER = { lat: 10.2755, lng: -67.4718 };

export const direccionesSinCobertura = [
  "Sector El Cambur, Turmero, Aragua",
  "Barrio Las Mercedes, Turmero, Aragua",
  "Sector La Candelaria, Turmero, Aragua",
  "Sector El Limón, Turmero, Aragua",
];

export function verificarCobertura(lat: number, lng: number, address: string): CoverageResult {
  const sinCobertura = direccionesSinCobertura.some((d) =>
    address.toLowerCase().includes(d.toLowerCase())
  );

  if (sinCobertura) {
    return {
      available: false,
      address,
      lat,
      lng,
      tecnologias: [],
      velocidadMaxima: "No disponible",
      codigoZona: "",
    };
  }

  const zonas = ["ZN-TUR-01", "ZN-TUR-02", "ZN-TUR-03", "ZN-TUR-04"];
  return {
    available: true,
    address,
    lat,
    lng,
    tecnologias: ["FTTH", "GPON"],
    velocidadMaxima: "1 Gbps",
    codigoZona: zonas[Math.floor(Math.random() * zonas.length)],
  };
}

export function buscarDireccionMasCercana(lat: number, lng: number): string {
  let minDist = Infinity;
  let nearest = direccionesTurmero[0].address;

  for (const d of direccionesTurmero) {
    const dist = Math.pow(d.lat - lat, 2) + Math.pow(d.lng - lng, 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = d.address;
    }
  }

  return nearest;
}

export function obtenerCoordsPorDireccion(address: string): { lat: number; lng: number } | null {
  const found = direccionesTurmero.find((d) => d.address === address);
  return found ? { lat: found.lat, lng: found.lng } : null;
}

export function getSuggestions(query: string): string[] {
  if (query.length <= 1) return [];
  return direccionesTurmero
    .filter((d) => d.address.toLowerCase().includes(query.toLowerCase()))
    .map((d) => d.address);
}
