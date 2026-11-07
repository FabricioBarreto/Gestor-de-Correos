import { describe, it, expect } from "vitest";
import { deDominio } from "../src/funcional/predicados";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";

describe("Predicados", () => {
  it("deDominio identifica correos cuyo remitente pertenece al dominio", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const luis = new Contacto("Luis Gómez", "luis@gmail.com");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correoUcp = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    const correoGmail = new Correo(luis, "Asunto", "Cuerpo", [ana]);

    const esUcp = deDominio("@ucp.edu.ar");

    expect(esUcp(correoUcp)).toBe(true);
    expect(esUcp(correoGmail)).toBe(false);
  });
});
