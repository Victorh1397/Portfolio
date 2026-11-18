---
title: Predicción de cancelaciones hoteleras
summary: Clasificador de cancelaciones sobre 119.390 reservas, con un benchmark de 15 algoritmos, detección de fugas de información y un LightGBM optimizado con Optuna que llega a F1 0,85 y ROC-AUC 0,96.
repo: Victorh1397/proyecto-final-ml
areas: [ml]
stack: [scikit-learn, LightGBM, XGBoost, CatBoost, Optuna, TensorFlow, FastAPI, Docker, pandas]
year: 2026
order: 5
context: Machine Learning y Deep Learning · Máster en IA, Cloud Computing y DevOps (Pontia)
team: Con Alejandro Aguado
metrics:
  - value: '0,847'
    label: F1 antes de asignar habitación
  - value: '0,956'
    label: ROC-AUC del mismo modelo
  - value: '15'
    label: algoritmos comparados
  - value: '119.390'
    label: reservas en el dataset
diagram:
  caption: Primero, datos sin fugas y dos escenarios según el momento de la predicción. Después, de 15 algoritmos a un modelo servido.
  lanes:
    - label: Datos
      steps:
        - label: Origen
          nodes:
            - title: 119.390 reservas
              detail: is_canceled como objetivo
        - label: Limpieza
          nodes:
            - title: Fugas eliminadas
              detail: reservation_status y su fecha, entre otras
        - label: Feature sets
          nodes:
            - title: Pre-asignación
              detail: sin room_changed
            - title: Post-asignación
              detail: con room_changed
    - label: Modelado
      steps:
        - nodes:
            - title: Benchmark
              detail: 15 algoritmos sobre una muestra
        - nodes:
            - title: Finalistas
              detail: reentrenados con todo el dataset
        - nodes:
            - title: Optuna
              detail: LightGBM, 24 h en Docker
              accent: true
        - nodes:
            - title: API FastAPI
              detail: un modelo por escenario
---

## Problema

Predecir si una reserva hotelera se va a cancelar (`is_canceled`), con un sistema reproducible que entrene, evalúe y
compare modelos de clasificación binaria.

## Enfoque

Mi parte fue el **análisis exploratorio, la limpieza inicial, la ingeniería de características** y los primeros
experimentos con regresión logística, árbol de decisión y random forest. Alejandro revisó el dataset en busca de
fugas, amplió el abanico de modelos, construyó la API en FastAPI y propuso los dos escenarios de inferencia.

- **Fugas de información.** Usar `reservation_status_date` daba una precisión cercana al 99,95 %. Esa variable
  existe solo después de la cancelación, así que se eliminó junto con `reservation_status` y otras columnas administrativas.
- **Dos escenarios según el momento de la predicción.** Antes de asignar habitación, el modelo no puede usar
  `room_changed`. Después, sí, y gana algo de precisión.
- **Benchmark de 15 algoritmos** sobre una muestra (de Naive Bayes y KNN a CatBoost y una red en Keras), los
  finalistas reentrenados con el dataset completo y un estudio de **Optuna de 24 h en Docker** para LightGBM.
- Un pipeline por CLI con *feature sets* intercambiables y modelos servidos por FastAPI.

## Resultados

| Escenario | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Antes de asignar habitación | 0,8849 | 0,8353 | 0,8596 | 0,8473 | 0,9559 |
| Después de asignar habitación | 0,8888 | 0,8418 | 0,8625 | 0,8521 | 0,9586 |

En el benchmark inicial, LightGBM quedó primero (F1 0,803) por delante de Random Forest, CatBoost y XGBoost. La
red neuronal en Keras quedó en la zona media (F1 0,722).

## Qué aprendí

Un 99,95 % no es un éxito: es una alarma. La pregunta que decide qué variables son válidas no es "¿mejora la métrica?",
sino **"¿tendré este dato en el momento de predecir?"**. Separar los escenarios por ese criterio fue lo que hizo
honesto al modelo.
