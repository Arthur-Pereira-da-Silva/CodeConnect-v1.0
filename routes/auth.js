const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');

// rota para renderizar o formulário de registro de usuário
router.get('/register/user', (req, res) => {
    res.render('registerUser'); //view de registro de usuário
});

// rota para renderizar o formulário de registro de recrutador
router.get('/register/recruiter', (req, res) => {
    res.render('registerRecruiter'); //view de registro de recrutador
});

//rota para renderizar a página de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Rota de login
router.post('/login', (req, res) => {
    const { email, password, role } = req.body;

    // escolher o modelo com base no papel do usuário
    const model = role === 'user' ? User : Recruiter; //definir model com base no role

    model.findOne({ where: { email } }) // procura o usuário no bd pelo email
        .then(user => {
            if (!user) {
                return res.status(400).send('Email ou senha incorretos');
            }
            bcrypt.compare(password, user.password, (err, match) => {
                if (match) {
                    req.session.userRole = role; //armazena o papel do usuario na sessão, vai ser utilizado na separação da view
                    req.session.userId = user.id; // armazena o id na sessão, vai ser utilizado para a separação de profiles
                    // autenticação com sucesso
                    if (role === 'user') {
                        // redireciona candidatos para a página principal deles
                        res.redirect('/home_user');
                    } else if (role === 'recruiter') {
                        // redireciona recrutadores para a página deles
                        res.redirect('/home_recruiter');
                    }
                } else {
                    res.status(400).send('Email ou senha incorretos');
                }
            });
        })
        .catch(error => console.log(error));
});


// Rota de cadastro de candidato
router.post('/register/user', (req, res) => {
    const { name, email, password, cpf } = req.body; // captura dados do formulário

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        User.create({
            name,
            email,
            password: hash,
            cpf
        })
        .then(() => res.redirect('/auth/login')) // Redireciona para a página de login após o cadastro
        .catch(error => console.log(error));
    });
});

// Rota de cadastro de recrutador
router.post('/register/recruiter', (req, res) => {
    const { name, email, password, cpf, company } = req.body; // capturar dados do formulário

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;

        Recruiter.create({
            name,
            email,
            password: hash,
            cpf,
            company
        })
        .then(() => res.redirect('/auth/login')) // Redireciona para a página de login após o cadastro
        .catch(error => console.log(error));
    });
});



module.exports = router;
