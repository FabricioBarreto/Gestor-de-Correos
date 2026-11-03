import { describe, it, expect } from "vitest";
import { Agenda } from "../src/services/Agenda";
import { Contacto } from "../src/models/Contacto";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { GestorCorreos } from "../src/services/GestorCorreos";

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

  it("se puede modificar el nombre de un contacto existente", () => {
    const agenda = new Agenda();
    const contacto = new Contacto("Juan", "juan@example.com");

    agenda.agregarContacto(contacto);
    agenda.modificarContacto("juan@example.com", "Juan Pérez");

    const resultado = agenda.buscarContactoPorEmail("juan@example.com");
    expect(resultado?.getNombre()).toBe("Juan Pérez");
  });

  it("no se puede modificar un contacto que no existe", () => {
    const agenda = new Agenda();

    expect(() => agenda.modificarContacto("nadie@example.com", "X")).toThrow(
      "Contacto no encontrado",
    );
  });

  it("se puede eliminar un contacto", () => {
    const agenda = new Agenda();
    const contacto = new Contacto("Juan", "juan@example.com");

    agenda.agregarContacto(contacto);
    agenda.eliminarContacto("juan@example.com");

    expect(agenda.buscarContactoPorEmail("juan@example.com")).toBeUndefined();
  });

  it("no se puede eliminar un contacto que no existe", () => {
    const agenda = new Agenda();

    expect(() => agenda.eliminarContacto("nadie@example.com")).toThrow(
      "Contacto no encontrado",
    );
  });

  it("eliminar un contacto no elimina los correos que lo referencian", () => {
    const agenda = new Agenda();
    const gestor = new GestorCorreos();
    const juan = new Contacto("Juan", "juan@example.com");
    const ana = new Contacto("Ana", "ana@example.com");
    agenda.agregarContacto(juan);
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    gestor.enviar(correo);

    agenda.eliminarContacto("juan@example.com");

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(1);
    expect(correo.getRemitente().getNombre()).toBe("Juan");
  });
});

