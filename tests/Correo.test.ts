import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Correo", () => {
  it("se crea con asunto, cuerpo, remitente y destinatarios", () => {
    const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(correo.getAsunto()).toBe("Asunto");
    expect(correo.getCuerpo()).toBe("Cuerpo");
    expect(correo.getRemitente()).toBe(remitente);
    expect(correo.getDestinatarios()).toEqual([destinatario]);
  });

  it("arranca no leído y no favorito", () => {
    const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(correo.estaLeido()).toBe(false);
    expect(correo.esFavorito()).toBe(false);
  });
});
