import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Correo - coincidencia con texto", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@gmail.com");

  it("coincide con el asunto sin distinguir mayúsculas", () => {
    const correo = new Correo(remitente, "Examen Final", "Cuerpo", [
      destinatario,
    ]);

    expect(correo.coincideCon("examen final")).toBe(true);
    expect(correo.coincideCon("EXAMEN FINAL")).toBe(true);
  });

  it("admite coincidencias parciales", () => {
    const correo = new Correo(remitente, "Examen Final", "Cuerpo", [
      destinatario,
    ]);

    expect(correo.coincideCon("exa")).toBe(true);
    expect(correo.coincideCon("nal")).toBe(true);
  });

  it("coincide con el contenido del mensaje", () => {
    const correo = new Correo(
      remitente,
      "Asunto",
      "Recuerden la Entrega del viernes",
      [destinatario],
    );

    expect(correo.coincideCon("entrega")).toBe(true);
  });

  it("no coincide si el texto no aparece en ningún campo", () => {
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(correo.coincideCon("inexistente")).toBe(false);
  });
});