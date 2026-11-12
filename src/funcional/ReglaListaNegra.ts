import { Correo } from "../models/Correo";
import { ReglaCorreo } from "./ReglaCorreo";

export class ReglaListaNegra implements ReglaCorreo {
  private bloqueados: string[];

  constructor(
    private nombre: string,
    emails: string[],
  ) {
    this.bloqueados = emails.map((e) => e.toLowerCase());
  }

  getNombre(): string {
    return this.nombre;
  }

  cumple(correo: Correo): boolean {
    const email = correo.getRemitente().getEmail().toLowerCase();
    return this.bloqueados.includes(email);
  }
}
