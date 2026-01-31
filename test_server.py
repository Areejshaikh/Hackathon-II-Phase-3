import time
import urllib.request
import urllib.error

time.sleep(10)  # Wait for server to start

try:
    response = urllib.request.urlopen('http://127.0.0.1:8000/')
    print("Server is running!")
    print("Status code:", response.getcode())
    print("Response:", response.read().decode('utf-8'))
except urllib.error.URLError as e:
    print("Error connecting to server:", e)