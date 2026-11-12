import { Correo } from "../models/Correo";
import { Predicado } from "./predicados";
import { ReglaBase } from "./ReglaBase";

export class Filtro extends ReglaBase {
  constructor(nombre: string, private predicado: Predicado) {
    super(nombre);
  }

  aplicar(correos: Correo[]): Correo[] {
    return correos.filter((c) => this.cumple(c));
  }

  cumple(correo: Correo): boolean {
    return this.predicado(correo);
  }
}