# 🌾 CropSense – Smart Crop Recommendation System  
A machine learning–powered web application that recommends the **best crop to grow** based on soil and environmental conditions.  

CropSense uses a trained ML model to analyze **Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Humidity, pH, and Rainfall** to suggest the most suitable crop for farming.
<img width="1895" height="976" alt="image" src="https://github.com/user-attachments/assets/bba4fe98-f576-423d-97f3-83fdd53d2390" />
---

## 🚀 Features
- ✅ **ML-based crop prediction** (trained using Random Forest / SVM)  
- 🌤️ **Live weather integration** (optional)  
- 🎨 **Modern UI** using **React + Tailwind CSS**  
- 🔗 **Backend API** using **Flask**  
- 🗂️ **Clean project structure**  
- 🔐 **Environment variables protected (.env)**
  


---

## 📁 Project Structure
```bash
  CropSense/
  │── backend/
  │ ├── app.py
  │ ├── model.pkl
  │ ├── requirements.txt
  │ ├── .env (not included in repo)
  │
  │── frontend/
  │ ├── src/
  │ │ ├── App.jsx
  │ │ ├── components/
  │ │ └── pages/
  │ ├── public/
  │ ├── package.json
  │
  │── README.md
```
---

## 🧠 Machine Learning Model

The model is trained on the **Crop Recommendation Dataset**, using features:

- Nitrogen (N)  
- Phosphorus (P)  
- Potassium (K)  
- Temperature  
- Humidity  
- pH  
- Rainfall  

### 🔍 Algorithm Used  
- **Random Forest Classifier** (Best accuracy)  
- Preprocessed using Normalization & Label Encoding  
<img width="1896" height="977" alt="image" src="https://github.com/user-attachments/assets/49245bef-fae3-42f9-850f-fb6ea954fd68" />

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- Tailwind CSS  
- Axios  

### **Backend**
- Python  
- Flask  
- Scikit-learn  
- NumPy, Pandas  

---
<img width="1899" height="978" alt="image" src="https://github.com/user-attachments/assets/8dbe1614-8677-429c-98a5-eb1fe40e76eb" />
