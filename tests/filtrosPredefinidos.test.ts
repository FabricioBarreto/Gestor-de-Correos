import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { filtrosPredefinidos } from "../src/funcional/filtrosPredefinidos";

describe("Filtros predefinidos", () => {
  it("academicosImportantes identifica correos académicos importantes", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const luis = new Contacto("Luis González", "luis@gmail.com");
    const ucpExamen = new Correo(juan, "Examen Final", "Cuerpo", [luis]);
    const gmailExamen = new Correo(luis, "Examen Final", "Cuerpo", [juan]);

    expect(filtrosPredefinidos.academicosImportantes.cumple(ucpExamen)).toBe(
      true,
    );
    expect(filtrosPredefinidos.academicosImportantes.cumple(gmailExamen)).toBe(
      false,
    );
  });

  it("seguimiento identifica correos de proyecto o reunión no leídos", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const proyecto = new Correo(juan, "Proyecto final", "Cuerpo", [ana]);
    const reunion = new Correo(juan, "Reunión de equipo", "Cuerpo", [ana]);
    const saludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

    const filtro = filtrosPredefinidos.seguimiento;

    expect(filtro.cumple(proyecto)).toBe(true);
    expect(filtro.cumple(reunion)).toBe(true);
    expect(filtro.cumple(saludos)).toBe(false);
  });

  it("pendientesRevision identifica correos no leídos que mencionan una entrega", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const conEntrega = new Correo(
      juan,
      "Asunto",
      "Recuerden la Entrega del viernes",
      [ana],
    );
    const saludo = new Correo(juan, "Asunto", "Hola", [ana]);

    const filtro = filtrosPredefinidos.pendientesRevision;

    expect(filtro.cumple(conEntrega)).toBe(true);
    expect(filtro.cumple(saludo)).toBe(false);
  });
});
