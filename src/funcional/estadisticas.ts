import { Correo } from "../models/Correo";
import { Predicado, noLeido } from "./predicados";

export const asuntos = (correos: Correo[]): string[] =>
  correos.map((c) => c.getAsunto());

export const filtrarPor = (correos: Correo[], predicado: Predicado): Correo[] =>
  correos.filter(predicado);

export const contarNoLeidos = (correos: Correo[]): number =>
  correos.reduce((total, c) => total + (noLeido(c) ? 1 : 0), 0);

export const cantidadPorRemitente = (
  correos: Correo[],
): Record<string, number> =>
  correos.reduce<Record<string, number>>((conteo, c) => {
    const email = c.getRemitente().getEmail();
    return { ...conteo, [email]: (conteo[email] ?? 0) + 1 };
  }, {});
