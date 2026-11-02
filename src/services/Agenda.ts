import { Contacto } from "../models/Contacto";

export class Agenda {
  private contactos = new Map<string, Contacto>();

  agregarContacto(contacto: Contacto): void {
    if (this.contactos.has(contacto.getEmail())) {
      throw new Error("Ya existe un contacto con ese email");
    }
    this.contactos.set(contacto.getEmail(), contacto);
  }

  buscarContactoPorEmail(email: string): Contacto | undefined {
    return this.contactos.get(email);
  }
}
