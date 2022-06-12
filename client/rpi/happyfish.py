from requests import request
from schedule import Schedule
from time import sleep
import json
import os

class HappyFish:

    def __init__(self, logger):
        logger.info('Initializing HappyFish')
        self.endpoint = os.getenv('HEROKU_HOST')
        self.logger = logger

        self.schedule = Schedule(logger)

        self.CANT_START = True
        self.BAD_CONFIG = True
        self.REFRESH = False
        self.running = True

    def start(self):
        self.logger.info('Starting HappyFish client. Server:' + self.endpoint)

        # Initially load the configurations when the HappyFish software runs
        self.config = self.load_configs()
        if self.config == None:
            return
        self.CANT_START = False
        self.notify_client_refresh()
        self.logger.info('Loaded initial configurations')

        # Initialize the hardware based on configurations to prove it is proper
        self.pwms = self.init_hardware()
        if self.pwms == None:
            return
        self.BAD_CONFIG = False
        self.logger.info('Loaded '+str(len(self.pwms))+' pwm modules')

        sleep(0.5) 

        while (self.running):

            # check for new configurations or client refreshes
            new_config = self.load_configs()
            if new_config != None:
                if new_config['refresh']:
                    self.REFRESH = True
                    return
                
                self.config = new_config 

            # send the signals for each pwm
            self.send_pwm_signals()

    def send_pwm_signals(self):
        print('sending signals now')

    def init_hardware(self):
        print('time to init hardware')

    def notify_client_refresh(self):
        response = request("PUT", self.endpoint + '/api/config', timeout=1)

    def load_configs(self):
        try:
            response = request("GET", self.endpoint + '/api/config', timeout=1)
            return json.loads(response.text)
        except:
            print('Unable to make request to the server')
            return None
        
