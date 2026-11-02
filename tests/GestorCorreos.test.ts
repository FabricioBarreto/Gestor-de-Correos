import { describe, it, expect } from "vitest";
import { GestorCorreos } from "../src/services/GestorCorreos";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("GestorCorreos", () => {
  it("arranca con todas las bandejas vacías", () => {
    const gestor = new GestorCorreos();

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });

  it("modificar la lista obtenida de una bandeja no altera la bandeja", () => {
    const gestor = new GestorCorreos();
    const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    const lista = gestor.getCorreos(Bandeja.ENVIADOS);
    lista.push(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(0);
  });
});

describe("GestorCorreos - envío", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const otroDestinatario = new Contacto("Luis Gómez", "luis@gmail.com");

  it("un correo enviado queda en la bandeja de Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([correo]);
  });

  it("se puede enviar un correo a múltiples destinatarios", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [
      destinatario,
      otroDestinatario,
    ]);

    gestor.enviar(correo);

    const enviados = gestor.getCorreos(Bandeja.ENVIADOS);
    expect(enviados).toHaveLength(1);
    expect(enviados[0].getDestinatarios()).toEqual([
      destinatario,
      otroDestinatario,
    ]);
  });

  it("enviar un correo no lo agrega a otras bandejas", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });
});