import { describe, it, expect } from "vitest";
import { GestorCorreos } from "../src/services/GestorCorreos";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { Filtro } from "../src/funcional/Filtro";
import { asuntoContiene } from "../src/funcional/predicados";
import { filtrosPredefinidos } from "../src/funcional/filtrosPredefinidos";

describe("GestorCorreos", () => {
  it("arranca con todas las bandejas vacías", () => {
    const gestor = new GestorCorreos();

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });

  it("modificar la lista obtenida de una bandeja no altera la bandeja", () => {
    const gestor = new GestorCorreos();
    const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
    const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    const lista = gestor.getCorreos(Bandeja.ENVIADOS);
    lista.push(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(0);
  });
});

describe("GestorCorreos - envío", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
  const otroDestinatario = new Contacto("Luis Gómez", "luis@gmail.com");

  it("un correo enviado queda en la bandeja de Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([correo]);
  });

  it("se puede enviar un correo a múltiples destinatarios", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [
      destinatario,
      otroDestinatario,
    ]);

    gestor.enviar(correo);

    const enviados = gestor.getCorreos(Bandeja.ENVIADOS);
    expect(enviados).toHaveLength(1);
    expect(enviados[0].getDestinatarios()).toEqual([
      destinatario,
      otroDestinatario,
    ]);
  });

  it("enviar un correo no lo agrega a otras bandejas", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });
});

describe("GestorCorreos - validación al enviar", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("no permite enviar un correo sin destinatarios", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    expect(() => gestor.enviar(correo)).toThrow();
  });

  it("no permite enviar un correo con asunto vacío o en blanco", () => {
    const gestor = new GestorCorreos();
    const vacio = new Correo(remitente, "", "Cuerpo", [destinatario]);
    const blanco = new Correo(remitente, "   ", "Cuerpo", [destinatario]);

    expect(() => gestor.enviar(vacio)).toThrow();
    expect(() => gestor.enviar(blanco)).toThrow();
  });

  it("un correo inválido no queda guardado en Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    try {
      gestor.enviar(correo);
    } catch {
      // se espera el error
    }

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
  });
});

describe("GestorCorreos - duplicados al enviar", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("enviar dos veces el mismo correo no genera duplicados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);
    gestor.enviar(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(1);
  });

  it("correos distintos con el mismo contenido se guardan por separado", () => {
    const gestor = new GestorCorreos();
    const correo1 = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    const correo2 = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo1);
    gestor.enviar(correo2);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toHaveLength(2);
  });
});

describe("GestorCorreos - recepción", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("un correo recibido queda en la bandeja de Entrada", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.recibir(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([correo]);
  });

  it("recibir un correo no lo agrega a otras bandejas", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.recibir(correo);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });

  it("recibir dos veces el mismo correo no genera duplicados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.recibir(correo);
    gestor.recibir(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
  });
});

describe("GestorCorreos - búsqueda", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@gmail.com");

  it("encuentra los correos de la Entrada que coinciden con el texto", () => {
    const gestor = new GestorCorreos();
    const examen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const otro = new Correo(juan, "Saludos", "Cuerpo", [ana]);
    gestor.recibir(examen);
    gestor.recibir(otro);

    expect(gestor.buscar("examen")).toEqual([examen]);
  });

  it("un correo aparece una sola vez aunque coincida con varios campos", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Proyecto", "Proyecto de Juan", [ana]);
    gestor.recibir(correo);

    expect(gestor.buscar("proyecto")).toHaveLength(1);
    expect(gestor.buscar("juan")).toHaveLength(1);
  });

  it("devuelve una colección vacía cuando no hay coincidencias", () => {
    const gestor = new GestorCorreos();
    gestor.recibir(new Correo(juan, "Asunto", "Cuerpo", [ana]));

    expect(gestor.buscar("inexistente")).toEqual([]);
  });

  it("devuelve una colección vacía si la bandeja de Entrada está vacía", () => {
    const gestor = new GestorCorreos();

    expect(gestor.buscar("algo")).toEqual([]);
  });

  it("solo busca en la Entrada, no en otras bandejas", () => {
    const gestor = new GestorCorreos();
    gestor.enviar(new Correo(juan, "Examen", "Cuerpo", [ana]));

    expect(gestor.buscar("examen")).toEqual([]);
  });
});

