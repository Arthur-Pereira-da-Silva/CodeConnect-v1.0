const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Ajuste o caminho se necessário
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// rota Página Principal
router.get('/', (req, res) => {
    let search = req.query.job; // obter termo de pesquisa do parâmetro de consulta (query) da URL, se houver
    let query = '%' + search + '%'; // criar uma string de consulta com "%" ao redor do termo de pesquisa para buscar no bd correspondências parciais


    // buscar as vagas
    if (!search) {
        Job.findAll({ order: [['createdAt', 'DESC']] })
            .then((jobs) => {
                res.render('index_recruiter', { // sem termo de pesquisa, mostra todas as vagas
                    jobs
                });
            })
            .catch(error => console.log(error));
    } else {
        Job.findAll({
            where: { title: { [Op.like]: query } }, // com termo de pesquisa, utilizando o like busca vagas associadas
            order: [['createdAt', 'DESC']]
        })
            .then((jobs) => {
                res.render('index_recruiter', {
                    jobs, search
                });
            })
            .catch(error => console.log(error));
    }
});

module.exports = router;
