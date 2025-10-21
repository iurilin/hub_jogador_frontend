import { Target, Trophy, Clock, TrendingUp, Mail, MapPin, Calendar, ArrowLeft, Edit, Plus, Trash2, User as UserIcon, Activity, ShieldCheck, Hand } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { StatsCard } from "../components/StatsCard";
import { ActivityHistory } from "../components/ActivityHistory";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { TrainingForm } from "../components/TrainingForm";
import { MatchForm } from "../components/MatchForm";
import { toast } from "sonner";
import type { Jogo, Treino } from "../../types";

const API_URL = "http://127.0.0.1:5000";

type UserProfile = {
  _id?: string;
  nome: string;
  email: string;
  posicao: string;
  foto?: string;
};

type Stats = {
  totalGols: number;
  totalAssistencias: number;
  totalMinutos: number;
  totalJogos: number;
  totalDefesas?: number;
  totalDefesasDificeis?: number;
  totalPenaltisDefendidos?: number;
  totalJogosSemSofrerGol?: number;
};

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<Jogo[]>([]);
  const [trainings, setTrainings] = useState<Treino[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalGols: 0, totalAssistencias: 0, totalMinutos: 0, totalJogos: 0,
    totalDefesas: 0, totalDefesasDificeis: 0, totalPenaltisDefendidos: 0, totalJogosSemSofrerGol: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const [editData, setEditData] = useState<UserProfile>({ nome: "", email: "", posicao: ""});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Acesso negado.");
      navigate("/auth");
      return;
    }

    try {
      setIsLoading(true);
      const [profileRes, gamesRes, trainingsRes] = await Promise.all([
        fetch(`${API_URL}/usuario/perfil`, { headers: { "x-access-token": token } }),
        fetch(`${API_URL}/jogos`, { headers: { "x-access-token": token } }),
        fetch(`${API_URL}/treinos`, { headers: { "x-access-token": token } }),
      ]);

      if (profileRes.status === 401 || gamesRes.status === 401 || trainingsRes.status === 401) {
          localStorage.removeItem("token");
          toast.error("Sessão inválida. Faça login novamente.");
          navigate("/auth");
          return;
      }
      if (!profileRes.ok || !gamesRes.ok || !trainingsRes.ok) {
        throw new Error("Falha ao buscar dados do servidor.");
      }

      const profileData: UserProfile = await profileRes.json();
      const gamesData: Jogo[] = await gamesRes.json();
      const trainingsData: Treino[] = await trainingsRes.json();

      setUser(profileData);
      setGames(gamesData);
      setTrainings(trainingsData);
      setEditData(profileData);

      const calculatedStats: Stats = {
        totalGols: gamesData.reduce((acc, jogo) => acc + (Number(jogo.gols) || 0), 0),
        totalAssistencias: gamesData.reduce((acc, jogo) => acc + (Number(jogo.assistencias) || 0), 0),
        totalMinutos: gamesData.reduce((acc, jogo) => acc + (Number(jogo.tempo_jogado) || 0), 0),
        totalJogos: gamesData.length,
        totalDefesas: gamesData.reduce((acc, jogo) => acc + (Number(jogo.defesas) || 0), 0),
        totalDefesasDificeis: gamesData.reduce((acc, jogo) => acc + (Number(jogo.defesas_dificeis) || 0), 0),
        totalPenaltisDefendidos: gamesData.reduce((acc, jogo) => acc + (Number(jogo.penaltis_defendidos) || 0), 0),
        totalJogosSemSofrerGol: gamesData.filter(jogo => Number(jogo.gols_sofridos) === 0).length,
      };
      setStats(calculatedStats);

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

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Login necessário.");

    const dataToSend = {
        nome: editData.nome,
        email: editData.email,
        posicao: editData.posicao,
    };

    let updatedProfileData = null;

    try {
        const response = await fetch(`${API_URL}/usuario/perfil`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-access-token': token },
            body: JSON.stringify(dataToSend),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.erro || "Falha ao atualizar dados.");
        }
        updatedProfileData = await response.json();
        toast.success("Dados atualizados!");

    } catch (error: any) {
        toast.error(`Erro ao salvar dados: ${error.message}`);
        setIsEditDialogOpen(false);
        return;
    }

    if (photoFile) {
      const formData = new FormData();
      formData.append('photo', photoFile);

      try {
        const photoResponse = await fetch(`${API_URL}/usuario/perfil/foto`, {
          method: 'POST',
          headers: { 'x-access-token': token },
          body: formData,
        });

        if (!photoResponse.ok) {
           const errorData = await photoResponse.json();
           throw new Error(errorData.erro || "Falha ao enviar foto.");
        }
        updatedProfileData = await photoResponse.json();
        toast.success("Foto atualizada!");
        setPhotoFile(null);

      } catch (error: any) {
        toast.error(`Erro ao enviar foto: ${error.message}`);
      }
    }

    if (updatedProfileData) {
        setUser(updatedProfileData);
        setEditData(updatedProfileData);
    }
    setIsEditDialogOpen(false);
  };


  const deleteGame = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token || !confirm("Tem certeza que deseja excluir este jogo?")) return;
    try {
      const response = await fetch(`${API_URL}/jogo/${id}`, {
        method: 'DELETE',
        headers: { 'x-access-token': token }
      });
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.erro || "Falha ao excluir jogo.");
      }
      setGames(prevGames => prevGames.filter(game => game._id !== id));
      toast.success("Jogo removido!");
      fetchData();
    } catch (error: any) { toast.error(error.message); }
  };

   const deleteTraining = async (id: string) => {
     const token = localStorage.getItem("token");
     if (!token || !confirm("Tem certeza que deseja excluir este treino?")) return;
     try {
       const response = await fetch(`${API_URL}/treino/${id}`, {
         method: 'DELETE',
         headers: { 'x-access-token': token }
       });
       if (!response.ok) {
           const errorData = await response.json();
           throw new Error(errorData.erro || "Falha ao excluir treino.");
       }
       setTrainings(prevTrainings => prevTrainings.filter(training => training._id !== id));
       toast.success("Treino removido!");
       fetchData();
     } catch (error: any) { toast.error(error.message); }
  };

   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { setPhotoFile(e.target.files[0]); }
  };

  if (isLoading) { return <div className="min-h-screen flex items-center justify-center"><p>Carregando perfil...</p></div>; }
  if (!user) { return <div className="min-h-screen flex items-center justify-center"><p>Não foi possível carregar o perfil.</p></div>; }

  const renderStatsCards = () => {
    if (user.posicao === 'Goleiro') {
      return (
        <>
          <StatsCard title="Defesas" value={stats.totalDefesas ?? 0} icon={Hand} />
          <StatsCard title="Defesas Difíceis" value={stats.totalDefesasDificeis ?? 0} icon={ShieldCheck} />
          <StatsCard title="Pênaltis Defendidos" value={stats.totalPenaltisDefendidos ?? 0} icon={Hand} />
          <StatsCard title="Jogos Sem Sofrer Gol" value={stats.totalJogosSemSofrerGol ?? 0} icon={Clock} trend={`${stats.totalJogos} jogos`}/>
        </>
      );
    } else {
      return (
        <>
          <StatsCard title="Total de Gols" value={stats.totalGols} icon={Target} />
          <StatsCard title="Assistências" value={stats.totalAssistencias} icon={Trophy} />
          <StatsCard title="Minutos Jogados" value={stats.totalMinutos.toLocaleString('pt-BR')} icon={Clock} trend={`${stats.totalJogos} jogos`}/>
          <StatsCard title="Gols por Jogo" value={stats.totalJogos > 0 ? (stats.totalGols / stats.totalJogos).toFixed(1) : "0.0"} icon={TrendingUp} />
        </>
      );
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-field text-primary-foreground py-6 shadow-glow">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
            <Avatar className="w-32 h-32 border-4 border-primary-foreground/20">
              <AvatarImage src={user.foto ? `${API_URL}${user.foto}` : undefined} alt={user.nome} key={user.foto}/>
              <AvatarFallback className="text-4xl">{user.nome?.charAt(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user.nome}</h1>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {user.posicao && ( <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-primary-foreground border-white/20"><MapPin className="w-3 h-3 mr-1"/> {user.posicao}</Badge> )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setEditData(user)}>
                  <Edit className="w-4 h-4 mr-2" /> Editar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                 <DialogHeader><DialogTitle>Editar Perfil</DialogTitle></DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="space-y-2"> <Label htmlFor="photo">Foto</Label> <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} /> </div>
                    <div className="space-y-2"> <Label htmlFor="name">Nome</Label> <Input id="name" value={editData.nome || ''} onChange={(e) => setEditData({ ...editData, nome: e.target.value })}/> </div>
                    <div className="space-y-2"> <Label htmlFor="email">Email</Label> <Input id="email" type="email" value={editData.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })}/> </div>
                    <div className="space-y-2">
                       <Label htmlFor="position">Posição</Label>
                       <Select value={editData.posicao || ''} onValueChange={(value) => setEditData({ ...editData, posicao: value })}>
                           <SelectTrigger id="position"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                           <SelectContent>
                               <SelectItem value="Goleiro">Goleiro</SelectItem>
                               <SelectItem value="Zagueiro">Zagueiro</SelectItem>
                               <SelectItem value="Lateral">Lateral</SelectItem>
                               <SelectItem value="Volante">Volante</SelectItem>
                               <SelectItem value="Meia">Meia</SelectItem>
                               <SelectItem value="Atacante">Atacante</SelectItem>
                           </SelectContent>
                       </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">Salvar Alterações</Button>
                 </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="flex items-start gap-3">
                 <Mail className="w-5 h-5 text-primary mt-1" />
                 <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{user.email}</p></div>
               </div>
               {user.posicao && (
                 <div className="flex items-start gap-3">
                   <UserIcon className="w-5 h-5 text-primary mt-1" />
                   <div><p className="text-sm text-muted-foreground">Posição</p><p className="font-medium">{user.posicao}</p></div>
                 </div>
               )}
             </div>
          </CardContent>
        </Card>

        <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Estatísticas Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderStatsCards()}
            </div>
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-card"> <CardHeader><CardTitle>Desempenho Mensal</CardTitle></CardHeader> <CardContent> </CardContent> </Card>
            <Card className="shadow-card"> <CardHeader><CardTitle>Recordes Pessoais</CardTitle></CardHeader> <CardContent> </CardContent> </Card>
         </div>

        <div className="mb-8">
           <div className="flex items-center justify-between mb-4"> <h2 className="text-2xl font-bold">Meus Jogos</h2> <Dialog> <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2"/> Adicionar Jogo</Button></DialogTrigger> <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"> <DialogHeader><DialogTitle>Registrar Jogo</DialogTitle></DialogHeader> <MatchForm onActivityAdded={fetchData} /> </DialogContent> </Dialog> </div>
           <Card className="shadow-card">
              <CardContent className="p-6">
                {games.length === 0 ? (<p className="text-muted-foreground text-center py-8">Nenhum jogo registrado ainda.</p>):(
                  <div className="space-y-3">
                    {games.map(game => (
                       <div key={game._id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex-1 mr-4"> <p className="font-semibold">{game.adversario}</p> <p className="text-sm text-muted-foreground"> {new Date(game.data_hora).toLocaleDateString('pt-BR')} • Placar: {game.resultado || 'N/A'} • Gols: {game.gols ?? 0} </p> </div>
                          <Button variant="ghost" size="sm" onClick={() => deleteGame(game._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                       </div>
                    ))}
                  </div>
                )}
              </CardContent>
           </Card>
        </div>

        <div className="mb-8">
           <div className="flex items-center justify-between mb-4"> <h2 className="text-2xl font-bold">Meus Treinos</h2> <Dialog> <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2"/> Adicionar Treino</Button></DialogTrigger> <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"> <DialogHeader><DialogTitle>Registrar Treino</DialogTitle></DialogHeader> <TrainingForm onActivityAdded={fetchData} /> </DialogContent> </Dialog> </div>
           <Card className="shadow-card">
             <CardContent className="p-6">
               {trainings.length === 0 ? (<p className="text-muted-foreground text-center py-8">Nenhum treino registrado ainda.</p>) : (
                 <div className="space-y-3">
                   {trainings.map(training => (
                      <div key={training._id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                         <div className="flex-1 mr-4"> <p className="font-semibold">{training.tipo_treino || 'Treino'}</p> <p className="text-sm text-muted-foreground"> {new Date(training.data_hora).toLocaleDateString('pt-BR')} • Duração: {training.duracao_minutos || 'N/A'} min • Intensidade: {training.intensidade || 'N/A'} </p> </div>
                         <Button variant="ghost" size="sm" onClick={() => deleteTraining(training._id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                   ))}
                 </div>
               )}
             </CardContent>
           </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Histórico Completo</h2>
          <ActivityHistory treinos={trainings} jogos={games} />
        </div>

      </main>
    </div>
  );
};

export default Profile;