describe("GestorCorreos - búsqueda con texto vacío y sin efectos", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@gmail.com");

  it("un texto vacío o en blanco no devuelve resultados", () => {
    const gestor = new GestorCorreos();
    gestor.recibir(new Correo(juan, "Asunto", "Cuerpo", [ana]));

    expect(gestor.buscar("")).toEqual([]);
    expect(gestor.buscar("   ")).toEqual([]);
  });

  it("buscar no modifica los correos ni la bandeja de Entrada", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Examen", "Cuerpo", [ana]);
    gestor.recibir(correo);

    gestor.buscar("examen");

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([correo]);
    expect(correo.getAsunto()).toBe("Examen");
    expect(correo.estaLeido()).toBe(false);
    expect(correo.esFavorito()).toBe(false);
  });
});

describe("GestorCorreos - filtros", () => {
  it("se pueden registrar filtros y consultarlos", () => {
    const gestor = new GestorCorreos();
    const filtro = new Filtro("Exámenes", asuntoContiene("examen"));

    gestor.registrarFiltro(filtro);

    expect(gestor.getFiltros()).toEqual([filtro]);
  });

  it("no permite registrar más de cinco filtros", () => {
    const gestor = new GestorCorreos();

    for (let i = 0; i < 5; i++) {
      const filtro = new Filtro(`Filtro ${i + 1}`, asuntoContiene("test"));
      gestor.registrarFiltro(filtro);
    }

    const sextoFiltro = new Filtro("Sexto filtro", asuntoContiene("test"));
    expect(() => gestor.registrarFiltro(sextoFiltro)).toThrow(
      "No se pueden registrar más de 5 filtros",
    );
  });

  it("aplica un filtro registrado sobre una bandeja", () => {
    const gestor = new GestorCorreos();
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const examen = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const saludos = new Correo(juan, "Saludos", "Cuerpo", [ana]);
    gestor.recibir(examen);
    gestor.recibir(saludos);
    gestor.registrarFiltro(new Filtro("Exámenes", asuntoContiene("examen")));

    const resultado = gestor.aplicarFiltro("Exámenes", Bandeja.ENTRADA);

    expect(resultado).toEqual([examen]);
  });

  it("no se puede aplicar un filtro que no está registrado", () => {
    const gestor = new GestorCorreos();

    expect(() => gestor.aplicarFiltro("Inexistente", Bandeja.ENTRADA)).toThrow(
      "Filtro no encontrado",
    );
  });

  it("un mismo filtro se aplica sobre distintas bandejas", () => {
    const gestor = new GestorCorreos();
    const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
    const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");
    const recibido = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const enviado = new Correo(juan, "Examen Parcial", "Cuerpo", [ana]);
    gestor.recibir(recibido);
    gestor.enviar(enviado);
    gestor.registrarFiltro(filtrosPredefinidos.academicosImportantes);

    expect(
      gestor.aplicarFiltro("Correos académicos importantes", Bandeja.ENTRADA),
    ).toEqual([recibido]);
    expect(
      gestor.aplicarFiltro("Correos académicos importantes", Bandeja.ENVIADOS),
    ).toEqual([enviado]);
  });
});

describe("GestorCorreos - ubicación de correos", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("un correo guardado como borrador queda en Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "", "", []);

    gestor.guardarBorrador(correo);

    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([correo]);
  });

  it("indica en qué bandeja está cada correo", () => {
    const gestor = new GestorCorreos();
    const recibido = new Correo(remitente, "Uno", "Cuerpo", [destinatario]);
    const enviado = new Correo(remitente, "Dos", "Cuerpo", [destinatario]);
    const borrador = new Correo(remitente, "Tres", "Cuerpo", []);

    gestor.recibir(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    expect(gestor.getBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.getBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
    expect(gestor.getBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
  });

  it("un correo que no está en ninguna bandeja no tiene ubicación", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(gestor.getBandejaDe(correo)).toBeUndefined();
  });
});

