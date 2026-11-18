---
title: Vicky, asistente de voz para una clínica
summary: Agenda citas médicas y responde dudas de pacientes hablando. Usa Dialogflow, un webhook en FastAPI y Gemini sobre documentos procesados con OCR, y no inventa cuando no sabe.
repo: Victorh1397/Chat-Grupo-Medico-Visoria
areas: [voice, llm, rag, vector]
stack: [Dialogflow ES, FastAPI, Gemini, FAISS, OCR, SSML, Telegram, Python]
year: 2026
order: 2
context: Herramientas de IA Clásica · Máster en IA, Cloud Computing y DevOps (Pontia)
team: Con Lucia Mateo
demo: https://www.loom.com/share/c8feadcc5a224d9badd42c9ce93e4c14
metrics:
  - value: 9/9
    label: preguntas sin respuesta en los documentos, sin alucinar
  - value: 18/18
    label: respuestas correctas con base vectorial
  - value: 2,1 s
    label: mediana por turno en una conversación hablada
  - value: '313'
    label: tests automáticos
diagram:
  caption: Un turno hablado hace un solo viaje. El OCR y el índice se preparan antes, fuera de línea.
  lanes:
    - label: En cada turno
      steps:
        - label: Canales
          nodes:
            - title: Voz
              detail: micrófono, fin por silencio
            - title: Telegram
              detail: mensajes y botones
        - label: Diálogo
          nodes:
            - title: Dialogflow ES
              detail: STT y TTS nativos, 13 intenciones
        - label: Reglas
          nodes:
            - title: Webhook FastAPI
              detail: cédula con regex, agenda, SSML
              accent: true
        - label: Recuperación
          nodes:
            - title: FAISS
              detail: fragmentos más cercanos a la pregunta
        - label: Respuesta
          nodes:
            - title: Gemini
              detail: solo con los documentos, o NO_DISPONIBLE
    - label: Fuera de línea, una vez
      offline: true
      steps:
        - nodes:
            - title: Documentos D1–D5
              detail: JPG escaneados, ficticios
        - nodes:
            - title: OCR Tesseract
              detail: español, con preprocesado
        - nodes:
            - title: Regex
              detail: validación de precios y horarios
        - nodes:
            - title: Índice
              detail: fragmentos y embeddings, se carga al arrancar
figures:
  - src: ../../../assets/projects/vicky/tarifario.jpg
    alt: Documento escaneado ficticio "Tarifario de consultas" de Grupo Médico Visoria, con una tabla de especialidades, médicos y precios en dólares.
    caption: Uno de los cinco documentos ficticios que el pipeline lee con OCR. Vicky responde solo con lo que contienen.
---

## Problema

La recepción de una clínica, Grupo Médico Visoria (seis especialidades y doce médicos), atiende por
teléfono dos tipos de llamada: pedir cita y hacer preguntas frecuentes sobre precios, horarios, seguros o cómo
llegar. Vicky resuelve las dos **por voz**. En un contexto sanitario, una respuesta inventada es peor que no
responder. Todos los datos de la clínica, los médicos y los pacientes son ficticios.

## Enfoque

Una petición hablada hace un solo viaje:

1. El cliente de voz graba hasta detectar silencio y envía el audio a Dialogflow, que lo transcribe y clasifica la intención.
2. Un **webhook en FastAPI** aplica las reglas de la clínica: valida la cédula con regex en dos niveles, respeta el
   horario real de cada médico, reconoce a los pacientes que ya se atendieron y les propone a su mismo médico.
3. Para las preguntas frecuentes, el webhook recupera de un índice **FAISS** los fragmentos más cercanos de cinco
   documentos de la clínica, leídos previamente con OCR, y envía solo esos fragmentos a **Gemini**.
4. La respuesta vuelve como SSML y Dialogflow la sintetiza.

El OCR y la indexación se ejecutan una vez, fuera de línea, y nunca dentro de una petición.

**Control de alucinaciones en tres capas:** instrucciones estrictas (solo los documentos, sin consejo médico, la
pregunta se trata como dato y nunca como instrucción), una señal `NO_DISPONIBLE` que el modelo devuelve cuando el dato
no está y que el webhook convierte en un mensaje estándar, y una red de seguridad que detecta las negativas que el
modelo redacta por su cuenta.

También funciona en Telegram con botones, y permite consultar el historial, cancelar una cita, corregir un dato
sin repetir los demás y pasar con una persona.

## Resultados

- **17/18** respuestas correctas con Gemini real en la evaluación documental, y **9/9** preguntas no respondibles
  rechazadas sin inventar, incluidos intentos de manipulación ("ignora tus instrucciones…") y peticiones de consejo médico.
- Con la base vectorial: **18/18 y 9/9**, con una mediana de 1,00 s por respuesta.
- Por el canal de voz real, turnos de 1,85 a 3,24 s. En una conversación modelo de 10 turnos: mediana de 2,1 s y
  ningún turno por encima de 5 s.
- OCR con una similitud media del 99,8 %; 12/12 precios y 12/12 horarios validados.
- 313 tests automáticos, sin red, y `ruff` sin avisos.

## Qué aprendí

Medir antes de suponer. La base vectorial no mejoró la precisión frente a enviar el texto completo (las dos
llegaron a 18/18) y añadió unos 0,26 s de mediana. Su valor está en escalar a más documentos, no en este volumen.

También, que las reglas defensivas pueden romper respuestas correctas. La primera versión de la red de seguridad
buscaba negativas en toda la respuesta y anulaba frases válidas como "si su seguro no aparece, puede pedir el
reembolso". Limitarla a la primera frase lo resolvió.
