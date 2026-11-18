---
title: Asistente turístico de Tenerife
summary: Chat sobre una guía turística en PDF. Recupera con ChromaDB, responde con GPT-4.1-mini y tool calling citando la fuente, y ofrece una app en Streamlit montada sobre un paquete Python reutilizable.
repo: Victorh1397/Entrega_Final_LLM
areas: [llm, rag, vector]
stack: [OpenAI API, ChromaDB, Streamlit, PyPDF, jsonschema, Python]
year: 2026
order: 4
context: Large Language Models · Máster en IA, Cloud Computing y DevOps (Pontia)
diagram:
  caption: La guía se indexa una vez. En cada pregunta, el modelo decide mediante tool calling si buscar en ella.
  lanes:
    - label: Ingesta (notebook, una vez)
      offline: true
      steps:
        - nodes:
            - title: Guía en PDF
              detail: TENERIFE.pdf, extraída con PyPDF
        - nodes:
            - title: Chunking
              detail: longitud fija, 200 caracteres de solapamiento
        - nodes:
            - title: Embeddings
              detail: text-embedding-3-small
        - nodes:
            - title: ChromaDB
              detail: persistida en disco
    - label: En cada pregunta (app Streamlit)
      steps:
        - label: Entrada
          nodes:
            - title: Chat
              detail: historial de 10 turnos, máx. 1000 caracteres
        - label: Orquestación
          nodes:
            - title: GPT-4.1-mini
              detail: tool calling, máximo 5 rondas
              accent: true
        - label: Herramientas
          nodes:
            - title: search_tenerife_info
              detail: top-k fragmentos de ChromaDB
            - title: get_weather
              detail: clima simulado
        - label: Respuesta
          nodes:
            - title: Respuesta con fuente
              detail: el modelo redacta con el contexto y cita el chunk
---

## Problema

Responder preguntas sobre turismo en Tenerife usando solo una guía en PDF, de forma que el asistente cite de dónde
sale cada dato y diga explícitamente cuándo la guía no lo cubre.

## Enfoque

El proyecto pasa por tres etapas, cada una construida sobre la anterior:

1. **Notebook de exploración**: extracción del PDF, *chunking* con solapamiento, embeddings
   `text-embedding-3-small` y una colección ChromaDB persistida en disco.
2. **Paquete `tenerife_rag`**: la lógica del notebook refactorizada en módulos (`config`, `vector_store`, `tools`,
   `tool_loop`) que se pueden importar y probar por separado.
3. **App en Streamlit**: un chat multiturno que reutiliza el paquete y la base ya persistida, sin volver a ingerir el PDF.

**Tool calling en lugar de un framework de agentes.** El asistente solo necesita dos capacidades:
`search_tenerife_info` (búsqueda en la guía) y `get_weather` (un clima simulado). Un bucle propio de como máximo
5 rondas, con argumentos validados contra JSON Schema (`strict: true`) y un registro de cada ejecución, da más control,
menos latencia y una depuración más simple que añadir LangChain o AutoGen.

Además: `temperature` 0,2 para pegarse al contexto, historial limitado a 10 turnos, validación de la entrada
(máximo 1000 caracteres) y saneado de la respuesta para quitar los logs técnicos sin perder la atribución de fuentes.

## Resultados

- Respuestas basadas en la guía, cada una con su atribución (`Fuente: TENERIFE.pdf (chunk N, score S)`), y una
  negativa explícita cuando el dato no está.
- Selección correcta de la herramienta según la pregunta.
- Conversación multiturno coherente: resuelve referencias como "¿y qué se come ahí?" después de hablar del Teide.
- Errores de argumentos capturados sin interrumpir la sesión.

## Qué aprendí

Que la mejor arquitectura de agentes a veces es no tenerla. Para dos herramientas y un dominio acotado, un bucle
de tool calling explícito es más predecible y barato. Y que un notebook demuestra que algo funciona, pero solo un
paquete con fronteras claras permite reutilizarlo.

Queda pendiente, y está documentado como limitación, una evaluación formal (RAGAS o un juez LLM) que mida la
*faithfulness* y la relevancia con números.
