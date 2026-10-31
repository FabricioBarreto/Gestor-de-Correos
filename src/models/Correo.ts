import { Contacto } from "./Contacto";

export class Correo {
  constructor(
    private remitente: Contacto,
    private asunto: string,
    private cuerpo: string,
    private destinatarios: Contacto[],
  ) {}

  getAsunto(): string {
    return this.asunto;
  }

  getCuerpo(): string {
    return this.cuerpo;
  }

  getRemitente(): Contacto {
    return this.remitente;
  }

  getDestinatarios(): Contacto[] {
    return this.destinatarios;
  }
}
