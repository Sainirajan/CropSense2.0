import os
import tempfile
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import numpy as np
import pickle

# PDF Processing imports
import pdfplumber
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain_classic.chains.question_answering import load_qa_chain
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from gtts import gTTS
import speech_recognition as sr
from deep_translator import GoogleTranslator
import librosa
import soundfile as sf

# FastAPI app
app = FastAPI()

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

# Use project-relative paths so local run works from any folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load ML models and encoders
model = pickle.load(open(os.path.join(BASE_DIR, "random_forest_model.pkl"), "rb"))
sc = pickle.load(open(os.path.join(BASE_DIR, "standscaler.pkl"), "rb"))
ms = pickle.load(open(os.path.join(BASE_DIR, "minmaxscaler.pkl"), "rb"))
model2 = pickle.load(open(os.path.join(BASE_DIR, "recommendation_model.pkl"), "rb"))
lbl_enc = pickle.load(open(os.path.join(BASE_DIR, "crop_label_encoder.pkl"), "rb"))
fert_lbl_enc = pickle.load(open(os.path.join(BASE_DIR, "fertilizer_label_encoder.pkl"), "rb"))

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class CropRequest(BaseModel):
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    Temperature: float
    Humidity: float
    Ph: float
    Rainfall: float

class FertilizerRequest(BaseModel):
    Nitrogen: float
    Phosphorus: float
    Potassium: float
    Crop: str

# ------------------- PDF Processing Functions -------------------
def get_pdf_text(pdf_paths):
    text = ""
    for pdf_path in pdf_paths:
        with pdfplumber.open(pdf_path) as pdf_file:
            for page in pdf_file.pages:
                text += page.extract_text() or ""
                for table in page.extract_tables():
                    for row in table:
                        text += " | ".join([cell if cell else "" for cell in row]) + "\n"
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=200)
    return text_splitter.split_text(text)

