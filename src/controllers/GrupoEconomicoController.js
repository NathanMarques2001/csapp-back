const GrupoEconomico = require("../models/GrupoEconomico");

module.exports = {
  async index(req, res) {
    try {
      const { id } = req.params;

      const grupoEconomico = await GrupoEconomico.findByPk(id);

      if (!grupoEconomico) {
        return res
          .status(404)
          .send({ message: "Grupo econômico não encontrado!" });
      }

      return res.status(200).send({ grupoEconomico });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar o grupo econômico." });
    }
  },

  async indexAll(req, res) {
    try {
      const grupoEconomico = await GrupoEconomico.findAll({
        order: [["nome", "ASC"]],
      });

      if (grupoEconomico.length == 0) {
        return res.status(404).send({ message: "Nenhum segmento cadastrado!" });
      }

      return res.status(200).send({ grupoEconomico });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao buscar os grupos econômicos." });
    }
  },

  async store(req, res) {
    try {
      const { nome, id_usuario, nps, id_segmento } = req.body;

      const tipo = "c";

      const grupoEconomico = await GrupoEconomico.create({
        nome,
        id_usuario,
        nps,
        id_segmento,
        tipo,
      });

      return res.status(201).send({
        message: "Grupo econômico criado com sucesso!",
        grupoEconomico,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao criar o grupo econômico." });
    }
  },

  async update(req, res) {
    try {
      const { nome, id_usuario, nps, id_segmento, status } = req.body;
      const { id } = req.params;

      const grupoEconomico = await GrupoEconomico.findByPk(id);

      if (!grupoEconomico) {
        return res
          .status(404)
          .send({ message: "Grupo econômico não encontrado!" });
      }

      await GrupoEconomico.update(
        { nome, id_usuario, nps, id_segmento, status },
        { where: { id: id } },
      );

      return res.status(200).send({ message: "Grupo econômico com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ message: "Ocorreu um erro ao atualizar o grupo econômico." });
    }
  },

  // async delete(req, res) {
  //   try {
  //     const { id } = req.params;

  //     const grupoEconomico = await GrupoEconomico.findByPk(id);

  //     if (!grupoEconomico) {
  //       return res.status(404).send({ message: 'Grupo econômico não encontrado!' });
  //     }

  //     await GrupoEconomico.destroy({ where: { id: id } });

  //     return res.status(200).send({ message: 'Grupo econômico deletado com sucesso!' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).send({ message: 'Ocorreu um erro ao deletar o grupo econômico.' });
  //   }
  // }
};
