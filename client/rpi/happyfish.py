from board import SCL, SDA
from adafruit_pca9685 import PCA9685
from requests import request
from schedule import Schedule
from time import sleep
import busio
import json
import os

class HappyFish:

    MAX_VALUE = 0xFFFF

    def __init__(self, logger):
        logger.info('Initializing HappyFish')
        self.endpoint = os.getenv('HEROKU_HOST')
        self.logger = logger

        self.schedule = Schedule(logger)

        self.CANT_START = True
        self.BAD_CONFIG = True
        self.REFRESH = False
        self.running = True

        self.admin_pass = os.getenv('ADMIN_PASS')
        self.admin_headers = { 'Authorization': f'Bearer {self.admin_pass}' }

    def start(self):
        self.logger.info('Starting HappyFish client. Server:' + self.endpoint)

        # Initially load the configurations when the HappyFish software runs
        self.config = self.load_configs()
        if self.config == None:
            return
        self.CANT_START = False
        self.notify_server()
        self.logger.info('Loaded initial configurations')

        # Initialize the hardware based on configurations to prove it is proper
        self.pwms = self.init_hardware()
        if self.pwms == None:
            return
        self.BAD_CONFIG = False
        self.logger.info('Loaded '+str(len(self.pwms))+' pwm modules')

        sleep(0.5) 

        n = 0
        while (self.running):

            # check for new configurations or client refreshes
            new_config = self.load_configs()
            if new_config != None:
                if new_config['sync']:
                    self.REFRESH = True
                    return
                
                self.config = new_config 

            # send the signals for each pwm
            self.send_pwm_signals()
            
            sleep(1)

    def send_pwm_signals(self):
        print('sending signals now')

        for i in range(0, len(self.pwms)):
            id = self.pwms[i]['id']

            module = self.pwms[i]['module']
            pwm = self.config[id]['addrs']
            for j in range(0, 16):
                addr = 'a'+str(j)
                value = 0
                shelfId = pwm[addr]
                if shelfId != None:
                    shelf = self.config[shelfId]

                    if shelf['kind'] == 'white':
                        if shelf['mode'] == 0:
                            value = int(self.MAX_VALUE * self.schedule.getBrightnessPercentage())
                        else:
                            value = self.get_value(shelf, addr)
                        
                    elif shelf['kind'] == 'rgb' and shelf['mode'] != 0:
                        value = self.get_value(shelf, addr)

                print('\t', addr, value)
                module.channels[j].duty_cycle = value

    def init_hardware(self):
        self.logger.info('Initializing the pwm hardware')

        try:
            pwms = []
            i2c_bus = busio.I2C(SCL, SDA)
            for i in range(0, len(self.config['pwms'])):

                pca = PCA9685(i2c_bus, address=0x40 + i)
                pca.frequency = 60

                pwms.append({
                    'module': pca,
                    'id': self.config['pwms'][i]
                })

                for j in range(0, 16):
                    pca.channels[j].duty_cycle = 0

            return pwms
        except:
            self.logger.error('Exception thrown when initializing hardware')
            return None
        
    def notify_server(self):
        request("PUT", self.endpoint + '/api/config/syncd', headers=self.admin_headers)
        self.logger.info('Sent sync notification to server')

    def load_configs(self):
        try:
            response = request("GET", self.endpoint + '/api/config', timeout=1)
            return json.loads(response.text)
        except:
            self.logger.error('Unable to make request to the server')
            return None

    def get_value(self, shelf, addr):
        if (shelf['kind'] == 'white' or shelf['kind'] == 'hybrid'):
            if shelf['wAddr'] == addr:
                return int(self.MAX_VALUE * (shelf['wValue'] / 100.0))
        if (shelf['kind'] == 'rgb' or shelf['kind'] == 'hybrid'):
            if shelf['rAddr'] == addr:
                return int(self.MAX_VALUE * (shelf['rValue'] / 255.0))
            if shelf['gAddr'] == addr:
                return int(self.MAX_VALUE * (shelf['gValue'] / 255.0))
            if shelf['bAddr'] == addr:
                return int(self.MAX_VALUE * (shelf['bValue'] / 255.0))
        return None # This should never happen
