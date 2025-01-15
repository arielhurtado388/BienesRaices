import nodemailer from "nodemailer";

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, BACKEND_URL } =
  process.env;

const correoRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  const { nombre, correo, token } = datos;

  //   Enviar el correo
  await transport.sendMail({
    from: "BIenesRaices.com",
    to: correo,
    subject: "Confirmar cuenta",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
    <p>Hola ${nombre}, verifica tu cuenta en BienesRaices</p>
    <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirmar cuenta</a>
    </p>
    <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });
};

export { correoRegistro };
