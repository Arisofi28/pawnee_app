import { Router } from "express";
import { generar } from "../controllers/generarCriatura.controller";

export const generarCriaturaRouter = Router();

generarCriaturaRouter.post("/", generar);