def get_vector_store(text_chunks):
    embeddings = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    You are an agriculture expert assistant helping users with questions related to agriculture and crops,
    based on Kerala, India. Use the given context. If not found, give a general answer (short & precise).
    Max 10 lines / 70 words.

    Context:\n{context}\n
    Question:\n{question}\n
    Answer:
    """
    llm = ChatGroq(
        model_name="llama-3.1-8b-instant",
        temperature=0.3,
        api_key=GROQ_API_KEY
    )
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(llm, chain_type="stuff", prompt=prompt)
    return chain

def process_question(user_question):
    try:
        embeddings = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")
        vector_store = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
        docs = vector_store.similarity_search(user_question, k=5)
        chain = get_conversational_chain()
        response = chain({"input_documents": docs, "question": user_question}, return_only_outputs=True)
        return response["output_text"]
    except Exception as e:
        # If no vector store exists, give general agriculture answer
        return get_general_agriculture_answer(user_question)

def get_general_agriculture_answer(question):
    """Fallback function for general agriculture questions when no PDFs are uploaded"""
    try:
        llm = ChatGroq(
            model_name="llama-3.1-8b-instant",
            temperature=0.3,
            api_key=GROQ_API_KEY
        )
        prompt = f"""You are an agriculture expert. Answer this agriculture question briefly (max 70 words): {question}"""
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        return "I'm an agriculture assistant. Please upload relevant PDFs for document-specific answers, or ask general agriculture questions."

def text_to_malayalam_speech(text):
    try:
        mal_text = GoogleTranslator(source="en", target="ml").translate(text)
        tts = gTTS(text=mal_text, lang="ml")
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3", dir=tempfile.gettempdir())
        tts.save(temp_file.name)
        return temp_file.name, mal_text
    except Exception as e:
        print(f"Translation/TTS error: {e}")
        return None, text

def convert_audio_to_wav(input_path, output_path):
    """Convert various audio formats to WAV for speech recognition"""
    try:
        # Load audio file with librosa (supports many formats)
        audio_data, sample_rate = librosa.load(input_path, sr=16000)  # Resample to 16kHz
        # Save as WAV
        sf.write(output_path, audio_data, sample_rate)
        return True
    except Exception as e:
        print(f"Audio conversion error: {e}")
        return False

def audio_file_to_text(audio_path):
    """Enhanced audio to text with format conversion support"""
    recognizer = sr.Recognizer()
    
    try:
        # Create temp WAV file for conversion
        temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_wav.close()
        
        # Convert to WAV format
        if not convert_audio_to_wav(audio_path, temp_wav.name):
            raise Exception("Failed to convert audio format")
        
        # Process with speech recognition
        with sr.AudioFile(temp_wav.name) as source:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
        
        # Try English first, then Malayalam/Hindi
        try:
            text = recognizer.recognize_google(audio_data, language="en-IN")
            return text
        except sr.UnknownValueError:
            try:
                # Try Malayalam
                text = recognizer.recognize_google(audio_data, language="ml-IN")
                return text
            except sr.UnknownValueError:
                try:
                    # Try Hindi as fallback
                    text = recognizer.recognize_google(audio_data, language="hi-IN")
                    return text
                except sr.UnknownValueError:
                    return "Sorry, could not understand the audio. Please try speaking clearly."
    
    except sr.RequestError as e:
        return f"Speech recognition service error: {e}"
    except Exception as e:
        return f"Audio processing error: {e}"
    finally:
        # Clean up temp file
        try:
            os.unlink(temp_wav.name)
        except:
            pass

def malayalam_audio_to_text(audio_path):
    """Specifically for Malayalam speech recognition"""
    recognizer = sr.Recognizer()
    
    try:
        # Create temp WAV file for conversion
        temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        temp_wav.close()
        
        # Convert to WAV format
        if not convert_audio_to_wav(audio_path, temp_wav.name):
            raise Exception("Failed to convert audio format")
        
        # Process with speech recognition
        with sr.AudioFile(temp_wav.name) as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio_data = recognizer.record(source)
        
        # Try Malayalam first, then English as fallback
        try:
            text = recognizer.recognize_google(audio_data, language="ml-IN")
            return text
        except sr.UnknownValueError:
            try:
                # Fallback to English
                text = recognizer.recognize_google(audio_data, language="en-IN")
                return text
            except sr.UnknownValueError:
                return "Sorry, could not understand the audio. Please try speaking clearly in Malayalam or English."
    
    except sr.RequestError as e:
        return f"Speech recognition service error: {e}"
    except Exception as e:
        return f"Audio processing error: {e}"
    finally:
        # Clean up temp file
        try:
            os.unlink(temp_wav.name)
        except:
            pass

# ------------------- Crop and Fertilizer Prediction Endpoints -------------------

@app.post("/predict")
def predict_crop(data: CropRequest):
    N, P, K = data.Nitrogen, data.Phosphorus, data.Potassium
    temp, humidity, ph, rainfall = data.Temperature, data.Humidity, data.Ph, data.Rainfall

    feature_list = [N, P, K, temp, humidity, ph, rainfall]
    single_pred = np.array(feature_list).reshape(1, -1)

    # Scale input
    scaled_features = ms.transform(single_pred)
    final_features = sc.transform(scaled_features)

    # Predict probabilities
    probabilities = model.predict_proba(final_features)[0]
    top_3_indices = np.argsort(probabilities)[-3:][::-1]

    crop_dict = {
        1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut",
        6: "Papaya", 7: "Orange", 8: "Apple", 9: "Muskmelon",
        10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
        14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean",
        18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
        21: "Chickpea", 22: "Coffee"
    }

    result_image = {
        1: "crops/Rice.jpeg", 2: "crops/Maize.jpeg", 3: "crops/Jute.jpeg",
        4: "crops/Cotton.jpeg", 5: "crops/Coconut.jpeg", 6: "crops/Papaya.jpeg",
        7: "crops/Orange.jpeg", 8: "crops/Apple.jpeg", 9: "crops/Muskmelon.jpeg",
        10: "crops/Watermelon.jpeg", 11: "crops/Grapes.jpeg", 12: "crops/Mango.jpeg",
        13: "crops/Banana.jpeg", 14: "crops/Pomegranate.jpeg", 15: "crops/Lentil.jpeg",
        16: "crops/Blackgram.jpeg", 17: "crops/Mungbean.jpeg", 18: "crops/Mothbeans.jpeg",
        19: "crops/Pigeonpeas.jpeg", 20: "crops/Kidneybeans.jpeg", 21: "crops/Chickpea.jpeg",
        22: "crops/Coffee.jpeg"
    }

    crop_description = {
        "Rice": "Rice is predominantly cultivated in Asia, especially in regions like China, India, and Southeast Asia. It thrives in clayey, loamy soils that retain water well.",
        "Maize": "Maize, or corn, is widely grown in the United States, Brazil, and China. It prefers well-drained, fertile loamy soils rich in organic matter.",
        "Jute": "Jute is mainly cultivated in Bangladesh and India, particularly in the Ganges Delta. It grows best in alluvial soil with a high clay content.",
        "Cotton": "Cotton is densely grown in India, the United States, and China. It favors deep, well-drained sandy loam soils with a slightly acidic to neutral pH.",
        "Coconut": "Coconut palms are most commonly found in tropical coastal regions like Indonesia, the Philippines, and India. They grow well in sandy, loamy, or alluvial soils that are well-drained.",
        "Papaya": "Papaya is extensively grown in India, Brazil, and Mexico. It thrives in well-drained sandy loam or alluvial soils rich in organic matter.",
        "Orange": "Oranges are primarily cultivated in Brazil, the United States (especially Florida), and China. They prefer well-drained sandy loam soils rich in organic content.",
        "Apple": "Apples are widely grown in temperate regions like the United States, China, and Europe. They thrive in well-drained loamy soils with a slightly acidic pH.",
        "Muskmelon": "Muskmelon is grown in warmer climates such as in India and the United States. It prefers sandy loam soils that are well-drained and rich in organic matter.",
        "Watermelon": "Watermelon is cultivated in warm regions like China, Turkey, and the United States. It grows best in sandy loam soils with good drainage and moderate organic content.",
        "Grapes": "Grapes are primarily cultivated in Mediterranean climates like those found in Italy, Spain, and France. They thrive in well-drained loamy or sandy loam soils with good fertility.",
        "Mango": "Mangoes are extensively grown in India, Thailand, and Mexico. They favor well-drained alluvial or loamy soils rich in organic matter.",
        "Banana": "Bananas are widely cultivated in tropical regions such as India, Brazil, and Ecuador. They thrive in well-drained loamy soils with high organic content.",
        "Pomegranate": "Pomegranates are primarily grown in India, Iran, and the Mediterranean. They prefer well-drained sandy or loamy soils with a neutral to slightly alkaline pH.",
        "Lentil": "Lentils are commonly grown in Canada, India, and Turkey. They thrive in well-drained loamy or sandy loam soils with moderate fertility.",
        "Blackgram": "Blackgram is densely cultivated in India and Myanmar. It grows well in loamy soils that are well-drained and rich in organic matter.",
        "Mungbean": "Mungbeans are widely grown in India, China, and Southeast Asia. They prefer well-drained sandy loam or loamy soils with good fertility.",
        "Mothbeans": "Mothbeans are commonly grown in arid regions like Rajasthan, India. They thrive in sandy loam soils that are well-drained and drought-resistant.",
        "Pigeonpeas": "Pigeonpeas are extensively grown in India, Eastern Africa, and the Caribbean. They grow best in well-drained loamy soils with moderate fertility.",
        "Kidneybeans": "Kidneybeans are cultivated in the United States, Brazil, and India. They thrive in well-drained loamy soils rich in organic matter.",
        "Chickpea": "Chickpeas are primarily grown in India, Australia, and Turkey. They prefer well-drained loamy or sandy loam soils with moderate fertility.",
        "Coffee": "Coffee is grown in tropical regions like Brazil, Vietnam, and Colombia. It thrives in well-drained loamy soils rich in organic content and slightly acidic pH."
    }

    top_3_crops = [crop_dict[i + 1] for i in top_3_indices]
    key1, key2, key3 = [list(crop_dict.keys())[list(crop_dict.values()).index(c)] for c in top_3_crops]

    return {
        'result1': top_3_crops[0],
        'result2': top_3_crops[1],
        'result3': top_3_crops[2],
        'description1': crop_description[top_3_crops[0]],
        'description2': crop_description[top_3_crops[1]],
        'description3': crop_description[top_3_crops[2]],
        'resultImage1': result_image[key1],
        'resultImage2': result_image[key2],
        'resultImage3': result_image[key3]
    }

@app.post("/predict_fertilizer")
def predict_fertilizer(data: FertilizerRequest):
    N, P, K, crop = data.Nitrogen, data.Phosphorus, data.Potassium, data.Crop.strip()

    crop_encoded = lbl_enc.transform([crop])[0]
    input_features = np.array([[N, P, K, crop_encoded]])

    fert_index = model2.predict(input_features)[0]
    fert_name = fert_lbl_enc.inverse_transform([fert_index])[0]

    description = {
        "Urea": "Urea is a highly concentrated nitrogen fertilizer, widely used for promoting rapid vegetative growth in plants. It is cost-effective and works well in a variety of soils.",
        "DAP": "Diammonium Phosphate (DAP) is a popular phosphorus fertilizer that also supplies nitrogen, essential for early plant growth and root development.",
        "MOP": "Muriate of Potash (MOP) is a potassium-rich fertilizer, improving overall plant health, drought resistance, and crop quality.",
        "10:26:26 NPK": "This NPK blend provides a balanced supply of nitrogen, phosphorus, and potassium, ideal for boosting root and flower development.",
        "SSP": "Single Super Phosphate (SSP) is a phosphorus fertilizer that also contains sulfur, improving root strength and overall growth.",
        "Magnesium Sulphate": "Magnesium Sulphate supplies magnesium and sulfur, enhancing chlorophyll production and overall plant vigor.",
        "13:32:26 NPK": "This NPK ratio offers high phosphorus content, suitable for flowering and fruiting stages of crop development.",
        "12:32:16 NPK": "An NPK fertilizer with a focus on phosphorus for root development and nitrogen for early plant growth.",
        "50:26:26 NPK": "This fertilizer provides a high nitrogen ratio, supporting leafy growth while maintaining balanced phosphorus and potassium levels.",
        "19:19:19 NPK": "A balanced NPK fertilizer, ideal for all stages of plant growth, providing equal nitrogen, phosphorus, and potassium.",
        "Chelated Micronutrient": "Chelated micronutrients ensure optimal absorption of essential trace elements like iron, zinc, and manganese for plant health.",
        "18:46:00 NPK": "This fertilizer is rich in phosphorus and nitrogen, supporting early-stage crop growth and root development.",
        "Sulphur": "Sulphur improves protein synthesis and nutrient uptake in plants, crucial for oilseed crops and legumes.",
        "20:20:20 NPK": "A perfectly balanced NPK fertilizer for general-purpose use, supporting plant growth, flowering, and fruiting.",
        "Ammonium Sulphate": "Ammonium Sulphate is a nitrogen fertilizer with sulfur, suitable for acid-loving crops and improving soil pH.",
        "Ferrous Sulphate": "Ferrous Sulphate supplies iron and sulfur, preventing iron chlorosis and promoting healthy green foliage.",
        "White Potash": "White Potash is a potassium-rich fertilizer that improves stress tolerance and enhances fruit quality.",
        "10:10:10 NPK": "A balanced fertilizer providing equal parts nitrogen, phosphorus, and potassium, suitable for general-purpose gardening.",
        "Hydrated Lime": "Hydrated Lime is used to adjust soil pH, reduce acidity, and enhance calcium availability for plants."
    }

    result_fertilizer = {
        "Urea": "fert/Urea.jpg", "DAP": "fert/DAP.jpg", "MOP": "fert/MOP.jpg",
        "10:26:26 NPK": "fert/NPK.jpg", "SSP": "fert/SSP.jpg", "Magnesium Sulphate": "fert/Magnesium-Sulphate.jpg",
        "13:32:26 NPK": "fert/NPK.jpg", "12:32:16 NPK": "fert/NPK.jpg", "50:26:26 NPK": "fert/NPK.jpg",
        "19:19:19 NPK": "fert/NPK.jpg", "Chelated Micronutrient": "fert/Chelated-Micronutrient.jpeg",
        "18:46:00 NPK": "fert/NPK.jpg", "Sulphur": "fert/Sulphur.jpg", "20:20:20 NPK": "fert/NPK.jpg",
        "Ammonium Sulphate": "fert/Ammonium-Sulphate.jpg", "Ferrous Sulphate": "fert/Ferrous-Sulphate.jpg",
        "White Potash": "fert/White-Potash.jpg", "10:10:10 NPK": "fert/NPK.jpg", "Hydrated Lime": "fert/Hydrated-lime.jpg"
    }

    return {
        'result': fert_name,
        'description': description[fert_name],
        'imagef': result_fertilizer[fert_name]
    }

# ------------------- PDF Processing and Advisory Endpoints -------------------

@app.post("/upload_pdfs/")
async def upload_pdfs(files: list[UploadFile] = File(...)):
    temp_paths = []
    try:
        for file in files:
            suffix = os.path.splitext(file.filename)[-1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(await file.read())
                temp_paths.append(tmp.name)
        
        raw_text = get_pdf_text(temp_paths)
        text_chunks = get_text_chunks(raw_text)
        get_vector_store(text_chunks)
        
        return {"message": "PDFs processed and vector store created successfully."}
    
    except Exception as e:
        return {"error": f"Failed to process PDFs: {str(e)}"}
    
    finally:
        # Clean up temp files
        for path in temp_paths:
            try:
                os.remove(path)
            except:
                pass

@app.post("/ask/")
async def ask_question(question: str = Form(...)):
    try:
        answer = process_question(question)
        return {"answer": answer}
    except Exception as e:
        return {"error": f"Failed to process question: {str(e)}"}

@app.post("/process_audio_file/")
async def process_audio_file(file: UploadFile = File(...)):
    """Process uploaded audio file - transcribe and answer"""
    temp_path = None
    try:
        # Save uploaded file temporarily
        suffix = os.path.splitext(file.filename)[-1] if file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name
        
        # Transcribe audio to text
        transcribed_text = audio_file_to_text(temp_path)
        
        # Get answer for the transcribed question
        answer = process_question(transcribed_text)
        
        return {
            "text": transcribed_text,
            "answer": answer
        }
    
    except Exception as e:
        return {"error": f"Failed to process audio file: {str(e)}"}
    
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@app.post("/audio_to_text/")
async def audio_to_text(file: UploadFile = File(...)):
    """Convert audio file to text (English/Multi-language)"""
    temp_path = None
    try:
        suffix = os.path.splitext(file.filename)[-1] if file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name
        
        recognized_text = audio_file_to_text(temp_path)
        return {"text": recognized_text}
    
    except Exception as e:
        return {"error": f"Failed to convert audio to text: {str(e)}"}
    
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@app.post("/malayalam_audio_to_text/")
async def malayalam_audio_to_text_endpoint(file: UploadFile = File(...)):
    """Convert Malayalam audio to text (for direct recording)"""
    temp_path = None
    try:
        suffix = os.path.splitext(file.filename)[-1] if file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await file.read())
            temp_path = tmp.name
        
        recognized_text = malayalam_audio_to_text(temp_path)
        return {"text": recognized_text}
    
    except Exception as e:
        return {"error": f"Failed to convert Malayalam audio to text: {str(e)}"}
    
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@app.post("/malayalam_tts/")
async def malayalam_tts(text: str = Form(...)):
    """Convert English text to Malayalam and generate speech"""
    try:
        audio_path, mal_text = text_to_malayalam_speech(text)
        if audio_path:
            filename = os.path.basename(audio_path)
            return JSONResponse(content={
                "mal_text": mal_text, 
                "audio_url": f"/audio/{filename}"
            })
        else:
            return {"error": "Failed to generate Malayalam speech"}
    
    except Exception as e:
        return {"error": f"Failed to generate Malayalam TTS: {str(e)}"}

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    """Serve generated audio files"""
    file_path = os.path.join(tempfile.gettempdir(), filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mp3")
    else:
        return {"error": "Audio file not found"}

@app.get("/")
def root():
    return {"message": "CropSense - Integrated Agriculture Advisory and Prediction API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)