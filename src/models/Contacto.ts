export class Contacto {
  constructor(
    private nombre: string,
    private email: string,
  ) {
    Contacto.validarNombre(nombre);

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

  setNombre(nombre: string): void {
    Contacto.validarNombre(nombre);
    this.nombre = nombre;
  }

  private static validarNombre(nombre: string): void {
    if (nombre.trim() === "") {
      throw new Error("El nombre no puede estar vacío");
    }
  }

  static esEmailValido(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
