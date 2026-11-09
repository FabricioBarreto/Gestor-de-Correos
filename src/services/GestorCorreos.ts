import { Bandeja } from "../models/Bandeja";
import { Correo } from "../models/Correo";
import { ReglaCorreo } from "../funcional/ReglaCorreo";

export class GestorCorreos {
  private static readonly MAX_FILTROS = 5;
  private filtros: ReglaCorreo[] = [];
  private origenes = new Map<number, Bandeja>();
  private bandejas: Map<Bandeja, Correo[]> = new Map([
    [Bandeja.ENTRADA, []],
    [Bandeja.ENVIADOS, []],
    [Bandeja.BORRADORES, []],
    [Bandeja.ELIMINADOS, []],
  ]);

  getCorreos(bandeja: Bandeja): Correo[] {
    return [...(this.bandejas.get(bandeja) ?? [])];
  }

  getFiltros(): ReglaCorreo[] {
    return [...this.filtros];
  }

  enviar(correo: Correo): void {
    if (!correo.puedeEnviarse()) {
      throw new Error(
        "El correo no puede enviarse: requiere remitente, asunto y al menos un destinatario",
      );
    }

    if (this.getBandejaDe(correo) === Bandeja.BORRADORES) {
      this.quitar(correo);
    }

    this.agregarSinDuplicar(Bandeja.ENVIADOS, correo);
  }

  recibir(correo: Correo): void {
    this.agregarSinDuplicar(Bandeja.ENTRADA, correo);
  }
  
  guardarBorrador(correo: Correo): void {
    this.agregarSinDuplicar(Bandeja.BORRADORES, correo);
  }

  getBandejaDe(correo: Correo): Bandeja | undefined {
    const ubicacion = [...this.bandejas.entries()].find(([, correos]) =>
      correos.some((c) => c.getId() === correo.getId()),
    );
    return ubicacion?.[0];
  }
  
  eliminar(correo: Correo): void {
    const actual = this.getBandejaDe(correo);

    if (actual === undefined) {
      throw new Error("El correo no está en ninguna bandeja");
    }
    if (actual === Bandeja.ELIMINADOS) {
      throw new Error("El correo ya está en Eliminados");
    }

    this.quitar(correo);
    this.origenes.set(correo.getId(), actual);
    this.bandejas.get(Bandeja.ELIMINADOS)!.push(correo);
  }

  buscar(texto: string): Correo[] {
    const buscado = texto.trim();

    if (buscado === "") {
      return [];
    }

    return this.getCorreos(Bandeja.ENTRADA).filter((correo) =>
      correo.coincideCon(buscado),
    );
  }

  registrarFiltro(regla: ReglaCorreo): void {
    if (this.filtros.length >= GestorCorreos.MAX_FILTROS) {
      throw new Error("No se pueden registrar más de 5 filtros");
    }
    this.filtros.push(regla);
  }

  aplicarFiltro(nombre: string, bandeja: Bandeja): Correo[] {
    const regla = this.filtros.find((r) => r.getNombre() === nombre);

    if (!regla) {
      throw new Error("Filtro no encontrado");
    }

    return this.getCorreos(bandeja).filter((c) => regla.cumple(c));
  }

  private agregarSinDuplicar(bandeja: Bandeja, correo: Correo): void {
    const actual = this.getBandejaDe(correo);

    if (actual === bandeja) {
      return;
    }
    if (actual !== undefined) {
      throw new Error(`El correo ya pertenece a la bandeja ${actual}`);
    }

    this.bandejas.get(bandeja)!.push(correo);
  }

  private quitar(correo: Correo): void {
    const actual = this.getBandejaDe(correo);

    if (actual !== undefined) {
      const restantes = this.bandejas
        .get(actual)!
        .filter((c) => c.getId() !== correo.getId());
      this.bandejas.set(actual, restantes);
    }
  }
}
