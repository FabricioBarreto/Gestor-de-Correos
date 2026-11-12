import { describe, it, expect } from "vitest";
import { ServidorCorreo } from "../src/services/ServidorCorreo";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("ServidorCorreo - buzones por usuario", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("cada usuario registrado tiene su propio gestor de correos", () => {
    const servidor = new ServidorCorreo();

    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);

    expect(buzonJuan).not.toBe(buzonAna);
    expect(servidor.getBuzon("juan@ucp.edu.ar")).toBe(buzonJuan);
    expect(servidor.getBuzon("ana@ucp.edu.ar")).toBe(buzonAna);
  });

  it("cada usuario arranca con sus cuatro bandejas vacías", () => {
    const servidor = new ServidorCorreo();
    const buzon = servidor.registrarUsuario(juan);

    expect(buzon.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(buzon.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(buzon.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(buzon.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });

  it("las bandejas de un usuario no se mezclan con las de otro", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);
    const correo = new Correo(ana, "Asunto", "Cuerpo", [juan]);

    buzonJuan.recibir(correo);

    expect(buzonJuan.getCorreos(Bandeja.ENTRADA)).toEqual([correo]);
    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toEqual([]);
  });

  it("no permite registrar dos veces el mismo email", () => {
    const servidor = new ServidorCorreo();
    servidor.registrarUsuario(juan);

    expect(() =>
      servidor.registrarUsuario(new Contacto("Otro Juan", "JUAN@ucp.edu.ar")),
    ).toThrow();
  });

  it("no permite obtener el buzón de un usuario no registrado", () => {
    const servidor = new ServidorCorreo();

    expect(() => servidor.getBuzon("nadie@ucp.edu.ar")).toThrow();
  });
});

describe("ServidorCorreo - entrega de correos", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const luis = new Contacto("Luis Gómez", "luis@ucp.edu.ar");

  it("enviar guarda el correo en los Enviados del remitente", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    servidor.registrarUsuario(ana);
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);

    buzonJuan.enviar(correo);

    expect(buzonJuan.getCorreos(Bandeja.ENVIADOS)).toEqual([correo]);
  });

  it("enviar entrega una copia en la Entrada de cada destinatario", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);
    const buzonLuis = servidor.registrarUsuario(luis);
    const correo = new Correo(juan, "Examen", "Cuerpo", [ana, luis]);

    buzonJuan.enviar(correo);

    const deAna = buzonAna.getCorreos(Bandeja.ENTRADA);
    const deLuis = buzonLuis.getCorreos(Bandeja.ENTRADA);
    expect(deAna).toHaveLength(1);
    expect(deLuis).toHaveLength(1);
    expect(deAna[0].getAsunto()).toBe("Examen");
    expect(deAna[0].getRemitente()).toBe(juan);
    expect(deAna[0]).not.toBe(deLuis[0]);
    expect(deAna[0]).not.toBe(correo);
  });

  it("el remitente no recibe el correo en su Entrada", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    servidor.registrarUsuario(ana);

    buzonJuan.enviar(new Correo(juan, "Asunto", "Cuerpo", [ana]));

    expect(buzonJuan.getCorreos(Bandeja.ENTRADA)).toEqual([]);
  });

  it("los destinatarios sin buzón se ignoran (correos externos)", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);
    const externo = new Contacto("Externo", "externo@gmail.com");
    const correo = new Correo(juan, "Asunto", "Cuerpo", [externo, ana]);

    buzonJuan.enviar(correo);

    expect(buzonJuan.getCorreos(Bandeja.ENVIADOS)).toEqual([correo]);
    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
  });
});

describe("ServidorCorreo - independencia entre usuarios", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const luis = new Contacto("Luis Gómez", "luis@ucp.edu.ar");

  function escenario() {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);
    const buzonLuis = servidor.registrarUsuario(luis);
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana, luis]);
    buzonJuan.enviar(correo);
    return { buzonJuan, buzonAna, buzonLuis, correo };
  }

  it("eliminar en un usuario no afecta a los demás", () => {
    const { buzonJuan, buzonAna, buzonLuis } = escenario();
    const deAna = buzonAna.getCorreos(Bandeja.ENTRADA)[0];

    buzonAna.eliminar(deAna);

    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(buzonAna.getCorreos(Bandeja.ELIMINADOS)).toHaveLength(1);
    expect(buzonLuis.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
    expect(buzonLuis.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
    expect(buzonJuan.getCorreos(Bandeja.ENVIADOS)).toHaveLength(1);
  });

  it("restaurar en un usuario no afecta a los demás", () => {
    const { buzonAna, buzonLuis } = escenario();
    const deAna = buzonAna.getCorreos(Bandeja.ENTRADA)[0];
    const deLuis = buzonLuis.getCorreos(Bandeja.ENTRADA)[0];
    buzonAna.eliminar(deAna);
    buzonLuis.eliminar(deLuis);

    buzonAna.restaurar(deAna);

    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
    expect(buzonLuis.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(buzonLuis.getCorreos(Bandeja.ELIMINADOS)).toHaveLength(1);
  });

  it("enviar dos veces el mismo correo no duplica la entrega", () => {
    const { buzonJuan, buzonAna, correo } = escenario();

    buzonJuan.enviar(correo);

    expect(buzonJuan.getCorreos(Bandeja.ENVIADOS)).toHaveLength(1);
    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
  });

  it("enviar un borrador lo entrega y lo saca de Borradores del remitente", () => {
    const servidor = new ServidorCorreo();
    const buzonJuan = servidor.registrarUsuario(juan);
    const buzonAna = servidor.registrarUsuario(ana);
    const borrador = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    buzonJuan.guardarBorrador(borrador);

    buzonJuan.enviar(borrador);

    expect(buzonJuan.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(buzonJuan.getCorreos(Bandeja.ENVIADOS)).toEqual([borrador]);
    expect(buzonAna.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
  });

  it("la búsqueda de un usuario solo mira su propia Entrada", () => {
    const { buzonJuan, buzonAna } = escenario();

    expect(buzonAna.buscar("Asunto")).toHaveLength(1);
    expect(buzonJuan.buscar("Asunto")).toEqual([]);
  });
});