import { Bandeja } from "../models/Bandeja";
import { Correo } from "../models/Correo";

export class GestorCorreos {
  private bandejas: Map<Bandeja, Correo[]> = new Map([
    [Bandeja.ENTRADA, []],
    [Bandeja.ENVIADOS, []],
    [Bandeja.BORRADORES, []],
    [Bandeja.ELIMINADOS, []],
  ]);

  getCorreos(bandeja: Bandeja): Correo[] {
    return [...(this.bandejas.get(bandeja) ?? [])];
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

  private agregarSinDuplicar(bandeja: Bandeja, correo: Correo): void {
    const correos = this.bandejas.get(bandeja)!;
    const yaExiste = correos.some((c) => c.getId() === correo.getId());
    if (!yaExiste) {
      correos.push(correo);
    }
  }
}
