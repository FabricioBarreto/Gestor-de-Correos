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

export const noLeido: Predicado = (correo) => !correo.estaLeido();

export const favorito: Predicado = (correo) => correo.esFavorito();

export const and =
  (p1: Predicado, p2: Predicado): Predicado =>
  (correo) =>
    p1(correo) && p2(correo);

export const or =
  (p1: Predicado, p2: Predicado): Predicado =>
  (correo) =>
    p1(correo) || p2(correo);

export const not =
  (p: Predicado): Predicado =>
  (correo) =>
    !p(correo);
