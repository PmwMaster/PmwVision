"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Camera, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";

export default function SettingsPage() {
  const { data: profile, loading, update } = useProfile();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(profile?.full_name || "");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await update({ full_name: name });
      toast.success("Configurações salvas!");
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <p className="text-label-md text-[hsl(var(--on-surface-variant))] uppercase tracking-wider">Preferências</p>
        <h1 className="text-display-lg font-display text-[hsl(var(--on-surface))] mt-1">Configurações</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-4 text-body-sm text-[hsl(var(--muted-foreground))]">Carregando...</div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">{profile?.full_name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                    <Camera className="w-3.5 h-3.5 text-[hsl(var(--primary-foreground))]" />
                  </button>
                </div>
                <div>
                  <p className="text-body-lg text-[hsl(var(--on-surface))] font-medium">{profile?.full_name || "Usuário"}</p>
                </div>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Salvar Alterações
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Atualize sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label htmlFor="current-password">Senha Atual</Label><Input id="current-password" type="password" /></div>
          <div className="space-y-2"><Label htmlFor="new-password">Nova Senha</Label><Input id="new-password" type="password" /></div>
          <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar Nova Senha</Label><Input id="confirm-password" type="password" /></div>
          <Button variant="secondary">Alterar Senha</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Gerencie suas preferências</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {["Meta próxima da conclusão", "Orçamento excedido", "Novo aporte sugerido", "Objetivos alcançados"].map((label) => (
            <label key={label} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[hsl(var(--primary))]" />
              <span className="text-body-sm text-[hsl(var(--on-surface))]">{label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[hsl(var(--error))/30]">
        <CardHeader><CardTitle className="text-[hsl(var(--error))]">Zona de Perigo</CardTitle></CardHeader>
        <CardContent>
          <Button variant="destructive" size="sm" onClick={() => { /* signOut */ }}>
            <LogOut className="w-4 h-4" />Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
