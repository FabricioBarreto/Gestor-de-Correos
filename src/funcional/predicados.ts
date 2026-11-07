import { Correo } from "../models/Correo";

export type Predicado = (correo: Correo) => boolean;
