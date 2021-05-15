import Aluno from '../entities/aluno.entity';
import AlunoRepository from '../repositories/aluno.repository';
import cursoRepository from '../repositories/curso.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import Mensagem from '../utils/mensagem';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async obterPorId(id: number): Promise<Aluno> {
    Validador.validarParametros([{ id }]);
    return await AlunoRepository.obterPorId(id);
  }

  async obter(filtro: FilterQuery<Aluno> = {}): Promise<Aluno> {
    return await AlunoRepository.obter(filtro);
  }

  // #pegabandeira
  async listar(filtro: FilterQuery<Aluno> = {tipo: 2}): Promise<Aluno[]> {
    const alunos = await AlunoRepository.listar(filtro)

    for (const aluno of alunos) {
      aluno.cursos = await cursoRepository.listar({
        idAluno: aluno.id,
      })
    }
    return alunos
  }

  // #pegabandeira
  async incluir(aluno: Aluno) {
    const { nome, formacao, idade, email, senha } = aluno;
    Validador.validarParametros([{ nome }, { formacao }, { idade }, { email }, { senha }]);
    aluno.tipo = 2

    if (await AlunoRepository.obter({ email })) {
      throw new BusinessException("Error, Já existe um aluno com esse e-mail cadastrado")
    }

    return new Mensagem("Aluno inserido com sucesso!", {
      id: await AlunoRepository.incluir(aluno),
    })
  }

  async alterar(id: number, aluno: Aluno) {
    Validador.validarParametros([{ id }]);
    await AlunoRepository.alterar({ id }, aluno);
    return new Mensagem('Aluno alterado com sucesso!', {
      id,
    });
  }

  async excluir(id: number) {
    Validador.validarParametros([{ id }]);
    await AlunoRepository.excluir({ id });
    return new Mensagem('Aluno excluido com sucesso!', {
      id,
    });
  }
}
