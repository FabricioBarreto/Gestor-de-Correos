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

  it("cada correo tiene un id único", () => {
    const remitente1 = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario1 = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const remitente2 = new Contacto("Luis Gómez", "luis@gmail.com");
    const destinatario2 = new Contacto("Marta Ruiz", "marta@hotmail.com");

    const correo1 = new Correo(remitente1, "Asunto 1", "Cuerpo 1", [
      destinatario1,
    ]);
    const correo2 = new Correo(remitente2, "Asunto 2", "Cuerpo 2", [
      destinatario2,
    ]);

    expect(correo1.getId()).not.toBe(correo2.getId());
    expect(correo1.getRemitente()).toBe(remitente1);
    expect(correo2.getRemitente()).toBe(remitente2);
    expect(correo2.getDestinatarios()).toEqual([destinatario2]);
  });

  it("modificar la lista de destinatarios obtenida no altera el correo", () => {
    const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const intruso = new Contacto("Luis Gómez", "luis@gmail.com");
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    const lista = correo.getDestinatarios();
    lista.push(intruso);

    expect(correo.getDestinatarios()).toHaveLength(1);
    expect(correo.getDestinatarios()).toEqual([destinatario]);
  });
});
