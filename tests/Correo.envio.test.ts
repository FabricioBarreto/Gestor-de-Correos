import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Correo - validación para envío", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("un correo con asunto y destinatarios puede enviarse", () => {
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(correo.puedeEnviarse()).toBe(true);
  });

  it("un correo sin destinatarios no puede enviarse", () => {
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    expect(correo.puedeEnviarse()).toBe(false);
  });

  it("un correo con asunto vacío o en blanco no puede enviarse", () => {
    const vacio = new Correo(remitente, "", "Cuerpo", [destinatario]);
    const blanco = new Correo(remitente, "   ", "Cuerpo", [destinatario]);

    expect(vacio.puedeEnviarse()).toBe(false);
    expect(blanco.puedeEnviarse()).toBe(false);
  });
});