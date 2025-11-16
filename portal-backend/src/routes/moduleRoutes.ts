import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { listModules, listModuleRecords, getModuleRecord, updateModuleRecord } from "../services/moduleService.js";

export const moduleRouter = Router();

moduleRouter.use(authMiddleware);

moduleRouter.get("/", (_req, res) => {
  res.json({ modules: listModules() });
});

moduleRouter.get("/:module/:id", async (req, res, next) => {
  const { module, id } = req.params;
  try {
    const record = await getModuleRecord(module, id);
    res.json({ record });
  } catch (error) {
    next(error);
  }
});

moduleRouter.put("/:module/:id", async (req, res, next) => {
  const { module, id } = req.params;
  try {
    const record = await updateModuleRecord(module, id, req.body as Record<string, unknown>);
    res.json({ record });
  } catch (error) {
    next(error);
  }
});

moduleRouter.get("/:module", async (req, res, next) => {
  const { module } = req.params;
  const page = parseInt((req.query.page as string) || "1", 10);
  const pageSize = parseInt((req.query.pageSize as string) || "20", 10);
  const search = (req.query.search as string) || undefined;

  try {
    const result = await listModuleRecords(module, page, pageSize, search);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
