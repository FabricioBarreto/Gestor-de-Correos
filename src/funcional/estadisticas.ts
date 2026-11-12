import { Correo } from "../models/Correo";
import { Predicado } from "./predicados";

export const asuntos = (correos: Correo[]): string[] =>
  correos.map((c) => c.getAsunto());

export const filtrarPor = (correos: Correo[], predicado: Predicado): Correo[] =>
  correos.filter(predicado);
