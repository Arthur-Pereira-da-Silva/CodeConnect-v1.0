const express       = require('express');
const exphbs        = require('express-handlebars');
const app           = express();
const path          = require('path');
const db            = require('./db/connection');
const bodyParser    = require('body-parser');
const Job           = require('./models/Job');
const Sequelize     = require('sequelize');
const Op            = Sequelize.Op;
const session = require('express-session');

const PORT = 3001;

app.listen(PORT, function () {
    console.log(`O Express está rodando na porta ${PORT}`);
});

//body parser = corpo das requisições
app.use(bodyParser.urlencoded({ extended: false }));

// definindo o helper 'eq'
const hbs = exphbs.create({
    helpers: {
        eq: (a, b) => a === b // helper para comparação de igualdade
    },
    
    defaultLayout: 'main', //layout padrão

    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

// handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db.authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
        return db.sync(); // Sincroniza os modelos com o banco de dados
    })
    .then(() => {
        console.log("Tabelas criadas ou já existem");
    })
    .catch(error => {
        console.log("Ocorreu um erro ao conectar", error);
    });

app.use(session({
    secret: 'chave-secreta',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// routes
app.get('/', (req, res) => {
    res.render('login');
});

app.use('/auth', require('./routes/auth'));

app.use('/home_user', require('./routes/home_user'));

app.use('/home_recruiter', require('./routes/home_recruiter'));

app.use('/profile', require('./routes/profile'));

app.use('/jobs', require("./routes/jobs"));