describe("GestorCorreos - una única bandeja por correo", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("no permite enviar un correo que ya está en la Entrada", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    expect(() => gestor.enviar(correo)).toThrow();
    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([correo]);
  });

  it("no permite recibir un correo que ya está en Enviados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.enviar(correo);

    expect(() => gestor.recibir(correo)).toThrow();
    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
  });

  it("enviar un borrador válido lo saca de Borradores y lo pasa a Enviados", () => {
    const gestor = new GestorCorreos();
    const borrador = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.guardarBorrador(borrador);

    gestor.enviar(borrador);

    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([borrador]);
  });

  it("un borrador inválido no se envía y sigue en Borradores", () => {
    const gestor = new GestorCorreos();
    const borrador = new Correo(remitente, "", "Cuerpo", []);
    gestor.guardarBorrador(borrador);

    expect(() => gestor.enviar(borrador)).toThrow();
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([borrador]);
    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
  });
});

describe("GestorCorreos - eliminación lógica", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("eliminar un correo de la Entrada lo traslada a Eliminados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    gestor.eliminar(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([correo]);
  });

  it("se pueden eliminar correos de Enviados y de Borradores", () => {
    const gestor = new GestorCorreos();
    const enviado = new Correo(remitente, "Uno", "Cuerpo", [destinatario]);
    const borrador = new Correo(remitente, "Dos", "Cuerpo", []);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    gestor.eliminar(enviado);
    gestor.eliminar(borrador);

    expect(gestor.getCorreos(Bandeja.ENVIADOS)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toHaveLength(2);
  });

  it("eliminar es lógico: el correo conserva su información", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    gestor.eliminar(correo);

    expect(gestor.getCorreos(Bandeja.ELIMINADOS)[0].getAsunto()).toBe("Asunto");
  });

  it("no permite eliminar un correo que no está en ninguna bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(() => gestor.eliminar(correo)).toThrow();
  });

  it("no permite eliminar dos veces el mismo correo", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);
    gestor.eliminar(correo);

    expect(() => gestor.eliminar(correo)).toThrow();
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toHaveLength(1);
  });
});

describe("GestorCorreos - restauración", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("un correo eliminado se restaura a la bandeja de origen", () => {
    const gestor = new GestorCorreos();
    const recibido = new Correo(remitente, "Uno", "Cuerpo", [destinatario]);
    const enviado = new Correo(remitente, "Dos", "Cuerpo", [destinatario]);
    const borrador = new Correo(remitente, "Tres", "Cuerpo", []);
    gestor.recibir(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);
    gestor.eliminar(recibido);
    gestor.eliminar(enviado);
    gestor.eliminar(borrador);

    gestor.restaurar(recibido);
    gestor.restaurar(enviado);
    gestor.restaurar(borrador);

    expect(gestor.getBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.getBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
    expect(gestor.getBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
    expect(gestor.getCorreos(Bandeja.ELIMINADOS)).toEqual([]);
  });

  it("restaurar no genera duplicados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);
    gestor.eliminar(correo);

    gestor.restaurar(correo);

    expect(gestor.getCorreos(Bandeja.ENTRADA)).toHaveLength(1);
  });

  it("un correo se puede eliminar y restaurar más de una vez", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    gestor.eliminar(correo);
    gestor.restaurar(correo);
    gestor.eliminar(correo);
    gestor.restaurar(correo);

    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  it("no permite restaurar un correo que no está en Eliminados", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    expect(() => gestor.restaurar(correo)).toThrow();
  });
});

