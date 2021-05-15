import Usuario from './usuario.entity';
import Curso from './curso.entity';

export default class Professor extends Usuario {

  cursos: Curso[];

  constructor() {
    super();
  }
}
