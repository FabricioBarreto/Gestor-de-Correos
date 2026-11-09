import { Correo } from "../models/Correo";
import { Predicado } from "./predicados";
import { ReglaCorreo } from "./ReglaCorreo";

export class Filtro implements ReglaCorreo {
  constructor(
    private nombre: string,
    private predicado: Predicado,
  ) {}

  getNombre(): string {
    return this.nombre;
  }

  aplicar(correos: Correo[]): Correo[] {
    return correos.filter((c) => this.cumple(c));
  }

  cumple(correo: Correo): boolean {
    return this.predicado(correo);
  }
}
