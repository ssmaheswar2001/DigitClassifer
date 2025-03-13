from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
import tensorflow as tf
from PIL import Image
import base64
import io

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    # allow_origins=["http://localhost:3000"],
    allow_origins=["http://107.21.66.51:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
model = tf.keras.models.load_model('./model/my_model.keras')

class ImageData(BaseModel):
    image: str

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running"}

@app.post("/predict")
def predict_digit(data: ImageData):
    try:
        # Decode the base64 image
        image_data = base64.b64decode(data.image.split(',')[1])
        image = Image.open(io.BytesIO(image_data)).convert('L')  # Convert to grayscale

        # Resize to 28x28
        image = image.resize((28, 28))

        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0

        # Reshape for the model: (1, 28, 28, 1)
        image_array = image_array.reshape(1, 28, 28, 1)

        # Predict the digit
        prediction = model.predict(image_array)
        predicted_digit = int(np.argmax(prediction))

        return {"predicted_digit": predicted_digit}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
