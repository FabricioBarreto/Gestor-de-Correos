import { Bandeja } from "../models/Bandeja";
import { Correo } from "../models/Correo";
import { ReglaCorreo } from "../funcional/ReglaCorreo";
import { favorito, noLeido } from "../funcional/predicados";
import { Contacto } from "../models/Contacto";

export class GestorCorreos {
  private static readonly MAX_FILTROS = 5;
  private static readonly MOVIMIENTOS_PERMITIDOS: Record<Bandeja, Bandeja[]> = {
    [Bandeja.ENTRADA]: [Bandeja.ELIMINADOS],
    [Bandeja.ENVIADOS]: [Bandeja.ELIMINADOS],
    [Bandeja.BORRADORES]: [Bandeja.ENVIADOS, Bandeja.ELIMINADOS],
    [Bandeja.ELIMINADOS]: [],
  };
  private filtros: ReglaCorreo[] = [];
  private origenes = new Map<number, Bandeja>();
  private bandejas: Map<Bandeja, Correo[]> = new Map([
    [Bandeja.ENTRADA, []],
    [Bandeja.ENVIADOS, []],
    [Bandeja.BORRADORES, []],
    [Bandeja.ELIMINADOS, []],
  ]);
  constructor(private readonly entrega?: (correo: Correo) => void) {}

  getNoLeidos(bandeja: Bandeja): Correo[] {
    return this.getCorreos(bandeja).filter(noLeido);
  }

  getFavoritos(): Correo[] {
    return [Bandeja.ENTRADA, Bandeja.ENVIADOS, Bandeja.BORRADORES]
      .flatMap((b) => this.getCorreos(b))
      .filter(favorito);
  }

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

    const yaEnviado = this.getBandejaDe(correo) === Bandeja.ENVIADOS;

    if (this.getBandejaDe(correo) === Bandeja.BORRADORES) {
      this.quitar(correo);
    }

    this.agregarSinDuplicar(Bandeja.ENVIADOS, correo);

    if (!yaEnviado) {
      this.entrega?.(correo);
    }
  }

  recibir(correo: Correo): void {
    this.agregarSinDuplicar(Bandeja.ENTRADA, correo);
  }

  guardarBorrador(correo: Correo): void {
    this.agregarSinDuplicar(Bandeja.BORRADORES, correo);
  }

  editarBorrador(
    correo: Correo,
    cambios: { asunto?: string; cuerpo?: string; destinatarios?: Contacto[] },
  ): void {
    if (this.getBandejaDe(correo) !== Bandeja.BORRADORES) {
      throw new Error("Solo se pueden editar borradores");
    }

    correo.setAsunto(cambios.asunto ?? correo.getAsunto());
    correo.setCuerpo(cambios.cuerpo ?? correo.getCuerpo());
    correo.setDestinatarios(cambios.destinatarios ?? correo.getDestinatarios());
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

  mover(correo: Correo, destino: Bandeja): void {
    const actual = this.getBandejaDe(correo);

    if (actual === undefined) {
      throw new Error("El correo no está en ninguna bandeja");
    }
    if (!GestorCorreos.MOVIMIENTOS_PERMITIDOS[actual].includes(destino)) {
      throw new Error(`Movimiento no permitido: de ${actual} a ${destino}`);
    }

    if (destino === Bandeja.ELIMINADOS) {
      this.eliminar(correo);
    } else {
      this.enviar(correo);
    }
  }

  restaurar(correo: Correo): void {
    if (this.getBandejaDe(correo) !== Bandeja.ELIMINADOS) {
      throw new Error(
        "Solo se pueden restaurar correos que están en Eliminados",
      );
    }

    const origen = this.origenes.get(correo.getId())!;

    this.quitar(correo);
    this.origenes.delete(correo.getId());
    this.bandejas.get(origen)!.push(correo);
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
