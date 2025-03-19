import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.model_selection import RandomizedSearchCV
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# Load the preprocessed data
X_train = pd.read_csv("X_train.csv")
y_train = pd.read_csv("y_train.csv").squeeze()
X_test = pd.read_csv("X_test.csv")
y_test = pd.read_csv("y_test.csv").squeeze()

# 1. Random Forest with Hyperparameter Tuning
param_grid = {
    'n_estimators': [100, 200, 300, 400],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2'],
    'class_weight': ['balanced', 'balanced_subsample']
}

rf = RandomForestClassifier(random_state=42)
random_search = RandomizedSearchCV(
    rf, 
    param_grid, 
    n_iter=20,
    scoring='f1',
    cv=3,
    n_jobs=-1,
    verbose=2,
    random_state=42
)

print("Training Random Forest with hyperparameter tuning...")
random_search.fit(X_train, y_train)

# Evaluate tuned Random Forest
y_pred_rf = random_search.best_estimator_.predict(X_test)
print("\nTuned Random Forest Results:")
print("Best parameters:", random_search.best_params_)
print("\nClassification Report:")
print(classification_report(y_test, y_pred_rf))
print("ROC AUC Score:", roc_auc_score(y_test, y_pred_rf))

# Save tuned Random Forest model
joblib.dump(random_search.best_estimator_, "tuned_rf_model.pkl")
print("Tuned Random Forest model saved as tuned_rf_model.pkl")

# 2. XGBoost Model
print("\nTraining XGBoost model...")
xgb = XGBClassifier(
    scale_pos_weight=len(y_train[y_train == 0]) / len(y_train[y_train == 1]),
    learning_rate=0.01,
    n_estimators=300,
    max_depth=7,
    min_child_weight=1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    use_label_encoder=False,
    eval_metric="logloss"
)

xgb.fit(X_train, y_train)

# Evaluate XGBoost
y_pred_xgb = xgb.predict(X_test)
print("\nXGBoost Results:")
print("Classification Report:")
print(classification_report(y_test, y_pred_xgb))
print("ROC AUC Score:", roc_auc_score(y_test, y_pred_xgb))

# Save XGBoost model
joblib.dump(xgb, "xgboost_model.pkl")
print("XGBoost model saved as xgboost_model.pkl")

# Compare and select the best model based on F1-score instead of recall
rf_f1 = classification_report(y_test, y_pred_rf, output_dict=True)['1']['f1-score']
xgb_f1 = classification_report(y_test, y_pred_xgb, output_dict=True)['1']['f1-score']

print("\nModel Comparison:")
print(f"Random Forest F1-Score for Fraud: {rf_f1:.3f}")
print(f"XGBoost F1-Score for Fraud: {xgb_f1:.3f}")

# Save the better model as the primary model
if xgb_f1 > rf_f1:
    joblib.dump(xgb, "fraud_detection_model.pkl")
    print("\nXGBoost selected as primary model (fraud_detection_model.pkl)")
else:
    joblib.dump(random_search.best_estimator_, "fraud_detection_model.pkl")
    print("\nTuned Random Forest selected as primary model (fraud_detection_model.pkl)") 