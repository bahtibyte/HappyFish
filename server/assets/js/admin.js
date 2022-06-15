/* the root of the admin dashboard */
const tree = document.createDocumentFragment();

/* top div is everything pwm related and bot div is rack related */
const top_div = document.createElement('div')
const bot_div = document.createElement('div')

/* top div is made up of button div and the main pwm modules div */
const pwm_btn_div = document.createElement('div')
const pwm_div = document.createElement('div')
pwm_btn_div.setAttribute('style', 'padding: 15px 15px 15px 15px')
pwm_div.setAttribute('class', 'pwms card-deck')
pwm_div.setAttribute('id', 'pwms')

/* everything related to +pwm button */
const plus_btn = document.createElement('button')
plus_btn.setAttribute('class', 'btn btn-primary')
plus_btn.innerHTML = '+ PWM'
plus_btn.onclick = newPwm
pwm_btn_div.appendChild(plus_btn);

const refresh_btn = document.createElement('button')
refresh_btn.setAttribute('class', 'btn btn-info')
refresh_btn.setAttribute('style', 'margin-left: 15px')
refresh_btn.innerHTML = 'Refresh RPI'
refresh_btn.onclick = refreshRpi
pwm_btn_div.appendChild(refresh_btn);

/* TODO: space for the bottom rack */
const rack_div = document.createElement('div')
rack_div.setAttribute('id', 'racks')
rack_div.setAttribute('class', 'racks')
rack_div.appendChild(document.createTextNode('this is my rack div'))

/* builds the top div with the componenets */
top_div.appendChild(pwm_btn_div)
top_div.appendChild(pwm_div)

loadPwms()



/* put together both divs into the main tree */
tree.appendChild(top_div)
tree.appendChild(rack_div)

/* render the full admin dashboard in the root div */
document.getElementById('root').appendChild(tree)
