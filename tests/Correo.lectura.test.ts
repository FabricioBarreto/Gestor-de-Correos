import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Correo - estado de lectura", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  function nuevoCorreo(): Correo {
    return new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
  }

  it("se puede marcar un correo como leído", () => {
    const correo = nuevoCorreo();

    correo.marcarComoLeido();

    expect(correo.estaLeido()).toBe(true);
  });

  it("se puede volver a marcar como no leído", () => {
    const correo = nuevoCorreo();
    correo.marcarComoLeido();

    correo.marcarComoNoLeido();

    expect(correo.estaLeido()).toBe(false);
  });

  it("el estado se mantiene al consultar el correo varias veces", () => {
    const correo = nuevoCorreo();

    correo.marcarComoLeido();

    expect(correo.estaLeido()).toBe(true);
    expect(correo.estaLeido()).toBe(true);
  });

  it("marcar un correo como leído varias veces no cambia el resultado", () => {
    const correo = nuevoCorreo();

    correo.marcarComoLeido();
    correo.marcarComoLeido();

    expect(correo.estaLeido()).toBe(true);
  });

  it("marcar un correo como leído no afecta a otros correos ni a su favorito", () => {
    const leido = nuevoCorreo();
    const otro = nuevoCorreo();

    leido.marcarComoLeido();

    expect(otro.estaLeido()).toBe(false);
    expect(leido.esFavorito()).toBe(false);
  });
});