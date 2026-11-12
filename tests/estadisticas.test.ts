import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { asuntos, filtrarPor } from "../src/funcional/estadisticas";
import { asuntoContiene } from "../src/funcional/predicados";

describe("Estadísticas", () => {
  it("asuntos devuelve la lista de asuntos de una colección", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const examen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const saludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

    const resultado = asuntos([examen, saludos]);

    expect(resultado).toEqual(["Examen Final", "Saludos"]);
  });

  it("asuntos de una colección vacía es una lista vacía", () => {
    expect(asuntos([])).toEqual([]);
  });

  it("filtrarPor devuelve los correos que cumplen un predicado", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const examen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const saludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);
    const correos = [examen, saludos];

    const resultado = filtrarPor(correos, asuntoContiene("examen"));

    expect(resultado).toEqual([examen]);
    expect(correos).toEqual([examen, saludos]); // no modifica la original
  });
});
