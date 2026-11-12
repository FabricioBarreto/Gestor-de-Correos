import { Correo } from "../models/Correo";
import { ReglaBase } from "./ReglaBase";

export class ReglaListaNegra extends ReglaBase {
  private bloqueados: string[];

  constructor(nombre: string, emails: string[]) {
    super(nombre);
    this.bloqueados = emails.map((e) => e.toLowerCase());
  }

  cumple(correo: Correo): boolean {
    const email = correo.getRemitente().getEmail().toLowerCase();
    return this.bloqueados.includes(email);
  }
}