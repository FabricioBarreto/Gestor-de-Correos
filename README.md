# Gestor de Correos con Filtros Dinámicos

Trabajo práctico grupal (AE4) de **Paradigmas y Lenguajes de Programación II**, Ingeniería en Sistemas de Información, Universidad de la Cuenca del Plata.

**Integrantes:** Fabricio Barreto, Camila Castillo

## Descripción

Sistema de gestión de correos electrónicos desarrollado en TypeScript con TDD. El dominio se modela con Programación Orientada a Objetos y los filtros y el procesamiento de colecciones con Programación Funcional.

## Funcionalidades

- Creación de contactos y correos con validaciones.
- Envío, recepción y borradores, con una única bandeja por correo.
- Agenda de contactos: agregar, buscar, modificar y eliminar.
- Búsqueda de correos en la bandeja de Entrada.
- Filtros dinámicos a partir de predicados combinables (`and`, `or`, `not`), con un máximo de 5 filtros registrados.
- Eliminación lógica, restauración a la bandeja de origen y movimientos permitidos entre bandejas.
- Edición de borradores.
- Entrega entre usuarios mediante un servidor, con un buzón independiente por usuario.
- Correos no leídos, favoritos y estadísticas con `map`, `filter` y `reduce`.
- Regla de lista negra por remitente.

## Tecnologías

- TypeScript
- Vitest
- GitHub Actions (integración continua)

## Estructura

```
src/
  models/      Entidades del dominio (Contacto, Correo, Bandeja)
  services/    Coordinación (GestorCorreos, Agenda, ServidorCorreo)
  funcional/   Predicados, reglas, filtros y estadísticas
tests/         Tests unitarios
```

## Instalación y uso

Requiere Node.js 22 o superior.

```bash
npm install
npm test            # ejecuta los tests
npm run typecheck   # verifica los tipos
```

## Integración continua

En cada push, GitHub Actions verifica los tipos y ejecuta los tests.