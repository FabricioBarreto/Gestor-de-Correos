import { describe, it, expect } from "vitest";
import { Contacto } from "../src/models/Contacto";

describe("Contacto", () => {
  it("se crea con nombre y email", () => {
    const c = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    expect(c.getNombre()).toBe("Ana Pérez");
    expect(c.getEmail()).toBe("ana@ucp.edu.ar");
  });

  it("rechaza un email con formato inválido", () => {
    expect(() => new Contacto("Ana Pérez", "ana.ucp.edu.ar")).toThrow();
  });

  it("no debe aceptar nombres vacíos", () => {
    expect(() => new Contacto("", "ana@ucp.edu.ar")).toThrow();
  });

  it("se puede modificar el nombre del contacto", () => {
    const c = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    c.setNombre("Ana García");
    expect(c.getNombre()).toBe("Ana García");
  });

  it("no debe aceptar nombres vacíos al modificar", () => {
    const c = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    expect(() => c.setNombre("")).toThrow();
    expect(() => c.setNombre("   ")).toThrow();
  });

});
