import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import AlunoRouter from './routes/aluno.router';
import AlunoRouterPublic from './routes/aluno.public.router';
import AulaRouter from './routes/aula.router';
import AuthRouter from './routes/auth.router';
import CursoRouter from './routes/curso.router';
import ProfessorRouter from './routes/professor.router';
import ProfessorRouterPublic from './routes/professor.public.router';
import Database from './utils/database/database';
import Exception from './utils/exceptions/exception';
import auth from './utils/middlewares/auth.middleware';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.database();
    this.initMiddlewares();
    this.publicRoutes();
    this.privateRoutes();
    this.endMiddlewares();
  }

  private database() {
    Database.connect().then((r) => console.log('[Database] - Conexão realizada com sucesso'));
  }

  private initMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(logger('dev'));
  }

  private endMiddlewares() {
    this.app.use((err: Exception | Error, req: Request, res: Response, next: NextFunction) => {
      if (err) {
        if (err instanceof Exception) {
          res.status(err.status).json({ message: err.message, status: err.status });
        } else {
          // evite utilizar o Error diretamente. De preferencia para as Exceptions
          res.status(400).json({ message: err.message, status: 400 });
        }
      }
      next();
    });
  }

  // #pegabandeira
  private publicRoutes() {
    const rotasPublic = [AuthRouter, AlunoRouterPublic, ProfessorRouterPublic];
    rotasPublic.forEach((route) => this.app.use("/stefanini", route));
  }

  // #pegabandeira
  private privateRoutes() {
    this.authMiddleware();
    const rotasPrivate = [AlunoRouter, AulaRouter, CursoRouter, ProfessorRouter, AuthRouter]
    rotasPrivate.forEach((route) => this.app.use("/stefanini", route))
  }

  private authMiddleware() {
    this.app.use(auth);
  }
}

export default new App().app;
