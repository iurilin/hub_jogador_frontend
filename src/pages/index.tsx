import { Target, Trophy, Clock, TrendingUp, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 

import { StatsCard } from "../components/StatsCard";
import { TrainingForm } from "../components/TrainingForm";
import { MatchForm } from "../components/MatchForm";
import { ActivityHistory } from "../components/ActivityHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import type { Jogo, Treino } from "../../types";

const API_URL = "http://127.0.0.1:5000";

type Stats = {
  totalGols: number;
  totalAssistencias: number;
  totalMinutos: number;
  totalJogos: number;
};

const Index = () => {

  
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ totalGols: 0, totalAssistencias: 0, totalMinutos: 0, totalJogos: 0 });
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Acesso negado. Faça o login.");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);

      const [jogosRes, treinosRes] = await Promise.all([
        fetch(`${API_URL}/jogos`, {
          headers: { "x-access-token": token },
        }),
        fetch(`${API_URL}/treinos`, {
          headers: { "x-access-token": token },
        }),
      ]);

      if (!jogosRes.ok || !treinosRes.ok) {
        throw new Error("Falha ao buscar dados. Tente fazer login novamente.");
      }

      const jogosData: Jogo[] = await jogosRes.json();
      const treinosData: Treino[] = await treinosRes.json();

      setJogos(jogosData);
      setTreinos(treinosData);

      const newStats: Stats = {
        totalGols: jogosData.reduce((acc, jogo) => acc + (jogo.gols || 0), 0),
        totalAssistencias: jogosData.reduce((acc, jogo) => acc + (jogo.assistencias || 0), 0),
        totalMinutos: jogosData.reduce((acc, jogo) => acc + (jogo.tempo_jogado || 0), 0),
        totalJogos: jogosData.length,
      };
      setStats(newStats);

    } catch (error: any) {
      toast.error(error.message);
      localStorage.removeItem("token");
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Você foi desconectado.");
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-field text-primary-foreground py-6 shadow-glow">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">⚽ Football Performance Tracker</h1>
            <p className="text-primary-foreground/80 mt-1">Acompanhe sua evolução como jogador</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Gols"
            value={stats.totalGols}
            icon={Target}
          />
          <StatsCard
            title="Assistências"
            value={stats.totalAssistencias}
            icon={Trophy}
          />
          <StatsCard
            title="Minutos Jogados"
            value={stats.totalMinutos.toLocaleString('pt-BR')}
            icon={Clock}
            trend={`${stats.totalJogos} jogos`}
          />
          <StatsCard
            title="Gols por Jogo"
            value={stats.totalJogos > 0 ? (stats.totalGols / stats.totalJogos).toFixed(1) : 0}
            icon={TrendingUp}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="training" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="training">Registrar Treino</TabsTrigger>
                <TabsTrigger value="match">Registrar Jogo</TabsTrigger>
              </TabsList>
              <TabsContent value="training" className="mt-6">
                <TrainingForm onActivityAdded={fetchData} />
              </TabsContent>
              <TabsContent value="match" className="mt-6">
                <MatchForm onActivityAdded={fetchData} />
              </TabsContent>
            </Tabs>
          </div>
          <div className="lg:col-span-1">
            <ActivityHistory treinos={treinos} jogos={jogos} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;