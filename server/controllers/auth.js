var path = require("path");

// this will be moved over to heroku
const myusername = "user1";
const mypassword = "mypassword";

const index = async (req, res) => {
  var session = req.session;

  if (session.userid) {
    res.sendFile(path.resolve(__dirname, "../public/dashboard.html"));
  } else {
    res.sendFile(path.resolve(__dirname, "../public/login.html"));
  }
};


const admin = async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/admin.html'))
}

const adminOLD = async (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/dashboard.html'))
}

const login = async (req, res) => {
  try {
    console.log('Login attempt ' + JSON.stringify(req.body))

    if (req.body.username == req.body.password) {
      var session = req.session;
      session.userid = req.body.username;
      console.log(req.session);
  
      res.redirect("/");
    } else {
      res.send("Invalid username or password");
    }
  } catch (err) {
    console.log(error)
    return res.status(400).json({'error': 'exception thrown'})
  }
};

const logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const adminAuth = async (req, res, next) => {
  const session = req.session;

    if (!session.userid || session.userid != 'admin') {
        return res.status(401).json({'error': 'Unauthorized'})
    }

  next();
};

const dashboard = async (req, res, next) => {
    const session = req.session;
    if (!session.userid || (session.userid != 'admin' && session.userid != 'student')) {
        return res.status(401).json({'error': 'Unauthorized'})
    }

    next();
}

const clientAuth = async (req, res, next) => {
    
    authorization = req.headers['authorization']

    if (authorization == undefined)
        return res.status(401).json({'error': 'missing authorization'})

    if (authorization.split(' ')[1] != 'TEMPPASSWORD')
        return res.status(401).json({'error': 'admin password incorrect'})

    next();
}

module.exports = {
    index,
    admin,
    login,
    logout,
    dashboard,
    adminAuth,
    clientAuth,
    adminOLD
};






