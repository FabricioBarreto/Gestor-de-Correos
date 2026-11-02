import {describe, it, expect} from 'vitest';

describe('Agenda', () => {
  it("se puede agregar un contacto y buscarlo por email", () => {
    const agenda = new Agenda();
    const contacto = new Contacto("Juan", "juan@example.com");

    agenda.agregarContacto(contacto);
    
    const resultado = agenda.buscarContactoPorEmail("juan@example.com");
    expect(resultado).toBe(contacto);
  });
});