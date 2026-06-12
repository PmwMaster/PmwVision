import { NextResponse } from "next/server";

export function handleError(error: unknown) {
  console.error("[API Error]", error);
  const message =
    error instanceof Error ? error.message : "Erro interno do servidor";
  return NextResponse.json({ error: message }, { status: 500 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}
