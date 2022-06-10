var path = require('path');

// this will be moved over to heroku
const myusername = 'user1'
const mypassword = 'mypassword'

const index = async (req, res) => {
    var session = req.session;

    if (session.userid) {
        res.sendFile(path.resolve(__dirname, '../public/dashboard.html'))
    } else {
        res.sendFile(path.resolve(__dirname, '../public/login.html'))
    }
}

// TODO: add auth behind this
const admin = async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/admin.html'))
}

const login = async (req, res) => {
    if (req.body.username == myusername && req.body.password == mypassword) {
        var session = req.session;
        session.userid = req.body.username;
        console.log(req.session)

        res.redirect('/');
    } else {
        // make this redirect to root with invalid login message
        res.send('Invalid username or password');
    }
}

const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
};

const adminAuth = async (req, res, next) => {
    const session = req.session;

    if (!session.userid || session.userid != 'admin') {
        return res.status(401).json({errorMessage: 'Unauthorized'})
    }

    next();
}

module.exports = {
    index,
    admin,
    login,
    logout,
    adminAuth
};
