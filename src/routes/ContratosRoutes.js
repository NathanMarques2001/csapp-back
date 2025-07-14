const express = require("express");
const ContratoController = require("../controllers/ContratoController.js");
const authMiddleware = require("../middlewares/auth.js");
const upload = require("../middlewares/upload.js"); // novo

const router = express.Router();

router.use(authMiddleware);

router.get("/", ContratoController.indexAll);
router.get("/:id", ContratoController.index);
router.get("/cliente/:id", ContratoController.indexClient);
router.get("/vendedor/:id", ContratoController.indexVendedor);
router.post("/", ContratoController.store);
router.put("/:id", ContratoController.update);

router.post(
  "/importar-excel",
  upload.single("file"), // nome do campo do form frontend
  ContratoController.importarContratosExcel
);

// router.delete("/:id", ContratoController.delete);

module.exports = router;
