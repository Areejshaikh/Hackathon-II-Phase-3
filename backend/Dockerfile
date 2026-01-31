FROM python:3.12-slim

# Container ke andar ek naya folder '/app' banayein
WORKDIR /app

# Sabse pehle requirements copy aur install karein
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Ab local folder ka SARA maal (main.py aur src folder) copy karein
COPY . .

# Python ko batayein ke modules /app ke andar dhoonde
ENV PYTHONPATH=/src

# App ko run karein
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]