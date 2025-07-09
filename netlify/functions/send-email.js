// Importamos el SDK de Resend para interactuar con la API.
const { Resend } = require('resend');

// Creamos una instancia del cliente de Resend.
// La API key se tomará de las variables de entorno de Netlify.
const resend = new Resend(process.env.RESEND_API_KEY);

// El dominio verificado en tu cuenta de Resend.
const fromEmail = 'info@repfinity.app'; // Usamos un email genérico y profesional.

// Esta es la función serverless de Netlify.
exports.handler = async function(event) {
    // Solo permitimos peticiones POST.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Obtenemos los datos del cuerpo de la petición.
        const { to, subject, htmlContent } = JSON.parse(event.body);

        // Validación básica para asegurar que los datos necesarios están presentes.
        if (!to || !subject || !htmlContent) {
            return { statusCode: 400, body: 'Bad Request: to, subject, and htmlContent are required.' };
        }

        // Creamos y enviamos el email usando Resend.
        const { data, error } = await resend.emails.send({
            from: `Ana de Repfinity <${fromEmail}>`,
            to: [to],
            subject: subject,
            html: htmlContent,
        });

        // Si hay un error en el envío, lo registramos y devolvemos un error.
        if (error) {
            console.error('Resend API Error:', error);
            return { statusCode: 500, body: JSON.stringify({ error: 'Error al enviar el email.' }) };
        }

        // Si el envío es exitoso, devolvemos una respuesta positiva.
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email enviado exitosamente.', data }),
        };
    } catch (error) {
        console.error('Server Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor.' }),
        };
    }
};
