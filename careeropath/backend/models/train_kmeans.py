import numpy as np
from sklearn.cluster import KMeans
import joblib
import os

out_path = os.path.join(os.path.dirname(__file__), "kmeans.pkl")

# UPDATE THIS: Use the exact number of questions you have (10)
n_clusters = 3
n_samples = 1000
n_features = 10  # MUST match your actual number of questions

X = []
for i in range(n_samples):
    cluster = np.random.randint(0, n_clusters)
    center = np.random.rand(n_features) + cluster * 2
    sample = center + np.random.normal(scale=0.5, size=n_features)
    X.append(sample)
X = np.vstack(X)

kmeans = KMeans(n_clusters=n_clusters, random_state=42)
kmeans.fit(X)
joblib.dump(kmeans, out_path)
print("Saved model to", out_path)