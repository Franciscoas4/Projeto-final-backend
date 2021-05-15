import express, { NextFunction, Request, Response } from "express"
import AlunoController from "../controllers/aluno.controller"
import Mensagem from "../utils/mensagem"

const router = express.Router()

router.post(
  "/aluno",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensagem: Mensagem = await new AlunoController().incluir(req.body)
      res.json(mensagem)
    } catch (e) {
      next(e)
    }
  }
)

export default router