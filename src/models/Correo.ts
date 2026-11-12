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

  setAsunto(asunto: string): void {
    this.asunto = asunto;
  }

  setCuerpo(cuerpo: string): void {
    this.cuerpo = cuerpo;
  }

  setDestinatarios(destinatarios: Contacto[]): void {
    this.destinatarios = [...destinatarios];
  }

  estaLeido(): boolean {
    return this.leido;
  }

  marcarComoLeido(): void {
    this.leido = true;
  }

  marcarComoNoLeido(): void {
    this.leido = false;
  }

  marcarComoFavorito(): void {
    this.favorito = true;
  }

  desmarcarComoFavorito(): void {
    this.favorito = false;
  }

  esFavorito(): boolean {
    return this.favorito;
  }

  copiar(): Correo {
    return new Correo(
      this.remitente,
      this.asunto,
      this.cuerpo,
      this.destinatarios,
    );
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
    const contactos = [this.remitente, ...this.destinatarios];

    const camposDeTexto = [
      this.asunto,
      this.cuerpo,
      ...contactos.flatMap((c) => [c.getNombre(), c.getEmail()]),
    ];

    return camposDeTexto.some((campo) => campo.toLowerCase().includes(buscado));
  }
}
