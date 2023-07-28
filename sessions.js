/**
 * Este archivo se creó para centralizar el código referente a las sesiones.
 *
 * Su nombre es arbitrario, aunque tenía sentido llamarle `sessions.js`.
 *
 * Se lo colocó en la raíz del proyecto, aunque otra opción válida podría haber
 * sido colocarlo en una carpeta que contenga archivos de configuración, por
 * ejemplo, llamada `/config`.
 */

const session = require("express-session");
const flash = require("express-flash");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      name: "twitter_session", // Por defecto la cookie se llama "connect.id"
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // Por defecto es null (la cookie no expira). Valor en milisegundos.
        secure: false, // La opción `true` requiere HTTPS.
        httpOnly: true,
      },
    }),
  );

  app.use(flash());
};
