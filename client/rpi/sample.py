from board import SCL, SDA
import busio

from adafruit_pca9685 import PCA9685

from requests import request
import json

print('Starting sample program')

i2c_bus = busio.I2C(SCL, SDA)

MAX_VALUE = 0xFFFF

def get_value(shelf, addr):
    if (shelf['kind'] == 'white' or shelf['kind'] == 'hybrid'):
        if shelf['wAddr'] == addr:
            return int(MAX_VALUE * (shelf['wValue'] / 100.0))
    if (shelf['kind'] == 'rgb' or shelf['kind'] == 'hybrid'):
        if shelf['rAddr'] == addr:
            return int(MAX_VALUE * (shelf['rValue'] / 255.0))
        if shelf['gAddr'] == addr:
            return int(MAX_VALUE * (shelf['gValue'] / 255.0))
        if shelf['bAddr'] == addr:
            return int(MAX_VALUE * (shelf['bValue'] / 255.0))
    return None # This should never happen

response = request("GET", 'https://happy-fish.herokuapp.com/api/config')
data = json.loads(response.text)

pwms = data['pwms']

for i in range(0, len(pwms)):
    id = pwms[i]

    pca = PCA9685(i2c_bus, address=0x40 + i)
    pca.frequency = 60

    print (i,'pwm', id)

    pwm = data[id]['addrs']
    for j in range(0, 16):
        addr = 'a'+str(j)
        value = 0
        shelfId = pwm[addr]
        if shelfId != None:
            shelf = data[shelfId]

            value = get_value(shelf, addr)

        print('\t', addr, value)
        pca.channels[j].duty_cycle = value

print('Finished sample program')
