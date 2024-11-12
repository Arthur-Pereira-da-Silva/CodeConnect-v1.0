
const express   = require('express');
const router    = express.Router();
const Job       = require('../models/Job');


//form da rota de cadastro de vagas
router.get('/add', (req, res) => {
    res.render('add');
})

// rota para detalhar a vaga
router.get('/view/:id', (req, res) => {
    const userRole = req.session.userRole; // tipo do usuário salvo na sessão

    Job.findOne({ where: { id: req.params.id } })
        .then(job => {
            res.render('view', {
                job,
                userRole
            });
        })
        .catch(error => console.log(error));
});

// rota para exibir o formulário de edição de vaga
router.get('/edit/:id', (req, res) => {
    Job.findOne({ where: { id: req.params.id } })
        .then(job => {
            if (!job) {
                return res.status(404).send('Vaga não encontrada');
            }
            res.render('edit', { job });
        })
        .catch(error => console.log(error));
});

// Rota para salvar as alterações da vaga
router.post('/edit/:id', (req, res) => {
    const { title, description, salary, company } = req.body; // captura entrada do formulário

    Job.update(
        { title, description, salary, company },
        { where: { id: req.params.id } }
    )
    .then(() => {
        res.redirect(`/jobs/view/${req.params.id}`); // Redireciona para a página de visualização após a edição
    })
    .catch(error => console.log(error));
});

// Rota para exclusão de vaga
router.post('/delete/:id', (req, res) => {
    Job.destroy({ where: { id: req.params.id } })
        .then(() => {
            res.redirect('/home_recruiter'); // Redireciona para a home do recrutador após a exclusão
        })
        .catch(error => console.log(error));
});

//rota para adicionar vaga
router.post('/add', (req, res) => {
    
    let {title, salary, company, description, email, new_job} = req.body;


    //insert
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    })
    .then(() => res.redirect('/home_recruiter'))
    .catch(error => console.log(error));

});

module.exports = router