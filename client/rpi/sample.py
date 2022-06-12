import requests
import json

print('Starting sample program')




url = "http://localhost:8080/api/config"

payload = ""
response = requests.request("GET", url, data=payload)

data = json.loads(response.text)

pwms = data['pwms']

print(pwms)

for i in range(0, len(pwms)):
    print (i,'pwm', pwms[i])

#print(json.dumps(data, indent=4))


print('Finished sample program')
