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

  await transport.sendMail({
    from: "BienesRaices <noreply@arielhurtado.online>",
    to: correo,
    subject: "Confirma tu cuenta - BienesRaices",
    text: "Confirma tu cuenta - BienesRaices",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #4f46e5; padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px; }
          .content { padding: 40px 30px; color: #374151; }
          .content h2 { color: #1f2937; font-size: 24px; margin: 0 0 16px 0; font-weight: 600; }
          .content p { line-height: 1.6; margin: 0 0 16px 0; font-size: 16px; color: #6b7280; }
          .button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
          .button:hover { background-color: #4338ca; }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 8px 0; }
          .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 24px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienes<span style="font-weight: 400;">Raíces</span></h1>
            <p>Tu plataforma de confianza para propiedades</p>
          </div>
          
          <div class="content">
            <h2>Bienvenido, ${nombre}</h2>
            <p>Gracias por unirte a BienesRaices. Estamos emocionados de tenerte con nosotros.</p>
            <p>Para completar tu registro y comenzar a publicar tus propiedades, solo necesitas confirmar tu cuenta:</p>
            
            <div style="text-align: center;">
              <a href="${
                process.env.BACKEND_URL
              }/auth/confirmar/${token}" class="button">
                Confirmar mi cuenta
              </a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #9ca3af;">
              Si no creaste esta cuenta, puedes ignorar este mensaje de forma segura.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>BienesRaices</strong></p>
            <p>© ${new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

const correoReestablecer = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { nombre, correo, token } = datos;

  await transport.sendMail({
    from: "BienesRaices <noreply@arielhurtado.online>",
    to: correo,
    subject: "Reestablece tu contraseña - BienesRaices",
    text: "Reestablece tu contraseña en BienesRaices",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #4f46e5; padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px; }
          .content { padding: 40px 30px; color: #374151; }
          .content h2 { color: #1f2937; font-size: 24px; margin: 0 0 16px 0; font-weight: 600; }
          .content p { line-height: 1.6; margin: 0 0 16px 0; font-size: 16px; color: #6b7280; }
          .button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
          .button:hover { background-color: #4338ca; }
          .alert { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 24px 0; }
          .alert p { margin: 0; color: #92400e; font-size: 14px; }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 8px 0; }
          .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 24px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienes<span style="font-weight: 400;">Raíces</span></h1>
            <p>Tu plataforma de confianza para propiedades</p>
          </div>
          
          <div class="content">
            <h2>Recuperación de contraseña</h2>
            <p>Hola ${nombre},</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en BienesRaices.</p>
            
            <div style="text-align: center;">
              <a href="${
                process.env.BACKEND_URL
              }/auth/olvide/${token}" class="button">
                Restablecer contraseña
              </a>
            </div>
            
            <div class="alert">
              <p><strong>Este enlace expirará pronto</strong></p>
              <p>Por seguridad, este enlace solo será válido por un tiempo limitado.</p>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 14px; color: #9ca3af;">
              Si no solicitaste este cambio, puedes ignorar este mensaje de forma segura. Tu contraseña actual permanecerá sin cambios.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>BienesRaices</strong></p>
            <p>© ${new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

const correoNuevoMensaje = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const {
    nombreVendedor,
    correoVendedor,
    nombreInteresado,
    tituloPropiedad,
    mensaje,
    urlPropiedad,
  } = datos;

  await transport.sendMail({
    from: "BienesRaices <noreply@arielhurtado.online>",
    to: correoVendedor,
    subject: "Nuevo mensaje sobre tu propiedad - BienesRaices",
    text: "Tienes un nuevo mensaje sobre tu propiedad",
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background-color: #4f46e5; padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .header p { color: #e0e7ff; margin: 8px 0 0 0; font-size: 14px; }
          .content { padding: 40px 30px; color: #374151; }
          .content h2 { color: #1f2937; font-size: 24px; margin: 0 0 16px 0; font-weight: 600; }
          .content p { line-height: 1.6; margin: 0 0 16px 0; font-size: 16px; color: #6b7280; }
          .button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
          .button:hover { background-color: #4338ca; }
          .mensaje-box { background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 6px; margin: 24px 0; }
          .mensaje-box p { margin: 0; color: #374151; font-size: 14px; line-height: 1.6; }
          .propiedad-info { background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0; }
          .propiedad-info p { margin: 4px 0; font-size: 14px; color: #6b7280; }
          .propiedad-info strong { color: #1f2937; }
          .footer { background-color: #f9fafb; padding: 30px; text-align: center; color: #9ca3af; font-size: 14px; border-top: 1px solid #e5e7eb; }
          .footer p { margin: 8px 0; }
          .divider { height: 1px; background: linear-gradient(to right, transparent, #e5e7eb, transparent); margin: 24px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienes<span style="font-weight: 400;">Raíces</span></h1>
            <p>Tu plataforma de confianza para propiedades</p>
          </div>
          
          <div class="content">
            <h2>Nuevo mensaje recibido</h2>
            <p>Hola ${nombreVendedor},</p>
            <p>Tienes un nuevo mensaje de <strong>${nombreInteresado}</strong> sobre tu propiedad:</p>
            
            <div class="propiedad-info">
              <p><strong>Propiedad:</strong> ${tituloPropiedad}</p>
            </div>

            <div class="mensaje-box">
              <p><strong>Mensaje:</strong></p>
              <p style="margin-top: 8px;">${mensaje}</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${urlPropiedad}" class="button">
                Ver todos los mensajes
              </a>
            </div>            
          </div>
          
          <div class="footer">
            <p><strong>BienesRaices</strong></p>
            <p>© ${new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
};

export { correoRegistro, correoReestablecer, correoNuevoMensaje };
