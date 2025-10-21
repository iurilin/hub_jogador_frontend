import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { LogIn, UserPlus, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hub-jogador-app.vercel.app/";

const Auth = () => {
  const navigate = useNavigate();
  
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  });

  const [cadastroData, setCadastroData] = useState({
    nome: "",
    email: "",
    senha: "",
    posicao: "",
    foto: null as File | null,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/usuario/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          senha: loginData.senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha no login");
      }

      toast.success("Login realizado com sucesso!");

      localStorage.setItem("token", data.token);

      localStorage.setItem("token", data.token);
      console.log("NAVEGANDO AGORA...");
      navigate("/");
     



    } catch (error: any) {
      toast.error(error.message || "Erro desconhecido. Tente novamente.");
    }
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosParaApi = {
      nome: cadastroData.nome,
      email: cadastroData.email,
      senha: cadastroData.senha,
      posicao: cadastroData.posicao,
    };

    try {
      const response = await fetch(`${API_URL}/usuario/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosParaApi),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha no cadastro");
      }

      // Sucesso!
      toast.success("Cadastro realizado com sucesso! Agora você pode fazer o login.");

    } catch (error: any) {
      toast.error(error.message || "Erro desconhecido. Tente novamente.");
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCadastroData({ ...cadastroData, foto: e.target.files[0] });
      toast.success("Foto selecionada!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Football Stats
          </h1>
          <p className="text-muted-foreground">Gerencie seu desempenho</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="cadastro">Cadastro</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Entrar
                </CardTitle>
                <CardDescription>Entre com suas credenciais</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-senha">Senha</Label>
                    <Input
                      id="login-senha"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.senha}
                      onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cadastro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Criar Conta
                </CardTitle>
                <CardDescription>Cadastre-se para começar</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastro} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cadastro-nome">Nome Completo</Label>
                    <Input
                      id="cadastro-nome"
                      type="text"
                      placeholder="João Silva"
                      value={cadastroData.nome}
                      onChange={(e) => setCadastroData({ ...cadastroData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-email">Email</Label>
                    <Input
                      id="cadastro-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={cadastroData.email}
                      onChange={(e) => setCadastroData({ ...cadastroData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-senha">Senha</Label>
                    <Input
                      id="cadastro-senha"
                      type="password"
                      placeholder="••••••••"
                      value={cadastroData.senha}
                      onChange={(e) => setCadastroData({ ...cadastroData, senha: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-posicao">Posição</Label>
                    <Select
                      value={cadastroData.posicao}
                      onValueChange={(value: any) => setCadastroData({ ...cadastroData, posicao: value })}
                    >
                      <SelectTrigger id="cadastro-posicao">
                        <SelectValue placeholder="Selecione sua posição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goleiro">Goleiro</SelectItem>
                        <SelectItem value="zagueiro">Zagueiro</SelectItem>
                        <SelectItem value="lateral">Lateral</SelectItem>
                        <SelectItem value="volante">Volante</SelectItem>
                        <SelectItem value="meia">Meia</SelectItem>
                        <SelectItem value="atacante">Atacante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cadastro-foto">Foto de Perfil</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="cadastro-foto"
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="cursor-pointer"
                      />
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {cadastroData.foto && (
                      <p className="text-sm text-muted-foreground">
                        Arquivo: {cadastroData.foto.name}
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;