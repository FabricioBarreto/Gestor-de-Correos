import { Correo } from "../models/Correo";
import { Predicado, noLeido } from "./predicados";

export const asuntos = (correos: Correo[]): string[] =>
  correos.map((c) => c.getAsunto());

export const filtrarPor = (correos: Correo[], predicado: Predicado): Correo[] =>
  correos.filter(predicado);

export const contarNoLeidos = (correos: Correo[]): number =>
  correos.reduce((total, c) => total + (noLeido(c) ? 1 : 0), 0);
