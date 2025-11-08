import nodemailer from "nodemailer";

const correoRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { nombre, correo, token } = datos;
  //   Enviar el correo
  await transport.sendMail({
    from: "BienesRaices",
    to: correo,
    subject: "Confirma tu cuenta",
    text: "Confirma tu cuenta",
    html: `
        <p>Hola ${nombre}, confirma tu cuenta en BienesRaices</p>
        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${
      process.env.PORT ?? 3000
    }/auth/confirmar/${token}">Confirmar cuenta</a>
        </p>
        <p>Si tú no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });
};

export { correoRegistro };
