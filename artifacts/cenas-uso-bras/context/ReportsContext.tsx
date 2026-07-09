import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface DiariaData {
  rua: string;
  data: string;
  horario: string;
  emUso: string;
  naoEmUso: string;
  totalAbordagens: string;
}

export interface SemanalData {
  rua: string;
  data: string;
  horario: string;
  totalBarracas: string;
  emUso: string;
  naoEmUso: string;
  naoPropRuaEmUso: string;
  totalAbordagens: string;
  total: string;
  periodo: string;
  gestante: string;
  criancas: string;
  adolescentes: string;
  idoso: string;
  pcd: string;
  substancias: string;
  encaminhamentos: string;
  intercorrencias: string;
  observacoes: string;
}

export interface Report {
  id: string;
  type: "diaria" | "semanal";
  data: DiariaData | SemanalData;
  createdAt: string;
}

interface ReportsContextValue {
  reports: Report[];
  addReport: (report: Report) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  loading: boolean;
}

const STORAGE_KEY = "@cenas_uso_bras_reports";

const ReportsContext = createContext<ReportsContextValue | null>(null);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as Report[];
          setReports(parsed);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(async (updated: Report[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addReport = useCallback(
    async (report: Report) => {
      const updated = [report, ...reports];
      setReports(updated);
      await persist(updated);
    },
    [reports, persist]
  );

  const deleteReport = useCallback(
    async (id: string) => {
      const updated = reports.filter((r) => r.id !== id);
      setReports(updated);
      await persist(updated);
    },
    [reports, persist]
  );

  return (
    <ReportsContext.Provider value={{ reports, addReport, deleteReport, loading }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used inside ReportsProvider");
  return ctx;
}

export function formatDiaria(data: DiariaData): string {
  return [
    "Cena de uso diária",
    "",
    `✅ Rua: ${data.rua || "-"}`,
    `✅ Data: ${data.data || "-"}`,
    `✅ Horário: ${data.horario || "-"}`,
    `✅ N° de Usuários em situação de rua que ESTÃO EM USO: ${data.emUso || "0"}`,
    `✅ N° de Usuários em situação de rua QUE NÃO ESTÃO EM USO: ${data.naoEmUso || "0"}`,
    `✅ N° Total de abordagens: ${data.totalAbordagens || "0"}`,
  ].join("\n");
}

export function formatSemanal(data: SemanalData): string {
  return [
    "Cena de uso semanal",
    "",
    `✅ Rua: ${data.rua || "-"}`,
    `✅ Data: ${data.data || "-"}`,
    `✅ Horário: ${data.horario || "-"}`,
    `✅ Total de Barracas: ${data.totalBarracas || "0"}`,
    `✅ N° de Usuários em situação de rua que ESTÃO EM USO: ${data.emUso || "0"}`,
    `✅ N° de Usuários em situação de rua QUE NÃO ESTÃO EM USO: ${data.naoEmUso || "0"}`,
    `✅ N° de Usuários que NÃO SÃO POP RUA E ESTÃO EM USO: ${data.naoPropRuaEmUso || "0"}`,
    `✅ N° Total de abordagens: ${data.totalAbordagens || "0"}`,
    `✅ N° Total: ${data.total || "0"}`,
    `✅ Período (M/T): ${data.periodo || "-"}`,
    `✅ Gestante: ${data.gestante || "0"}`,
    `✅ Crianças: ${data.criancas || "0"}`,
    `✅ Adolescentes: ${data.adolescentes || "0"}`,
    `✅ Idoso: ${data.idoso || "0"}`,
    `✅ PCD: ${data.pcd || "0"}`,
    `✅ Tipo de Substâncias: ${data.substancias || "álcool"}`,
    `✅ Encaminhamentos para CAPS, programa Reencontro, vaga de acolhimento: ${data.encaminhamentos || "-"}`,
    `✅ Intercorrências: ${data.intercorrencias || "-"}`,
    `✅ Observações: ${data.observacoes || "-"}`,
  ].join("\n");
}
