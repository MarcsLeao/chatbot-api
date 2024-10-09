export const resetPasswordEmailHtml = `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="background-color: rgb(228, 228, 228); padding: 50px; font-family: Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <tr>
              <td align="center" bgcolor="#006eff" style="padding: 20px; border-radius: 8px 8px 0 0;">
                <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Recuperar Senha de Usuário</h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.5;">
                <p>Olá!</p>
                <p>Caso você tenha solicitado para recuperar a senha de usuário. Por favor, clique no link abaixo:</p>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding: 20px;">
                      <a href="{verificationLink}" style="background-color: #006eff; color: #ffffff; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                        Recuperar Minha Senha Agora
                      </a>
                    </td>
                  </tr>
                </table>
                <p>Se não solicitou isso, ignore este e-mail.</p>
                <p>Atenciosamente,<br>Treat Dental</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`