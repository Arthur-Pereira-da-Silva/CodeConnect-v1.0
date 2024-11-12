const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Ajuste o caminho se necessário
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// rota Página Principal - mesma ideia da página do recrutador
router.get('/', (req, res) => {
    let search = req.query.job;
    let query = '%' + search + '%';


    // buscar as vagas
    if (!search) {
        Job.findAll({ order: [['createdAt', 'DESC']] })
            .then((jobs) => {
                res.render('index_user', {
                    jobs
                });
            })
            .catch(error => console.log(error));
    } else {
        Job.findAll({
            where: { title: { [Op.like]: query } },
            order: [['createdAt', 'DESC']]
        })
            .then((jobs) => {
                res.render('index_user', {
                    jobs, search
                });
            })
            .catch(error => console.log(error));
    }
});

module.exports = router;
