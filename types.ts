import type { OptionalId } from "mongodb";

export type Contact = OptionalId<{
    nombreCompleto: string,
    telefono: string,
    residencia: string,
    horaActual: string
}>