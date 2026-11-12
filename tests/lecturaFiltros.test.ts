import { describe, it, expect } from "vitest";
import { GestorCorreos } from "../src/services/GestorCorreos";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { filtrosPredefinidos } from "../src/funcional/filtrosPredefinidos";

describe("Estado de lectura y filtros", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("marcar como leído saca el correo de 'Pendientes de revisión'", () => {
    const gestor = new GestorCorreos();
    gestor.registrarFiltro(filtrosPredefinidos.pendientesRevision);
    const correo = new Correo(juan, "Aviso", "Falta la entrega final", [ana]);
    gestor.recibir(correo);
    expect(
      gestor.aplicarFiltro("Pendientes de revisión", Bandeja.ENTRADA),
    ).toEqual([correo]);

    correo.marcarComoLeido();

    expect(
      gestor.aplicarFiltro("Pendientes de revisión", Bandeja.ENTRADA),
    ).toEqual([]);
  });

  it("marcar como no leído devuelve el correo al filtro sin volver a guardarlo", () => {
    const gestor = new GestorCorreos();
    gestor.registrarFiltro(filtrosPredefinidos.pendientesRevision);
    const correo = new Correo(juan, "Aviso", "Falta la entrega final", [ana]);
    gestor.recibir(correo);
    correo.marcarComoLeido();

    correo.marcarComoNoLeido();

    expect(
      gestor.aplicarFiltro("Pendientes de revisión", Bandeja.ENTRADA),
    ).toEqual([correo]);
  });

  it("el cambio se refleja también en 'Correos para seguimiento'", () => {
    const gestor = new GestorCorreos();
    gestor.registrarFiltro(filtrosPredefinidos.seguimiento);
    const correo = new Correo(juan, "Proyecto final", "Cuerpo", [ana]);
    gestor.recibir(correo);

    correo.marcarComoLeido();

    expect(
      gestor.aplicarFiltro("Correos para seguimiento", Bandeja.ENTRADA),
    ).toEqual([]);
  });
});