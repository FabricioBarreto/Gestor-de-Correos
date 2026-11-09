import { describe, it, expect } from "vitest";
import { GestorCorreos } from "../src/services/GestorCorreos";
import { Bandeja } from "../src/models/Bandeja";
import { Correo } from "../src/models/Correo";
import { Contacto } from "../src/models/Contacto";
import { Filtro } from "../src/funcional/Filtro";
import { asuntoContiene } from "../src/funcional/predicados";

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
      "No se pueden registrar más de 5 filtros"
    );
  });
});
