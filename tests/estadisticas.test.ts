import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import {
  asuntos,
  contarNoLeidos,
  filtrarPor,
} from "../src/funcional/estadisticas";
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
    expect(correos).toEqual([examen, saludos]);
  });

  it("contarNoLeidos cuenta los correos sin leer con reduce", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const uno = new Correo(juan, "Uno", "Cuerpo", [ana]);
    const dos = new Correo(juan, "Dos", "Cuerpo", [ana]);
    const tres = new Correo(juan, "Tres", "Cuerpo", [ana]);
    dos.marcarComoLeido();

    expect(contarNoLeidos([uno, dos, tres])).toBe(2);
    expect(contarNoLeidos([])).toBe(0);
  });

  it("cantidadPorRemitente agrupa los correos por remitente con reduce", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const luis = new Contacto("Luis Gómez", "luis@gmail.com");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correos = [
      new Correo(juan, "Uno", "Cuerpo", [ana]),
      new Correo(luis, "Dos", "Cuerpo", [ana]),
      new Correo(juan, "Tres", "Cuerpo", [ana]),
    ];

    expect(cantidadPorRemitente(correos)).toEqual({
      "juan@ucp.edu.ar": 2,
      "luis@gmail.com": 1,
    });
    expect(cantidadPorRemitente([])).toEqual({});
  });
});
