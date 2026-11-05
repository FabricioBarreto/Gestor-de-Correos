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

    const enviados = this.bandejas.get(Bandeja.ENVIADOS)!;
    const yaEnviado = enviados.some((c) => c.getId() === correo.getId());

    if (!yaEnviado) {
      enviados.push(correo);
    }
  }

    recibir(correo: Correo): void {
    const entrada = this.bandejas.get(Bandeja.ENTRADA)!;
    const yaRecibido = entrada.some((c) => c.getId() === correo.getId());

    if (!yaRecibido) {
      entrada.push(correo);
    }
  }
}