import { Activity, Trophy, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { useMemo } from "react";
import type { Jogo, Treino } from "../../types";

type ActivityHistoryProps = {
  treinos: Treino[];
  jogos: Jogo[];
};

interface ActivityItem {
  id: string;
  type: 'training' | 'match';
  date: string;
  description: string;
}

export const ActivityHistory = ({ treinos, jogos }: ActivityHistoryProps) => {

  const sortedActivities = useMemo(() => {
    const formattedTreinos: ActivityItem[] = treinos.map(treino => ({
      id: treino._id,
      type: 'training',
      date: treino.data_hora,
      description: `${treino.tipo_treino || 'Treino'} - ${treino.descricao_objetivo || (treino.duracao_minutos + ' min')}`
    }));

    const formattedJogos: ActivityItem[] = jogos.map(jogo => ({
      id: jogo._id,
      type: 'match',
      date: jogo.data_hora,
      description: `vs ${jogo.adversario || 'Desconhecido'} | Gols: ${jogo.gols || 0}, Assist.: ${jogo.assistencias || 0}`
    }));

    const allActivities = [...formattedTreinos, ...formattedJogos];

    allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return allActivities;
  }, [treinos, jogos]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Atividades Recentes
        </CardTitle>
        <CardDescription>Seu histórico de treinos e jogos</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedActivities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma atividade registrada ainda.
              </p>
            ) : (
              sortedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className={`p-2 rounded-full ${activity.type === 'match' ? 'bg-accent/20' : 'bg-primary/20'}`}>
                    {activity.type === 'match' ? (
                      <Trophy className="h-4 w-4 text-accent" />
                    ) : (
                      <Zap className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {activity.type === 'match' ? 'Jogo' : 'Treino'}
                    </p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.date).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};