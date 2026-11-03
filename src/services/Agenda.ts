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

  modificarContacto(email: string, nuevoNombre: string): void {
    const contacto = this.contactos.get(email);
    if (!contacto) {
      throw new Error("Contacto no encontrado");
    }
    contacto.setNombre(nuevoNombre);
  }

  eliminarContacto(email: string): void {
    if (!this.contactos.delete(email)) {
      throw new Error("Contacto no encontrado");
    }
  }

}
