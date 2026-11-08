import { describe, it, expect } from "vitest";
import { Contacto } from "../src/models/Contacto";
import { Filtro } from "../src/funcional/Filtro";
import { Correo } from "../src/models/Correo";
import { asuntoContiene } from "../src/funcional/predicados";

describe("Filtro", () => {
  it("un filtro tiene nombre y aplica su predicado a una colección", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

    const examen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const saludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

    const filtro = new Filtro("Exámenes", asuntoContiene("examen"));
    const resultado = filtro.aplicar([examen, saludos]);

    expect(filtro.getNombre()).toBe("Exámenes");
    expect(resultado).toEqual([examen]);
  });
});
