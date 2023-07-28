function redirectIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/admin"); // Cambiar "/admin" por la ruta a donde se quiere redirigir al usuario. También se puede dejar como está.
  } else {
    return next();
  }
}

module.exports = redirectIfAuthenticated;
