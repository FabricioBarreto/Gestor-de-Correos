import { Filtro } from "./Filtro";
import {
  and,
  or,
  deDominio,
  asuntoContiene,
  cuerpoContiene,
  noLeido,
} from "./predicados";

export const filtrosPredefinidos = {
  academicosImportantes: new Filtro(
    "Correos académicos importantes",
    and(deDominio("@ucp.edu.ar"), asuntoContiene("examen")),
  ),

  seguimiento: new Filtro(
    "Correos para seguimiento",
    and(or(asuntoContiene("proyecto"), asuntoContiene("reunión")), noLeido),
  ),

  pendientesRevision: new Filtro(
    "Pendientes de revisión",
    and(noLeido, cuerpoContiene("entrega")),
  ),
};
