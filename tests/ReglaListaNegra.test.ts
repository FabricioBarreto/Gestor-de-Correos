import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { ReglaListaNegra } from "../src/funcional/ReglaListaNegra";

describe("ReglaListaNegra", () => {
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const spammer = new Contacto("Spam", "ofertas@spam.com");
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");

  it("identifica correos de remitentes bloqueados", () => {
    const regla = new ReglaListaNegra("Bloqueados", ["ofertas@spam.com"]);

    expect(regla.cumple(new Correo(spammer, "Oferta", "Cuerpo", [ana]))).toBe(
      true,
    );
    expect(regla.cumple(new Correo(juan, "Examen", "Cuerpo", [ana]))).toBe(
      false,
    );
  });

  it("no distingue mayúsculas en los emails", () => {
    const regla = new ReglaListaNegra("Bloqueados", ["OFERTAS@SPAM.COM"]);

    expect(regla.cumple(new Correo(spammer, "Oferta", "Cuerpo", [ana]))).toBe(
      true,
    );
  });

  it("tiene un nombre", () => {
    const regla = new ReglaListaNegra("Bloqueados", []);

    expect(regla.getNombre()).toBe("Bloqueados");
  });
});
