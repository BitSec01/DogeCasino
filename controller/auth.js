module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  }else{
    res.render('login');
  }
}