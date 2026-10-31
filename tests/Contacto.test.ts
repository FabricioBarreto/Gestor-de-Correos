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

});
