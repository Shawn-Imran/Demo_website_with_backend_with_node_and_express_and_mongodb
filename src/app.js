const express = require('express');
const app = express();
const path = require('path');
const hbs = require("hbs");
const Register = require('./models/register')
require("./db/conn")

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) =>{
    res.render('index');
});

app.get('/register', (req, res) =>{
    res.render('register');
});

app.post('/register', async (req, res) =>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirm_password;

        if (password===cpassword) {
            const registeremploy = new Register({
                fullname: req.body.fullname,
                gender: req.body.gender,
                age: req.body.age,
                email: req.body.email,
                password: password,
                confirm_password: cpassword
            })
            const register = await registeremploy.save();
            res.status(201).render("login");
        } else {
            res.send('password are not matching');
        }

    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/login', (req, res) =>{
    res.render('login');
});

app.post('/login', async (req, res) =>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const useremail = await Register.findOne({email:email});
        if (useremail.password===password) {
           res.status(201).render("index");
        } else {
            res.status(400).send('Unable to sign in');
        }
    } catch (error) {
        res.status(400).send("unable to sign in");
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });