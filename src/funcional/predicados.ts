import { Correo } from "../models/Correo";

export type Predicado = (correo: Correo) => boolean;

export const deDominio =
  (dominio: string): Predicado =>
  (correo) =>
    correo.getRemitente().getEmail().endsWith(dominio);

export const asuntoContiene =
  (texto: string): Predicado =>
  (correo) =>
    correo.getAsunto().toLowerCase().includes(texto.toLowerCase());
