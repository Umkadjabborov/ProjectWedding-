import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function unauthorized() {
  return err("Kirish taqiqlangan", 401);
}

export function forbidden() {
  return err("Ruxsat yo'q", 403);
}

export function notFound(entity = "Ma'lumot") {
  return err(`${entity} topilmadi`, 404);
}

export function serverError() {
  return err("Server xatosi", 500);
}
