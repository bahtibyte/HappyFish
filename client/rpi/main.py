from dotenv import load_dotenv
from logging.handlers import TimedRotatingFileHandler
import logging
import pathlib
import os

from happyfish import HappyFish

load_dotenv()

def log_setup():
    path = 'client/rpi/logs'
    if not os.path.exists(path):
        os.makedirs(path)
    logger = logging.getLogger('testlog')
    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter(fmt='%(asctime)s [%(filename)-15s %(lineno)-4s %(funcName)15s()] %(levelname)-8s %(message)s', datefmt='%m-%d-%y %H:%M:%S')
    fh = TimedRotatingFileHandler(str(pathlib.Path().absolute())+'/'+path+'/HappyFish.log', when='midnight', interval=1)
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    return logger

logger = log_setup()

logger.info('Starting main.py')

hf = HappyFish(logger)
hf.start()

if hf.CANT_START:
    logger.error('INITIAL SERVER REQUEST UNRESPONSIVE')

if hf.BAD_CONFIG:
    logger.error('UNABLE TO INITIALIZE PWM MODULES')

if hf.REFRESH:
    logger.info('CLIENT CONFIGURATION REFRESH REQUESTED')

logger.info('Terminating main.py')