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