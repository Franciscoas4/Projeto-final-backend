import express, { NextFunction, Request, Response } from 'express';
import ProfessorController from '../controllers/professor.controller';
import Professor from '../entities/professor.entity';
import professorRepository from '../repositories/professor.repository';
import BusinessException from '../utils/exceptions/business.exception';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import Mensagem from '../utils/mensagem';

const router = express.Router();

router.put(
  "/professor/:id",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const professor = await professorRepository.obter({
        email: req.uid.email,
      })
      if (professor.id !== id) {
        throw new UnauthorizedException("Você não pode alterar as informações de outro professor")
      }
      const mensagem: Mensagem = await new ProfessorController().alterar(
        Number(id),
        req.body
      )
      res.json(mensagem)
    } catch (e) {
      next(e)
    }
  }
)

router.delete(
  "/professor/:id",
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (req.uid.tipo !== 1) {
        throw new BusinessException("Somente um professor pode deletar outro professor")
      }
      const mensagem: Mensagem = await new ProfessorController().excluir(
        Number(id)
      )
      res.json(mensagem)
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  "/professor/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const professor: Professor = await new ProfessorController().obterPorId(
        Number(id)
      )
      res.json(professor)
    } catch (e) {
      next(e)
    }
  }
)

router.get(
  "/professor",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const professores: Professor[] = await new ProfessorController().listar()
      res.json(professores)
    } catch (e) {
      next(e)
    }
  }
)

export default router;
