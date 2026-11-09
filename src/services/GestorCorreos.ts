import { Bandeja } from "../models/Bandeja";
import { Correo } from "../models/Correo";
import { ReglaCorreo } from "../funcional/ReglaCorreo";

export class GestorCorreos {
  private static readonly MAX_FILTROS = 5;
  private filtros: ReglaCorreo[] = [];

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

    this.agregarSinDuplicar(Bandeja.ENVIADOS, correo);
  }

  recibir(correo: Correo): void {
    this.agregarSinDuplicar(Bandeja.ENTRADA, correo);
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

  private agregarSinDuplicar(bandeja: Bandeja, correo: Correo): void {
    const correos = this.bandejas.get(bandeja)!;
    const yaExiste = correos.some((c) => c.getId() === correo.getId());
    if (!yaExiste) {
      correos.push(correo);
    }
  }
}
