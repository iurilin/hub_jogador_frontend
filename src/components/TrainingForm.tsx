import { useState } from "react";
import { Calendar, Clock, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:5000";

type TrainingFormProps = {
  onActivityAdded: () => void;
};

export const TrainingForm = ({ onActivityAdded }: TrainingFormProps) => {
  const [formData, setFormData] = useState({
    data_hora: new Date().toISOString(),
    duracao_minutos: '',
    tipo_treino: '',
    intensidade: '',
    local: '',
    descricao_objetivo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login necessário para registrar o treino.");
      return;
    }

    const dadosParaApi = {
      ...formData,
      duracao_minutos: Number(formData.duracao_minutos) || 0,
    };

    try {
      const response = await fetch(`${API_URL}/treino`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(dadosParaApi),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao salvar treino.");
      }

      toast.success("Treino registrado com sucesso!");

      setFormData({
        data_hora: new Date().toISOString(),
        duracao_minutos: '',
        tipo_treino: '',
        intensidade: '',
        local: '',
        descricao_objetivo: '',
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
          <Zap className="h-5 w-5 text-primary" />
          Registrar Treino
        </CardTitle>
        <CardDescription>Adicione os detalhes do seu treino de hoje</CardDescription>
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

          <div className="space-y-2">
            <Label htmlFor="duracao_minutos" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duração (minutos)
            </Label>
            <Input
              id="duracao_minutos"
              type="number"
              placeholder="90"
              value={formData.duracao_minutos}
              onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_treino">Tipo de Treino</Label>
            <Select value={formData.tipo_treino} onValueChange={(value: any) => setFormData({ ...formData, tipo_treino: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnico">Técnico</SelectItem>
                <SelectItem value="tatico">Tático</SelectItem>
                <SelectItem value="fisico">Físico</SelectItem>
                <SelectItem value="recreativo">Recreativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="intensidade">Intensidade</Label>
            <Select value={formData.intensidade} onValueChange={(value: any) => setFormData({ ...formData, intensidade: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a intensidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="maxima">Máxima</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              type="text"
              placeholder="Ex: Campo A, Ginásio"
              value={formData.local}
              onChange={(e) => setFormData({ ...formData, local: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao_objetivo">Descrição/Objetivo</Label>
            <Input
              id="descricao_objetivo"
              type="text"
              placeholder="Descreva o objetivo do treino"
              value={formData.descricao_objetivo}
              onChange={(e) => setFormData({ ...formData, descricao_objetivo: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-gradient-field">
            Registrar Treino
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};