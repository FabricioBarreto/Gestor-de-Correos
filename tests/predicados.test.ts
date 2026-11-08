import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import {
  deDominio,
  asuntoContiene,
  noLeido,
  favorito,
  and,
} from "../src/funcional/predicados";

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

  it("asuntoContiene identifica correos cuyo asunto incluye el texto", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correoExamen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const correoSaludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

    const deExamen = asuntoContiene("examen");

    expect(deExamen(correoExamen)).toBe(true);
    expect(deExamen(correoSaludos)).toBe(false);
  });

  it("noLeido identifica correos que no fueron leídos", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correoNoLeido = new Correo(juan, "Asunto", "Cuerpo", [ana]);

    expect(noLeido(correoNoLeido)).toBe(true);
  });

  it("favorito identifica correos marcados como favoritos", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);

    expect(favorito(correo)).toBe(false);
  });

  it("and combina dos predicados: se cumplen ambos", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@gmail.com");
    const luis = new Contacto("Luis Gómez", "luis@gmail.com");

    const ucpExamen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const ucpSaludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

    const gmailExamen = new Correo(luis, "Examen Final", "Cuerpo", [ana]);

    const academico = and(deDominio("@ucp.edu.ar"), asuntoContiene("examen"));

    expect(academico(ucpExamen)).toBe(true);

    expect(academico(ucpExamen)).toBe(true);
    expect(academico(ucpSaludos)).toBe(false);
    expect(academico(gmailExamen)).toBe(false);
  });
});
