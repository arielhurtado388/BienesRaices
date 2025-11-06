const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
  });
};

const formularioOlvide = (req, res) => {
  res.render("auth/olvide", {
    pagina: "Olvidé mi contraseña",
  });
};

export { formularioLogin, formularioRegistro, formularioOlvide };
