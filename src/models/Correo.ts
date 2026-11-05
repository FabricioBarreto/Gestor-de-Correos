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
    this.destinatarios = [...destinatarios];
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

  puedeEnviarse(): boolean {
    return (
      this.remitente !== undefined &&
      this.asunto.trim() !== "" &&
      this.destinatarios.length > 0
    );
  }

  coincideCon(texto: string): boolean {
    const buscado = texto.toLowerCase();

    return (
      this.asunto.toLowerCase().includes(buscado) ||
      this.cuerpo.toLowerCase().includes(buscado)
    );
  }
}