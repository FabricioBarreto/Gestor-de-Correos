import { Contacto } from "../models/Contacto";

export class Agenda {
  private contactos = new Map<string, Contacto>();

  agregarContacto(contacto: Contacto): void {
    this.contactos.set(contacto.getEmail(), contacto);
  }

  buscarContactoPorEmail(email: string): Contacto | undefined {
    return this.contactos.get(email);
  }
}