describe("GestorCorreos - movimientos permitidos", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("mover un borrador válido a Enviados lo envía", () => {
    const gestor = new GestorCorreos();
    const borrador = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.guardarBorrador(borrador);

    gestor.mover(borrador, Bandeja.ENVIADOS);

    expect(gestor.getBandejaDe(borrador)).toBe(Bandeja.ENVIADOS);
    expect(gestor.getCorreos(Bandeja.BORRADORES)).toEqual([]);
  });

  it("mover un borrador inválido a Enviados falla y no lo mueve", () => {
    const gestor = new GestorCorreos();
    const borrador = new Correo(remitente, "", "Cuerpo", []);
    gestor.guardarBorrador(borrador);

    expect(() => gestor.mover(borrador, Bandeja.ENVIADOS)).toThrow();
    expect(gestor.getBandejaDe(borrador)).toBe(Bandeja.BORRADORES);
  });

  it("mover a Eliminados equivale a eliminar", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    gestor.mover(correo, Bandeja.ELIMINADOS);

    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
  });

  it("rechaza movimientos que no respetan las reglas del dominio", () => {
    const gestor = new GestorCorreos();
    const recibido = new Correo(remitente, "Uno", "Cuerpo", [destinatario]);
    const enviado = new Correo(remitente, "Dos", "Cuerpo", [destinatario]);
    gestor.recibir(recibido);
    gestor.enviar(enviado);

    expect(() => gestor.mover(recibido, Bandeja.ENVIADOS)).toThrow();
    expect(() => gestor.mover(recibido, Bandeja.BORRADORES)).toThrow();
    expect(() => gestor.mover(enviado, Bandeja.ENTRADA)).toThrow();
    expect(() => gestor.mover(enviado, Bandeja.BORRADORES)).toThrow();
    expect(gestor.getBandejaDe(recibido)).toBe(Bandeja.ENTRADA);
    expect(gestor.getBandejaDe(enviado)).toBe(Bandeja.ENVIADOS);
  });

  it("rechaza mover un correo a la bandeja en la que ya está", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);

    expect(() => gestor.mover(correo, Bandeja.ENTRADA)).toThrow();
  });

  it("un correo eliminado solo sale de Eliminados mediante restaurar", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);
    gestor.eliminar(correo);

    expect(() => gestor.mover(correo, Bandeja.ENTRADA)).toThrow();
    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.ELIMINADOS);
  });

  it("no permite mover un correo que no está en ninguna bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    expect(() => gestor.mover(correo, Bandeja.ELIMINADOS)).toThrow();
  });
});

describe("GestorCorreos - edición de borradores", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("editar un borrador conserva los cambios y luego se puede enviar", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "", "Cuerpo", []);
    gestor.guardarBorrador(correo);

    gestor.editarBorrador(correo, {
      asunto: "Examen Final",
      destinatarios: [ana],
    });

    expect(correo.getAsunto()).toBe("Examen Final");
    expect(correo.getDestinatarios()).toEqual([ana]);
    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.BORRADORES);

    gestor.enviar(correo);
    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.ENVIADOS);
  });

  it("no permite editar un correo que no está en Borradores", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    gestor.recibir(correo);

    expect(() => gestor.editarBorrador(correo, { asunto: "X" })).toThrow(
      "Solo se pueden editar borradores",
    );
  });
});

describe("GestorCorreos - entrega al enviar", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("al enviar un correo se invoca la función de entrega", () => {
    const entregados: Correo[] = [];
    const gestor = new GestorCorreos((c) => entregados.push(c));
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);

    expect(entregados).toEqual([correo]);
  });

  it("enviar dos veces el mismo correo lo entrega una sola vez", () => {
    const entregados: Correo[] = [];
    const gestor = new GestorCorreos((c) => entregados.push(c));
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);

    gestor.enviar(correo);
    gestor.enviar(correo);

    expect(entregados).toHaveLength(1);
  });

  it("un correo inválido no se entrega", () => {
    const entregados: Correo[] = [];
    const gestor = new GestorCorreos((c) => entregados.push(c));
    const correo = new Correo(remitente, "Asunto", "Cuerpo", []);

    expect(() => gestor.enviar(correo)).toThrow();
    expect(entregados).toEqual([]);
  });

  it("mover un borrador a Enviados también lo entrega", () => {
    const entregados: Correo[] = [];
    const gestor = new GestorCorreos((c) => entregados.push(c));
    const borrador = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.guardarBorrador(borrador);

    gestor.mover(borrador, Bandeja.ENVIADOS);

    expect(entregados).toEqual([borrador]);
  });
});

