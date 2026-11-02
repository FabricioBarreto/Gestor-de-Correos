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

describe("GestorCorreos - validación al enviar", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("no permite enviar un correo sin destinatarios", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    expect(() => gestor.enviar(correo)).toThrow();
  });

  it("no permite enviar un correo con asunto vacío o en blanco", () => {
    const gestor = new GestorCorreos();
    const vacio = new Correo(remitente, "", "Cuerpo", [destinatario]);
    const blanco = new Correo(remitente, "   ", "Cuerpo", [destinatario]);

    expect(() => gestor.enviar(vacio)).toThrow();
    expect(() => gestor.enviar(blanco)).toThrow();
  });

  it("un correo inválido no queda guardado en Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    try {
      gestor.enviar(correo);
    } catch {
      // se espera el error
    }

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
  });
});

describe("GestorCorreos - duplicados al enviar", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("enviar dos veces el mismo correo no genera duplicados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);
    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(1);
  });

  it("correos distintos con el mismo contenido se guardan por separado", () => {
    const gestor = new GestorCorreos();
    const correo1 = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    const correo2 = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo1);
    gestor.enviar(correo2);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(2);
  });
});