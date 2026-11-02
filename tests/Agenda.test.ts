import { describe, it, expect } from "vitest";
import { Agenda } from "../src/services/Agenda";
import { Contacto } from "../src/models/Contacto";

describe("Agenda", () => {
  it("se puede agregar un contacto y buscarlo por email", () => {
    const agenda = new Agenda();
    const contacto = new Contacto("Juan", "juan@example.com");

    agenda.agregarContacto(contacto);

    const resultado = agenda.buscarContactoPorEmail("juan@example.com");
    expect(resultado).toBe(contacto);
  });

  it("rechaza un contacto con email ya registrado", () => {
    const agenda = new Agenda();
    const contacto1 = new Contacto("Juan", "juan@example.com");
    const contacto2 = new Contacto("María", "juan@example.com");

    agenda.agregarContacto(contacto1);

    expect(() => agenda.agregarContacto(contacto2)).toThrow();
    expect(agenda.buscarContactoPorEmail("juan@example.com")).toBe(contacto1);
  });
});
