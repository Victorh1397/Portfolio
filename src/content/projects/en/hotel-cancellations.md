---
title: Hotel cancellation prediction
summary: A cancellation classifier over 119,390 bookings, with a 15-algorithm benchmark, data leakage detection and an Optuna-tuned LightGBM that reaches F1 0.85 and ROC-AUC 0.96.
repo: Victorh1397/proyecto-final-ml
areas: [ml]
stack: [scikit-learn, LightGBM, XGBoost, CatBoost, Optuna, TensorFlow, FastAPI, Docker, pandas]
year: 2026
order: 5
context: Machine Learning and Deep Learning · MSc in AI, Cloud Computing and DevOps (Pontia)
team: With Alejandro Aguado
metrics:
  - value: '0.847'
    label: F1 before room assignment
  - value: '0.956'
    label: ROC-AUC of the same model
  - value: '15'
    label: algorithms compared
  - value: '119,390'
    label: bookings in the dataset
diagram:
  caption: First, leak-free data and two scenarios depending on when the prediction is made. Then, from 15 algorithms to a served model.
  lanes:
    - label: Data
      steps:
        - label: Source
          nodes:
            - title: 119,390 bookings
              detail: is_canceled as target
        - label: Cleaning
          nodes:
            - title: Leaks removed
              detail: reservation_status and its date, among others
        - label: Feature sets
          nodes:
            - title: Pre-assignment
              detail: without room_changed
            - title: Post-assignment
              detail: with room_changed
    - label: Modelling
      steps:
        - nodes:
            - title: Benchmark
              detail: 15 algorithms on a sample
        - nodes:
            - title: Finalists
              detail: retrained on the full dataset
        - nodes:
            - title: Optuna
              detail: LightGBM, 24 h in Docker
              accent: true
        - nodes:
            - title: FastAPI service
              detail: one model per scenario
---

## Problem

Predict whether a hotel booking will be cancelled (`is_canceled`), with a reproducible system that trains, evaluates
and compares binary classifiers.

## Approach

My part was **exploratory analysis, initial cleaning and feature engineering**, plus the first experiments with
logistic regression, a decision tree and a random forest. Alejandro reviewed the dataset for leaks, broadened the
range of models, built the FastAPI service and proposed the two inference scenarios.

- **Data leakage.** Using `reservation_status_date` gave an accuracy close to 99.95 %. That field only exists after
  the cancellation, so it was dropped along with `reservation_status` and other administrative columns.
- **Two scenarios depending on when the prediction is made.** Before a room is assigned, the model cannot use
  `room_changed`. Afterwards it can, and gains a little accuracy.
- **A 15-algorithm benchmark** on a sample (from Naive Bayes and KNN to CatBoost and a Keras network), with the
  finalists retrained on the full dataset and a **24-hour Optuna study in Docker** for LightGBM.
- A CLI pipeline with swappable *feature sets* and models served through FastAPI.

## Results

| Scenario | Accuracy | Precision | Recall | F1 | ROC-AUC |
|---|---|---|---|---|---|
| Before room assignment | 0.8849 | 0.8353 | 0.8596 | 0.8473 | 0.9559 |
| After room assignment | 0.8888 | 0.8418 | 0.8625 | 0.8521 | 0.9586 |

In the initial benchmark, LightGBM came first (F1 0.803), ahead of Random Forest, CatBoost and XGBoost. The Keras
neural network landed mid-table (F1 0.722).

## What I learned

99.95 % is not a success: it’s an alarm. The question that decides which features are valid isn’t "does it improve
the metric?" but **"will I have this data at prediction time?"**. Splitting the scenarios by that criterion is what
kept the model honest.
