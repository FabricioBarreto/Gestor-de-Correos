import { Correo } from "../models/Correo";

export const asuntos = (correos: Correo[]): string[] =>
  correos.map((c) => c.getAsunto());
