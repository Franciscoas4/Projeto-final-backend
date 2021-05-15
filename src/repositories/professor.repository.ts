import Professor from '../entities/professor.entity';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import cursoRepository from './curso.repository';
import Repository from './repository';

class ProfessorRepository extends Repository<Professor> {
  constructor() {
    super(Tables.USUARIO);
  }

  async incluir(professor: Professor) {
    professor.senha = Validador.criptografarSenha(professor.senha);
    professor.tipo = TipoUsuario.PROFESSOR;
    return super.incluir(professor);
  }

  async alterar(filtro: FilterQuery<Professor>, professor: Professor) {
    if (professor.senha) {
      professor.senha = Validador.criptografarSenha(professor.senha);
    }
    return super.alterar(filtro, professor);
  }

  async excluir(filtro: FilterQuery<Professor>) {
    const curso = await cursoRepository.obter(filtro)
    if (curso) {
      throw new BusinessException("Este professor está lecionando um curso, não é possível deleta-lo")
    }
    return super.excluir(filtro)
  }
  
}

export default new ProfessorRepository();
