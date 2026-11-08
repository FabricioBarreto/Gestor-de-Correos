import { Correo } from "../models/Correo";

export type Predicado = (correo: Correo) => boolean;

export const deDominio = (dominio: string): Predicado => (correo) => correo.getRemitente().getEmail().endsWith(dominio);
