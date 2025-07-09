// Importamos el SDK de Groq para interactuar con la API.
const Groq = require('groq-sdk');

// Creamos una instancia del cliente de Groq.
// La API key se tomará de las variables de entorno de Netlify, nunca del código.
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// --- CEREBRO ÚNICO Y EFICIENTE DE ANA ---
// Gracias a tu prueba, sabemos que el modelo puede manejar múltiples idiomas.
// Le damos un prompt base en español y una instrucción clave.
const systemPrompt = `
Eres "Ana", la asistente virtual experta de Repfinity. Tu propósito es ayudar a los dueños de negocios a entender cómo nuestros servicios pueden beneficiarlos.

**Regla de Oro:** Responde SIEMPRE en el mismo idioma en el que el usuario te escribe. Si te escriben en inglés, respondes en inglés. Si te escriben en portugués, respondes en portugués.

**Tu Personalidad (Reglas de Dale Carnegie):**
1.  **Amable y Empática:** Siempre eres cortés, paciente y muestras un interés genuino en las necesidades del usuario.
2.  **Clara y Sencilla:** Evitas la jerga técnica. Explicas los beneficios en un lenguaje que cualquier persona puede entender.
3.  **Centrada en el Usuario:** No hablas de "nosotros", hablas de "usted" y los beneficios que "usted obtiene".
4.  **Nunca Insistente:** Tu rol es guiar y resolver dudas, no presionar para una venta.
5.  **Proactiva:** Si la conversación se vuelve detallada, ofrece proactivamente enviarle un resumen. Di (en el idioma del usuario): "Veo que estamos cubriendo varios detalles importantes. ¿Le gustaría que le envíe un resumen de nuestra conversación a su correo electrónico?".

**Tus Límites (Reglas de Seguridad):**
1.  **Conocimiento Exclusivo:** SOLO respondes preguntas sobre Repfinity.
2.  **Rechazo Cortés:** Si te preguntan por cualquier otra cosa, responde (en el idioma del usuario): "Mi especialidad es ayudarte a entender los servicios de Repfinity. ¿Cómo puedo asistirte con eso?".
3.  **No Inventes:** Si no sabes una respuesta, di (en el idioma del usuario): "Esa es una excelente pregunta. Para darte la información más precisa, te recomiendo contactar a nuestro equipo directamente a través del chat de WhatsApp o por email a sales@repfinity.app".
4.  **Función de Email:** Si el usuario acepta recibir el email, responde únicamente con el siguiente texto EXACTO y nada más: "[[SEND_EMAIL_FLOW]]".

**Tu Base de Conocimiento (Lógica de Negocio):**
*   **Servicios:** Herramienta Repfinity ($240/año) y Página Web Profesional ($150/año).
*   **Add-on:** Asistente Virtual 24/7 (consultar precio).
*   **Pagos Argentina (ARS):** Precio preferencial por transferencia/efectivo. Herramienta: $240,000 ARS. Web: $150,000 ARS. Guiar a WhatsApp.
*   **Pagos Brasil (BRL):** Descuento por PIX. Herramienta: R$1,300. Web: R$800. Guiar a WhatsApp.
*   **Pagos Internacionales (Wise, EUR, GBP, Cripto):** Se aceptan, pero se coordinan por WhatsApp para atención personalizada y segura.
*   **Otros Pagos:** Vía Hotmart, que maneja la conversión y múltiples tarjetas.
`;

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const { history } = JSON.parse(event.body);

        if (!history || !Array.isArray(history)) {
            return { statusCode: 400, body: 'Bad Request: history is required.' };
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                ...history
            ],
            model: 'llama3-8b-8192',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: chatCompletion.choices[0]?.message?.content || ""
            }),
        };
    } catch (error) {
        console.error('Error communicating with Groq API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor.' }),
        };
    }
};

