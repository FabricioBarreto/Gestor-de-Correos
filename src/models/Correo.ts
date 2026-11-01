import { Contacto } from "./Contacto";

export class Correo {
  private leido = false;
  private favorito = false;
  private static siguienteId = 1;
  private readonly id: number;

  constructor(
    private remitente: Contacto,
    private asunto: string,
    private cuerpo: string,
    private destinatarios: Contacto[],
  ) {
    this.id = Correo.siguienteId++;
  }

  getId(): number {
    return this.id;
  }

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
    return [...this.destinatarios];
  }

  estaLeido(): boolean {
    return this.leido;
  }

  esFavorito(): boolean {
    return this.favorito;
  }
}
