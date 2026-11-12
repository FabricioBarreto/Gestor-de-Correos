import { Contacto } from "../models/Contacto";
import { Correo } from "../models/Correo";
import { GestorCorreos } from "./GestorCorreos";

export class ServidorCorreo {
  private buzones = new Map<string, GestorCorreos>();

  registrarUsuario(usuario: Contacto): GestorCorreos {
    const clave = ServidorCorreo.clave(usuario.getEmail());

    if (this.buzones.has(clave)) {
      throw new Error("Ya existe un usuario con ese email");
    }

    const buzon = new GestorCorreos((correo) => this.entregar(correo));
    this.buzones.set(clave, buzon);
    return buzon;
  }

  getBuzon(email: string): GestorCorreos {
    const buzon = this.buzones.get(ServidorCorreo.clave(email));

    if (!buzon) {
      throw new Error("Usuario no registrado");
    }

    return buzon;
  }

    private entregar(correo: Correo): void {
    correo.getDestinatarios().forEach((destinatario) => {
      const buzon = this.buzones.get(
        ServidorCorreo.clave(destinatario.getEmail()),
      );
      buzon?.recibir(correo.copiar());
    });
  }

  private static clave(email: string): string {
    return email.trim().toLowerCase();
  }
}