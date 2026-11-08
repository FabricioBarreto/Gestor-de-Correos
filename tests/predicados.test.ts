import { describe, it, expect } from "vitest";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { deDominio, asuntoContiene } from "../src/funcional/predicados";

describe("Predicados", () => {
  it("deDominio identifica correos cuyo remitente pertenece al dominio", () => {
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const luis = new Contacto("Luis Gómez", "luis@gmail.com");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correoUcp = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    const correoGmail = new Correo(luis, "Asunto", "Cuerpo", [ana]);

    const esUcp = deDominio("@ucp.edu.ar");

    expect(esUcp(correoUcp)).toBe(true);
    expect(esUcp(correoGmail)).toBe(false);
  });

  it("asuntoContiene identifica correos cuyo asunto incluye el texto", () => {
  // Arrange
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const correoExamen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
  const correoSaludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);

  // Act
  const deExamen = asuntoContiene("examen");

  // Assert
  expect(deExamen(correoExamen)).toBe(true);
  expect(deExamen(correoSaludos)).toBe(false);
});
});
