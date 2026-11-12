import { describe, it, expect } from "vitest";
import { GestorCorreos } from "../src/services/GestorCorreos";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { Filtro } from "../src/funcional/Filtro";
import { ReglaListaNegra } from "../src/funcional/ReglaListaNegra";
import { ReglaBase } from "../src/funcional/ReglaBase";
import { asuntoContiene } from "../src/funcional/predicados";

describe("GestorCorreos - reglas polimórficas", () => {
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const spammer = new Contacto("Spam", "ofertas@spam.com");

  it("aplica un Filtro y una ReglaListaNegra con la misma operación", () => {
    const gestor = new GestorCorreos();
    const examen = new Correo(juan, "Examen final", "Cuerpo", [ana]);
    const oferta = new Correo(spammer, "Oferta", "Cuerpo", [ana]);
    gestor.recibir(examen);
    gestor.recibir(oferta);

    gestor.registrarFiltro(new Filtro("Exámenes", asuntoContiene("examen")));
    gestor.registrarFiltro(
      new ReglaListaNegra("Bloqueados", ["ofertas@spam.com"]),
    );

    expect(gestor.aplicarFiltro("Exámenes", Bandeja.ENTRADA)).toEqual([examen]);
    expect(gestor.aplicarFiltro("Bloqueados", Bandeja.ENTRADA)).toEqual([
      oferta,
    ]);
  });

  it("Filtro y ReglaListaNegra son ReglaBase", () => {
    const reglas: ReglaBase[] = [
      new Filtro("Exámenes", asuntoContiene("examen")),
      new ReglaListaNegra("Bloqueados", []),
    ];

    expect(reglas.every((r) => r instanceof ReglaBase)).toBe(true);
    expect(reglas.map((r) => r.getNombre())).toEqual([
      "Exámenes",
      "Bloqueados",
    ]);
  });
});
