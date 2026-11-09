import { Correo } from "../models/Correo";

export interface ReglaCorreo {
  cumple(correo: Correo): boolean;
  getNombre(): string;
}
