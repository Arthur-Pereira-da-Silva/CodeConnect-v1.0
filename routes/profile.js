const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Recruiter = require('../models/Recruiter');

// middleware para verificar se o usuário está autenticado
function checkAuth(req, res, next) {
    if (!req.session.userRole || !req.session.userId) { // checar variaveis userRole e UserId
        return res.redirect('/auth/login'); // não autenticado
    }
    next();
}

// rota do perfil do usuário
router.get('/user', checkAuth, async (req, res) => {
    const userRole = req.session.userRole; // papel
    const userId = req.session.userId; // Id do usuário da sessão

    // determina o modelo com base no papel do usuário
    const model = userRole === 'user' ? User : Recruiter; 
    const user = await model.findByPk(userId); // procurar usuário no banco de dados pelo id

    if (user) { // encontrou usuário, passa os dados do perfil e o papel
        res.render('profile', { user, userRole });
    } else {
        res.status(404).send('Perfil não encontrado');
    }
});

// rota de edição do perfil do usuário
router.post('/user/edit', checkAuth, async (req, res) => {
    const { name, email, cpf, company, password } = req.body; // dados do usuário
    const userId = req.session.userId;
    const userRole = req.session.userRole;

    const model = userRole === 'user' ? User : Recruiter;
    const updateData = { name, email, cpf }; //dados básicos para atualizar

    if (userRole === 'recruiter') {
        updateData.company = company; // se for um recrutar adiciona o campo "company" para ser atualizado
    }

    if (password) {
        const hash = await bcrypt.hash(password, 10); //hashar a senha
        updateData.password = hash; // adicionar a senha aos dados de atualização
    }

    await model.update(updateData, { where: { id: userId } }); // atualiza os dados daquele usuário
    res.redirect('/profile/user');
});

module.exports = router;