describe("GestorCorreos - correos no leídos", () => {
  const remitente = new Contacto("Juan García", "juan@ucp.edu.ar");
  const destinatario = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("devuelve solo los correos no leídos de la bandeja", () => {
    const gestor = new GestorCorreos();
    const leido = new Correo(remitente, "Uno", "Cuerpo", [destinatario]);
    const noLeido = new Correo(remitente, "Dos", "Cuerpo", [destinatario]);
    gestor.recibir(leido);
    gestor.recibir(noLeido);
    leido.marcarComoLeido();

    expect(gestor.getNoLeidos(Bandeja.ENTRADA)).toEqual([noLeido]);
  });

  it("marcar como leído un correo lo saca del resultado inmediatamente", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);
    expect(gestor.getNoLeidos(Bandeja.ENTRADA)).toEqual([correo]);

    correo.marcarComoLeido();

    expect(gestor.getNoLeidos(Bandeja.ENTRADA)).toEqual([]);
  });

  it("marcar como no leído un correo lo vuelve a incluir", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(remitente, "Asunto", "Cuerpo", [destinatario]);
    gestor.recibir(correo);
    correo.marcarComoLeido();

    correo.marcarComoNoLeido();

    expect(gestor.getNoLeidos(Bandeja.ENTRADA)).toEqual([correo]);
  });

  it("devuelve una colección vacía si la bandeja está vacía", () => {
    const gestor = new GestorCorreos();

    expect(gestor.getNoLeidos(Bandeja.ENTRADA)).toEqual([]);
  });

  it("solo considera los correos de la bandeja pedida", () => {
    const gestor = new GestorCorreos();
    gestor.recibir(new Correo(remitente, "Uno", "Cuerpo", [destinatario]));
    const enviado = new Correo(remitente, "Dos", "Cuerpo", [destinatario]);
    gestor.enviar(enviado);

    expect(gestor.getNoLeidos(Bandeja.ENVIADOS)).toEqual([enviado]);
  });
});

describe("GestorCorreos - favoritos", () => {
  const juan = new Contacto("Juan García", "juan@ucp.edu.ar");
  const ana = new Contacto("Ana Pérez", "ana@ucp.edu.ar");

  it("muestra los favoritos de todas las bandejas", () => {
    const gestor = new GestorCorreos();
    const recibido = new Correo(juan, "Uno", "Cuerpo", [ana]);
    const enviado = new Correo(juan, "Dos", "Cuerpo", [ana]);
    const borrador = new Correo(juan, "Tres", "Cuerpo", []);
    gestor.recibir(recibido);
    gestor.enviar(enviado);
    gestor.guardarBorrador(borrador);

    recibido.marcarComoFavorito();
    enviado.marcarComoFavorito();

    const favoritos = gestor.getFavoritos();
    expect(favoritos).toHaveLength(2);
    expect(favoritos).toContain(recibido);
    expect(favoritos).toContain(enviado);
  });

  it("marcar como favorito no mueve el correo de su bandeja", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    gestor.recibir(correo);

    correo.marcarComoFavorito();

    expect(gestor.getBandejaDe(correo)).toBe(Bandeja.ENTRADA);
  });

  it("los eliminados no aparecen en favoritos y vuelven al restaurarse", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    gestor.recibir(correo);
    correo.marcarComoFavorito();

    gestor.eliminar(correo);
    expect(gestor.getFavoritos()).toEqual([]);
    expect(correo.esFavorito()).toBe(true);

    gestor.restaurar(correo);
    expect(gestor.getFavoritos()).toEqual([correo]);
  });

  it("no hay duplicados al consultar favoritos", () => {
    const gestor = new GestorCorreos();
    const correo = new Correo(juan, "Asunto", "Cuerpo", [ana]);
    gestor.recibir(correo);
    correo.marcarComoFavorito();
    correo.marcarComoFavorito();

    expect(gestor.getFavoritos()).toEqual([correo]);
  });

  it("se pueden combinar filtros sobre la colección de favoritos", () => {
    const gestor = new GestorCorreos();
    const luis = new Contacto("Luis Gómez", "luis@gmail.com");
    const academico = new Correo(juan, "Examen Final", "Cuerpo", [ana]);
    const personal = new Correo(luis, "Examen de manejo", "Cuerpo", [ana]);
    gestor.recibir(academico);
    gestor.recibir(personal);
    academico.marcarComoFavorito();
    personal.marcarComoFavorito();

    const resultado = filtrosPredefinidos.academicosImportantes.aplicar(
      gestor.getFavoritos(),
    );

    expect(resultado).toEqual([academico]);
  });
});
