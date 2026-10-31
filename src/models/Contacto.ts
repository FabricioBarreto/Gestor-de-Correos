export class Contacto {
  constructor(
    private nombre: string,
    private email: string,
  ) {
    if (!Contacto.esEmailValido(email)) {
      throw new Error("Email inválido");
    }
  }

  getNombre(): string {
    return this.nombre;
  }

  getEmail(): string {
    return this.email;
  }

  static esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
