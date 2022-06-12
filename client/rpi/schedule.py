from datetime import datetime
import os

class Stages:
    pre_sun_rise = 'PRE Sun-Rise'
    sun_rise = 'Sun-Rise'
    lights_on = 'Day-Time'
    sun_set = 'Sun-Set'
    post_sun_set = 'POST Sun-Set'

class Schedule:

    def __init__(self, logger):

        self.sunrise = os.getenv('SUNRISE')
        self.sunset = os.getenv('SUNSET')
        self.duration = int(os.getenv('DURATION'))

        index = self.sunrise.index(':')
        self.sunrise_start = (int(self.sunrise[:index]) * 3600) + (int(self.sunrise[index+1:]) * 60)
        
        index = self.sunset.index(':')
        self.sunset_start = (int(self.sunset[:index]) * 3600) + (int(self.sunset[index+1:]) * 60)

        self.duration_seconds = self.duration * 60

        self.logger = logger

        self.logger.info('Sunrise is set to '+self.sunrise+'. Sunset is set to '+self.sunset)
        self.logger.info('Duration of each stage is set to '+str(self.duration)+' minutes')

        self.stage = self.getStageInfo()[0]
        self.logger.debug('Initialization stage \''+self.stage+'\'')

    def getStageInfo(self):

        now = datetime.now()
        seconds = (now.hour * 3600) + (now.minute * 60) + (now.second)

        if seconds < self.sunrise_start:
            return [Stages.pre_sun_rise, seconds]

        elif seconds < self.sunrise_start + self.duration_seconds:
            return [Stages.sun_rise, seconds]

        elif seconds < self.sunset_start:
            return [Stages.lights_on, seconds]

        elif seconds < self.sunset_start + self.duration_seconds:
            return [Stages.sun_set, seconds]

        else:
            return [Stages.post_sun_set, seconds]
    
    def getBrightnessPercentage(self):

        raw_stage = self.getStageInfo()

        current_stage = raw_stage[0]
        seconds = raw_stage[1]

        if current_stage != self.stage:
            self.logger.info('Scheduled stage changed from \''+self.stage+'\' to \''+current_stage+'\'')

            self.stage = current_stage
        
        if self.stage == Stages.pre_sun_rise or self.stage == Stages.post_sun_set:
            return 0.0
        
        if self.stage == Stages.sun_rise:
            return float(seconds - self.sunrise_start) / float(self.duration_seconds)
        
        if self.stage == Stages.sun_set:
            return 1 - (float(seconds - self.sunset_start) / float(self.duration_seconds))
        
        return 1.0
