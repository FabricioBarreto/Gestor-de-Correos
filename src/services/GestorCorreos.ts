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
    this.bandejas.get(Bandeja.ENVIADOS)!.push(correo);
  }
}