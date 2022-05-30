const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')

const app = express()

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/assets'));

app.use(cookieParser())

app.use(sessions({
    secret: 'thisisthesecretkeythatneedstobemoved',
    saveUninitialized: true,
    cookie: {expires: new Date(2147483647000)},
    resave: false
}))

// this will be moved over to heroku
const myusername = 'user1'
const mypassword = 'mypassword'

app.get('/', (req, res) => {
    
    var session = req.session;

    if (session.userid) {
        res.sendFile('/pages/dashboard.html', {root:__dirname})
    } else {
        res.sendFile('/pages/login.html', {root:__dirname})
    }
})

app.post('/login',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        var session = req.session;
        session.userid=req.body.username;
        console.log(req.session)

        // goes back to the dashboard
        res.redirect('/');
    }
    else{
        // make this redirect to root with invalid login message
        res.send('Invalid username or password');
    }
})

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

PORT = process.env.PORT | 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bakhti Server running at port ${PORT}`)
})


