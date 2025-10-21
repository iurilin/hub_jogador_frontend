import { useState } from "react";
import { Calendar, Trophy, Target, Users, MapPin, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:5000";

type MatchFormProps = {
  onActivityAdded: () => void;
};

export const MatchForm = ({ onActivityAdded }: MatchFormProps) => {
  const [formData, setFormData] = useState({
    data_hora: new Date().toISOString(),
    minutos_jogados: '',
    intensidade: '',
    adversário: '',
    gols: '',
    assistências: '',
    dificuldade: '',
    resultado: '',
    campeonato: '',
    local: '',
    posicao: '',
    chutes: '',
    desarmes: '',
    faltas_cometidas: '',
    faltas_sofridas: '',
    cartao: 'nenhum',
    desempenho: '',
    chutes_defendidos: '',
    penaltis_defendidos: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login necessário para registrar o jogo.");
      return;
    }

    const dadosParaApi = {
      data_hora: formData.data_hora,
      tempo_jogado: Number(formData.minutos_jogados) || 0,
      intensidade: formData.intensidade,
      adversario: formData.adversário,
      gols: Number(formData.gols) || 0,
      assistencias: Number(formData.assistências) || 0,
      dificuldade: formData.dificuldade,
      resultado: formData.resultado,
      campeonato: formData.campeonato,
      local: formData.local,
      posicao: formData.posicao,
      chutes: Number(formData.chutes) || 0,
      desarmes: Number(formData.desarmes) || 0,
      faltas_cometidas: Number(formData.faltas_cometidas) || 0,
      faltas_sofridas: Number(formData.faltas_sofridas) || 0,
      cartao: formData.cartao,
      desempenho: Number(formData.desempenho) || 0,
      chutes_defendidos: Number(formData.chutes_defendidos) || 0,
      penaltis_defendidos: Number(formData.penaltis_defendidos) || 0,
    };

    console.log("Enviando para API:", JSON.stringify(dadosParaApi, null, 2));

    try {
      const response = await fetch(`${API_URL}/jogo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(dadosParaApi),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao salvar jogo.");
      }

      toast.success("Jogo registrado com sucesso!");

      setFormData({
        data_hora: new Date().toISOString(),
        minutos_jogados: '',
        intensidade: '',
        adversário: '',
        gols: '',
        assistências: '',
        dificuldade: '',
        resultado: '',
        campeonato: '',
        local: '',
        posicao: '',
        chutes: '',
        desarmes: '',
        faltas_cometidas: '',
        faltas_sofridas: '',
        cartao: 'nenhum',
        desempenho: '',
        chutes_defendidos: '',
        penaltis_defendidos: '',
      });

      onActivityAdded();

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Registrar Jogo
        </CardTitle>
        <CardDescription>Adicione as estatísticas da sua partida</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="data_hora" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Data e Hora
            </Label>
            <Input
              id="data_hora"
              type="datetime-local"
              value={formData.data_hora.slice(0, 16)}
              onChange={(e) => setFormData({ ...formData, data_hora: new Date(e.target.value).toISOString() })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adversário">Adversário</Label>
              <Input
                id="adversário"
                type="text"
                placeholder="Nome do time adversário"
                value={formData.adversário}
                onChange={(e) => setFormData({ ...formData, adversário: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultado">Resultado</Label>
              <Input
                id="resultado"
                type="text"
                placeholder="Ex: 3x1"
                value={formData.resultado}
                onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campeonato">Campeonato</Label>
              <Input
                id="campeonato"
                type="text"
                placeholder="Nome do campeonato"
                value={formData.campeonato}
                onChange={(e) => setFormData({ ...formData, campeonato: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="local" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Local
              </Label>
              <Input
                id="local"
                type="text"
                placeholder="Estádio/Campo"
                value={formData.local}
                onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minutos_jogados">Minutos Jogados</Label>
              <Input
                id="minutos_jogados"
                type="number"
                placeholder="90"
                value={formData.minutos_jogados}
                onChange={(e) => setFormData({ ...formData, minutos_jogados: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posicao">Posição</Label>
              <Input
                id="posicao"
                type="text"
                placeholder="Ex: Atacante"
                value={formData.posicao}
                onChange={(e) => setFormData({ ...formData, posicao: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intensidade">Intensidade</Label>
              <Select value={formData.intensidade} onValueChange={(value: any) => setFormData({ ...formData, intensidade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Intensidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificuldade">Dificuldade</Label>
              <Select value={formData.dificuldade} onValueChange={(value: any) => setFormData({ ...formData, dificuldade: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Dificuldade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fácil">Fácil</SelectItem>
                  <SelectItem value="médio">Médio</SelectItem>
                  <SelectItem value="difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cartao">Cartão</Label>
              <Select value={formData.cartao} onValueChange={(value: any) => setFormData({ ...formData, cartao: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Cartão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhum">Nenhum</SelectItem>
                  <SelectItem value="amarelo">Amarelo</SelectItem>
                  <SelectItem value="vermelho">Vermelho</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gols" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Gols
              </Label>
              <Input
                id="gols"
                type="number"
                placeholder="0"
                value={formData.gols}
                onChange={(e) => setFormData({ ...formData, gols: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistências" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Assistências
              </Label>
              <Input
                id="assistências"
                type="number"
                placeholder="0"
                value={formData.assistências}
                onChange={(e) => setFormData({ ...formData, assistências: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chutes">Chutes</Label>
              <Input
                id="chutes"
                type="number"
                placeholder="0"
                value={formData.chutes}
                onChange={(e) => setFormData({ ...formData, chutes: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desarmes">Desarmes</Label>
              <Input
                id="desarmes"
                type="number"
                placeholder="0"
                value={formData.desarmes}
                onChange={(e) => setFormData({ ...formData, desarmes: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="faltas_cometidas">Faltas Cometidas</Label>
              <Input
                id="faltas_cometidas"
                type="number"
                placeholder="0"
                value={formData.faltas_cometidas}
                onChange={(e) => setFormData({ ...formData, faltas_cometidas: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faltas_sofridas">Faltas Sofridas</Label>
              <Input
                id="faltas_sofridas"
                type="number"
                placeholder="0"
                value={formData.faltas_sofridas}
                onChange={(e) => setFormData({ ...formData, faltas_sofridas: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desempenho" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Desempenho (1-10)
            </Label>
            <Input
              id="desempenho"
              type="number"
              min="1"
              max="10"
              placeholder="8"
              value={formData.desempenho}
              onChange={(e) => setFormData({ ...formData, desempenho: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
              <Label htmlFor="chutes_defendidos">Chutes Defendidos</Label>
              <Input
                id="chutes_defendidoss"
                type="number"
                placeholder="0"
                value={formData.chutes_defendidos}
                onChange={(e) => setFormData({ ...formData, chutes_defendidos: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penaltis_defendidos">Penaltis Defendidos</Label>
              <Input
                id="penaltis_defendidoss"
                type="number"
                placeholder="0"
                value={formData.penaltis_defendidos}
                onChange={(e) => setFormData({ ...formData, penaltis_defendidos: e.target.value })}
              />
            </div>

          <Button type="submit" className="w-full bg-gradient-gold">
            Registrar Jogo
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};