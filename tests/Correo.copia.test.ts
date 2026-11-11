import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Correo - copia para entrega", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const luis = new Contacto("Luis Gómez", "luis@gmail.com");

  it("la copia tiene los mismos datos que el original", () => {
    const original = new Correo(remitente, "Asunto", "Cuerpo", [ana, luis]);

    const copia = original.copiar();

    expect(copia.getRemitente()).toBe(remitente);
    expect(copia.getAsunto()).toBe("Asunto");
    expect(copia.getCuerpo()).toBe("Cuerpo");
    expect(copia.getDestinatarios()).toEqual([ana, luis]);
  });

  it("la copia es un objeto distinto y tiene su propio id", () => {
    const original = new Correo(remitente, "Asunto", "Cuerpo", [ana]);

    const copia = original.copiar();

    expect(copia).not.toBe(original);
    expect(copia.getId()).not.toBe(original.getId());
  });

  it("la copia arranca no leída y no favorita", () => {
    const original = new Correo(remitente, "Asunto", "Cuerpo", [ana]);

    const copia = original.copiar();

    expect(copia.estaLeido()).toBe(false);
    expect(copia.esFavorito()).toBe(false);
  });

  it("modificar la copia no altera el original", () => {
    const original = new Correo(remitente, "Asunto", "Cuerpo", [ana]);
    const copia = original.copiar();

    copia.setAsunto("Otro asunto");
    copia.setDestinatarios([luis]);

    expect(original.getAsunto()).toBe("Asunto");
    expect(original.getDestinatarios()).toEqual([ana]);
  });
});