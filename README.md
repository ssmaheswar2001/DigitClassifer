# Digit Classifier Web App

This project is a digit classification web application using a FastAPI backend and a React frontend. Users can draw a digit on a canvas, and the app predicts the digit using a trained machine learning model.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Model Training](#model-training)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Deployment on AWS EC2](#deployment-on-aws-ec2)
- [API Endpoints](#api-endpoints)

## Tech Stack
- **Frontend:** React.js
- **Backend:** FastAPI (Python)
- **Model:** TensorFlow/Keras
- **Server:** NGINX
- **Deployment:** AWS EC2

## Project Structure
```
DigitClassifier/
|-- backend/
|   |-- model/
|   |   |-- my_model.keras      # Trained digit classification model
|   |-- main.py                 # FastAPI backend
|   |-- requirements.txt        # Backend dependencies
|-- frontend/
|   |-- src/
|   |   |-- DigitUploader.js    # React component for drawing and prediction
|   |-- package.json            # Frontend dependencies
|-- setup.sh                    # Setup script for EC2 deployment
```

## Model Training
The digit classification model was trained using the TensorFlow and Keras libraries. The training data consisted of handwritten digit images from the popular MNIST dataset. The key steps in model training were:

1. **Data Preprocessing:**
   - Normalized pixel values between 0 and 1.
   - Reshaped images to (28, 28, 1) for grayscale.

2. **Model Architecture:**
   - Convolutional Neural Network (CNN)
   - Layers:
     - Conv2D, MaxPooling2D, Flatten, Dense, Dropout

3. **Training:**
   - Optimizer: Adam
   - Loss function: Sparse Categorical Crossentropy
   - Metrics: Accuracy
   - Epochs: 10
   - Batch Size: 32

4. **Evaluation:**
   - Achieved 99% accuracy on the test set.

5. **Saving the Model:**
   - The trained model was saved as `my_model.keras` for deployment.

6. **Training Code:**
```python
import tensorflow as tf
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout

# Load and preprocess data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

# Build the CNN model
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(10, activation='softmax')
])

# Compile and train the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=10, batch_size=32, validation_data=(x_test, y_test))

# Save the model
model.save('my_model.keras')
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/DigitClassifier.git
cd DigitClassifier
```

### 2. Setup Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
```

### 5. Run Frontend
```bash
npm start
```

## Deployment on AWS EC2

### 1. Connect to EC2 Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```
- ![alt text](.Images\EC2Instance.png)

### 2. Setup and Deploy
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure NGINX
```bash
sudo nano /etc/nginx/sites-available/digit-classifier
```
Add the following configuration:
```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/digit-classifier /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```



## API Endpoints

### 1. Test Backend

```bash
curl http://YOUR_PUBLIC_IP/api/
```

### 2. Predict Digit
**Endpoint:** `POST /api/predict`
- ![alt text](.\Images\FastAPI_PublicIP.png)
**Request:**
```json
{
  "image": "data:image/png;base64,..."
}
```

**Response:**
```json
{
  "predicted_digit": 5
}
```
- ![alt text](.Images\React_PublicIP.png)
- ![alt text](.Images\React_PublicIP02.png)
- ![alt text](.Images\React_PublicIP03.png)

## Future Improvements
- Add authentication
- Improve model accuracy
- Deploy with HTTPS




