/* the root of the admin dashboard */
const tree = document.createDocumentFragment();

/* top div is everything pwm related and bot div is rack related */
const top_div = document.createElement('div')
const bot_div = document.createElement('div')
top_div.setAttribute('id', 'top-div')
bot_div.setAttribute('id', 'bot-div')

/* top div is made up of button div and the main pwm modules div */
const pwm_btn_div = document.createElement('div')
const pwm_div = document.createElement('div')
pwm_btn_div.setAttribute('style', 'padding: 15px 15px 15px 15px')
pwm_div.setAttribute('class', 'pwms card-deck')
pwm_div.setAttribute('id', 'pwms')

/* everything related to +pwm button */
const plus_pwm_btn = document.createElement('button')
plus_pwm_btn.setAttribute('class', 'btn btn-primary')
plus_pwm_btn.innerHTML = '+ PWM'
plus_pwm_btn.onclick = newPwm
pwm_btn_div.appendChild(plus_pwm_btn);

const refresh_btn = document.createElement('button')
refresh_btn.setAttribute('class', 'btn btn-info')
refresh_btn.setAttribute('style', 'margin-left: 15px')
refresh_btn.innerHTML = 'Refresh RPI'
refresh_btn.onclick = refreshRpi
pwm_btn_div.appendChild(refresh_btn);

/* TODO: space for the bottom rack */
const rack_btn_div = document.createElement('div')
const rack_div = document.createElement('div')
rack_btn_div.setAttribute('style', 'padding: 15px 15px 15px 15px')
rack_div.setAttribute('class', 'racks card-deck')
rack_div.setAttribute('id', 'racks')

const plus_rack_btn = document.createElement('button')
plus_rack_btn.setAttribute('class', 'btn btn-primary')
plus_rack_btn.innerHTML = '+ Rack'
plus_rack_btn.onclick = newRack
rack_btn_div.appendChild(plus_rack_btn);

/* builds the top div with the componenets */
top_div.appendChild(pwm_btn_div)
top_div.appendChild(pwm_div)

bot_div.appendChild(rack_btn_div)
bot_div.appendChild(rack_div)

loadPwms()
loadRacks()

/* put together both divs into the main tree */
tree.appendChild(top_div)
tree.appendChild(bot_div)

/* render the full admin dashboard in the root div */
document.getElementById('root').appendChild(tree)
