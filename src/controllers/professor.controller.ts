import Professor from '../entities/professor.entity';
import ProfessorRepository from '../repositories/professor.repository';
import CursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';
import cursoRepository from '../repositories/curso.repository';
import BusinessException from '../utils/exceptions/business.exception';

export default class ProfessorController {
  async obterPorId(id: number): Promise<Professor> {
    Validador.validarParametros([{ id }]);

    return await ProfessorRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Professor> = {}): Promise<Professor> {
    return await ProfessorRepository.obter(filtro);
  }

  // #pegabandeira ok
  async listar(filtro: FilterQuery<Professor> = {tipo: 1}): Promise<Professor[]> {
    const professores = await ProfessorRepository.listar(filtro)

    for (const professor of professores) {
      professor.cursos = await cursoRepository.listar({
        idProfessor: professor.id,
      })
    }
    return professores
  }

  // #pegabandeira
  async incluir(professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ nome }, { email }, { senha }]);
    professor.tipo = 1;

    if (await ProfessorRepository.obter({ email })) {
      throw new BusinessException("Error, e-mail já cadastrado!")
    }

    const id = await ProfessorRepository.incluir(professor);

    return new Mensagem('Professor incluido com sucesso!', {
      id,
    });
  }

  async alterar(id: number, professor: Professor) {
    const { nome, email, senha } = professor;

    Validador.validarParametros([{ id }, { nome }, { email }, { senha }]);

    await ProfessorRepository.alterar({ id }, professor);

    return new Mensagem('Professor alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);

    await ProfessorRepository.excluir({ id });

    return new Mensagem('Professor excluido com sucesso!', {
      id,
    });
  }
}
