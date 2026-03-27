FROM python:3.12-slim

WORKDIR /app

COPY requirement.txt ./

RUN pip install --no-cache-dir -r ./requirement.txt 

# Copy backend app files into /app
COPY backend/. ./

EXPOSE 8000

CMD ["python", "main.py"]

