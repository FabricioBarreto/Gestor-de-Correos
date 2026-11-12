import { Correo } from "../models/Correo";
import { ReglaCorreo } from "./ReglaCorreo";

export abstract class ReglaBase implements ReglaCorreo {
  constructor(private readonly nombre: string) {}

  getNombre(): string {
    return this.nombre;
  }

  abstract cumple(correo: Correo): boolean;
}
