import Aluno from '../entities/aluno.entity';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import { Tables } from '../utils/tables.enum';
import { TipoUsuario } from '../utils/tipo-usuario.enum';
import { Validador } from '../utils/utils';
import cursoRepository from './curso.repository';
import Repository from './repository';

class AlunoRepository extends Repository<Aluno> {
  constructor() {
    super(Tables.USUARIO);
  }

  async incluir(aluno: Aluno) {
    aluno.senha = Validador.criptografarSenha(aluno.senha);
    aluno.tipo = TipoUsuario.ALUNO;
    return await super.incluir(aluno);
  }

  async alterar(filtro: FilterQuery<Aluno>, aluno: Aluno) {
    if (aluno.senha) {
      aluno.senha = Validador.criptografarSenha(aluno.senha);
    }
    return super.alterar(filtro, aluno);
  }

  async excluir(filtro: FilterQuery<Aluno>) {
    const curso = await cursoRepository.obter(filtro)
    if (curso) {
      throw new BusinessException("Este aluno está matriculado em algum curso e não pode ser deletado")
    }
    return super.excluir(filtro)
  }
}



export default new AlunoRepository();
