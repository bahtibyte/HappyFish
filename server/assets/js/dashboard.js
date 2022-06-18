const full = {'r': 'Red', 'g': 'Green', 'b': 'Blue'}

const loadDashboard = function() {
    fetch('/api/config', { method: 'GET' })
        .then(response => response.json())
        .then(response => loadDash(response))
        .catch(err => alert('unable to load configs '+err));
}


const loadDash = function(config) {
    console.log('loading')
    console.log(config)

    last_config = config
    const racks = config['racks']
    for (var i = 0; i < racks.length; i++) {
        const root = create_rack(config[racks[i]], config)
        rack_div.appendChild(root)
    }
}

const create_rack = function(rack, config) {
    
    const rackId = rack['_id']

    const root = document.createElement('div')
    root.setAttribute('class', 'col-auto mb-3')
    root.setAttribute('style', 'margin-top: 15px')
    root.setAttribute('id', rackId+'-root')

    const card = document.createElement('div')
    card.setAttribute('class', 'card bg-light')
    card.setAttribute('style', 'width: 21rem')
    card.setAttribute('id', rackId+'-card')

    const body = document.createElement('div')
    body.setAttribute('class', 'card-body')
    body.setAttribute('id', rackId+'-body')

    const header = document.createElement('div')
    header.setAttribute('class', 'card-header')
    header.setAttribute('id', rackId+'-header')

    const h5 = document.createElement('h5')
    h5.setAttribute('id', rackId+'-header-h5')
    h5.innerHTML = '[Rack]: ' + rack['name']
    header.appendChild(h5)

    const shelves = rack['shelves']
    for (var i = 0; i < shelves.length; i++) {
        const shelf_root = create_shelf(config[shelves[i]])
        body.appendChild(shelf_root)
    }

    card.appendChild(header)
    card.appendChild(body)
  
    root.appendChild(card)

    return root
}

const create_shelf = function(shelf) {
    
    const shelfId = shelf['_id']

    const root = document.createElement('div')
    root.setAttribute('class', 'col-auto mb-3')
    root.setAttribute('style', 'margin-left: -35px')
    root.setAttribute('id', shelfId+'-root')

    const card = document.createElement('div')
    card.setAttribute('class', 'card bg-light')
    card.setAttribute('style', 'width: 19rem')
    card.setAttribute('id', shelfId+'-card')

    const body = document.createElement('div')
    body.setAttribute('class', 'card-body p-0')
    body.setAttribute('id', shelfId+'-body')

    const header = document.createElement('div')
    header.setAttribute('class', 'card-header')
    header.setAttribute('id', shelfId+'-header')

    const h5 = document.createElement('h5')
    h5.setAttribute('id', shelfId+'-header-h5')
    h5.innerHTML = '[Shelf]: ' + shelf['name']
    header.appendChild(h5)

    const shelf_div = generateShelf(shelf)
    body.appendChild(shelf_div)

    card.appendChild(header)
    card.appendChild(body)
  
    root.appendChild(card)

    return root
}


const generateShelf = function(shelf) {

    if (shelf['kind'] == 'tbd')
        return tbdShelf(shelf)

    if (shelf['kind'] == 'white') 
        return whiteShelf(shelf)

    if (shelf['kind'] == 'rgb') 
        return rgbShelf(shelf)

    const shelfId = shelf['_id']

    const new_div = document.createElement('div')
    new_div.setAttribute('id', shelfId+'-shelf-body-div')
    new_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

    const radio_div = document.createElement('div')
    radio_div.setAttribute('class', 'input-group mb-3')
    radio_div.setAttribute('id', shelfId+'-radio-div')

    const kinds_div = document.createElement('div')
    kinds_div.setAttribute('class', 'form-control')

    const span = document.createElement('span')
    span.setAttribute('class', 'input-group-text')
    span.setAttribute('id', shelfId+'-kind-span')
    span.innerHTML = 'kind'

    const label = document.createElement('label')
    label.innerHTML = shelf['kind']

    kinds_div.appendChild(label)

    radio_div.appendChild(span)
    radio_div.appendChild(kinds_div)

    //new_div.appendChild(radio_div)

    if (shelf['kind'] == 'white' || shelf['kind'] == 'hybrid') {

        const div = document.createElement('div')
        div.setAttribute('class', 'form-control mb-3')
        div.setAttribute('id', shelfId+'-white-configure-div')

        const pwm_div = document.createElement('div')
        pwm_div.setAttribute('class', 'input-group mb-3')

        const pwm_span = document.createElement('span')
        pwm_span.setAttribute('class', 'input-group-text')
        pwm_span.setAttribute('id', shelfId+'-white-pwm-span')
        pwm_span.setAttribute('style', 'width: 60px')
        pwm_span.innerHTML = 'pwm:'

        const pwm_select = document.createElement('select')
        pwm_select.setAttribute('class', 'form-control form-select')
        pwm_select.setAttribute('id', shelfId+'-white-pwm')
        
        const option = document.createElement('option')
        var i = last_config['pwms'].indexOf(shelf['pwmIdW'])
        option.innerHTML = '[0x' + (40+i) + ']: ' + last_config[shelf['pwmIdW']]['name']

        pwm_select.appendChild(option)
        
        pwm_div.appendChild(pwm_span)
        pwm_div.appendChild(pwm_select)

        const addr_div = document.createElement('div')
        addr_div.setAttribute('class', 'input-group mb-3')

        const addr_span = document.createElement('span')
        addr_span.setAttribute('class', 'input-group-text')
        addr_span.setAttribute('id', shelfId+'-white-addr-span')
        addr_span.setAttribute('style', 'width: 110px')
        addr_span.innerHTML = 'white addr:'

        const addr_select = document.createElement('select')
        addr_select.setAttribute('class', 'form-control form-select')
        addr_select.setAttribute('style', 'width: auto')
        addr_select.setAttribute('id', shelfId+'-white-select')

        const addr_option = document.createElement('option')
        addr_option.innerHTML = shelf['wAddr']

        addr_select.appendChild(addr_option)

        pwm_select.disabled = true
        addr_select.disabled = true

        addr_div.appendChild(addr_span)
        addr_div.appendChild(addr_select)

        div.appendChild(pwm_div)
        div.appendChild(addr_div)

        new_div.appendChild(div)
    }

    
    if (shelf['kind'] == 'rgb' || shelf['kind'] == 'hybrid') {

        const div = document.createElement('div')
        div.setAttribute('class', 'form-control mb-3')
        div.setAttribute('id', shelfId+'-rgb-configure-div')

        const pwm_div = document.createElement('div')
        pwm_div.setAttribute('class', 'input-group mb-3')

        const pwm_span = document.createElement('span')
        pwm_span.setAttribute('class', 'input-group-text')
        pwm_span.setAttribute('id', shelfId+'-rgb-pwm-span')
        pwm_span.setAttribute('style', 'width: 60px')
        pwm_span.innerHTML = 'pwm:'

        const pwm_select = document.createElement('select')
        pwm_select.setAttribute('class', 'form-control form-select')
        pwm_select.setAttribute('id', shelfId+'-rgb-pwm')
        
        const option = document.createElement('option')
        var i = last_config['pwms'].indexOf(shelf['pwmIdRGB'])
        option.innerHTML = '[0x' + (40+i) + ']: ' + last_config[shelf['pwmIdRGB']]['name']

        pwm_select.appendChild(option)
        
        pwm_div.appendChild(pwm_span)
        pwm_div.appendChild(pwm_select)

        pwm_select.disabled = true
        div.appendChild(pwm_div)

        const colors = ['red', 'green', 'blue']
        for (var i = 0; i < colors.length; i++) {
            const color = colors[i]

            const addr_div = document.createElement('div')
            addr_div.setAttribute('class', 'input-group mb-3')
    
            const addr_span = document.createElement('span')
            addr_span.setAttribute('class', 'input-group-text')
            addr_span.setAttribute('id', shelfId+'-'+color+'-addr-span')
            addr_span.setAttribute('style', 'width: 110px')
            addr_span.innerHTML = color+' addr:'
    
            const addr_select = document.createElement('select')
            addr_select.setAttribute('class', 'form-control form-select')
            addr_select.setAttribute('style', 'width: auto')
            addr_select.setAttribute('id', shelfId+'-'+color+'-select')
    
            const addr_option = document.createElement('option')
            addr_option.innerHTML = shelf[color[0]+'Addr']
    
            addr_select.appendChild(addr_option)
    
            addr_select.disabled = true
    
            addr_div.appendChild(addr_span)
            addr_div.appendChild(addr_select)
    
            div.appendChild(addr_div)
    
        }
        
        new_div.appendChild(div)
    }


    return new_div
}


const rgbShelf = function(shelf) {

    const shelfId = shelf['_id']

    const div = document.createElement('div')
    div.setAttribute('class', 'border ')
    div.setAttribute('style', 'margin: 1rem 1rem 1rem 1rem')
    div.setAttribute('id', shelf['_id']+'-shelf-body-div')

    const radio_div = document.createElement('div')
    radio_div.setAttribute('class', 'input-group mb-3')
    radio_div.setAttribute('id', shelfId+'-radio-div')

    const modes_div = document.createElement('div')
    modes_div.setAttribute('class', 'form-control')

    const span = document.createElement('span')
    span.setAttribute('class', 'input-group-text')
    span.setAttribute('id', shelfId+'-kind-span')
    span.innerHTML = 'mode'

    const modes = ['off', 'on', 'auto']
    for (var i = 0; i < modes.length; i++) {
        const div = document.createElement('div')
        div.setAttribute('class', 'form-check form-check-inline')

        const mode = modes[i]
        const input = document.createElement('input')
        input.setAttribute('class', 'form-check-input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', shelfId+'-modes')
        input.setAttribute('id', shelfId+'-mode-'+mode)
        input.setAttribute('value', mode)
        input.onclick = function() {
            rgbModeSelected(shelf, mode)
        }

        if (i == shelf['mode']) {
            input.checked = true
        }

        const label = document.createElement('label')
        label.setAttribute('class', 'form-check-label')
        label.setAttribute('style', 'padding-top: 5px; padding-bottom: 5px')
        label.setAttribute('for', shelfId+'-mode-'+mode)
        label.innerHTML = mode

        div.appendChild(input)
        div.appendChild(label)

        modes_div.appendChild(div)
    }

    radio_div.appendChild(span)
    radio_div.appendChild(modes_div)

    div.appendChild(radio_div)

    if (shelf['mode'] == 0) {
        const msg_div = document.createElement('div')
        msg_div.setAttribute('class', 'border border-secondary')
        msg_div.setAttribute('id', shelfId+'-msg-div')
        msg_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

        const p = document.createElement('p')
        p.setAttribute('class', 'automatic')
        p.setAttribute('id', shelf['_id']+'-shelf-p')
        p.innerHTML = 'RGB Shelf Off'
        
        msg_div.appendChild(p)

        div.append(msg_div)
    } else if (shelf['mode'] == 1) {
        const slider_div = document.createElement('div')
        slider_div.setAttribute('id', shelfId+'-msg-div')
        slider_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

        const colors = ['r', 'g', 'b']
        for (var i = 0; i < colors.length; i++) {
            const color = colors[i]
            const label = document.createElement('div')
            label.setAttribute('class', 'form-label')
            label.setAttribute('id', shelfId+'-range-label-'+color)

            const input = document.createElement('input')
            input.setAttribute('type', 'range')
            input.setAttribute('class', 'form-range')
            input.setAttribute('min', '0')
            input.setAttribute('max', '255')
            input.setAttribute('id', shelfId-'-range-'+color)
            input.defaultValue = shelf[color+'Value'] 
            input.onchange = function() { rgbSlider(shelf, input, color) }
            
            slider_div.appendChild(label)
            slider_div.appendChild(input)

            label.innerHTML = full[color] + ': ' + input.value
        }
        

        div.append(slider_div)

    } else {
        const msg_div = document.createElement('div')
        msg_div.setAttribute('class', 'border border-secondary')
        msg_div.setAttribute('id', shelfId+'-msg-div')
        msg_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

        const p = document.createElement('p')
        p.setAttribute('class', 'automatic')
        p.setAttribute('id', shelf['_id']+'-shelf-p')
        p.innerHTML = 'Auto RGB Schedule'
        
        msg_div.appendChild(p)

        div.append(msg_div)
    }

    return div
}

const whiteShelf = function(shelf) {

    const shelfId = shelf['_id']

    const div = document.createElement('div')
    div.setAttribute('class', 'border ')
    div.setAttribute('style', 'margin: 1rem 1rem 1rem 1rem')
    div.setAttribute('id', shelf['_id']+'-shelf-body-div')

    const radio_div = document.createElement('div')
    radio_div.setAttribute('class', 'input-group mb-3')
    radio_div.setAttribute('id', shelfId+'-radio-div')

    const modes_div = document.createElement('div')
    modes_div.setAttribute('class', 'form-control')

    const span = document.createElement('span')
    span.setAttribute('class', 'input-group-text')
    span.setAttribute('id', shelfId+'-kind-span')
    span.innerHTML = 'mode'

    const modes = ['auto', 'override']
    for (var i = 0; i < modes.length; i++) {
        const div = document.createElement('div')
        div.setAttribute('class', 'form-check form-check-inline')

        const mode = modes[i]
        const input = document.createElement('input')
        input.setAttribute('class', 'form-check-input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', shelfId+'-modes')
        input.setAttribute('id', shelfId+'-mode-'+mode)
        input.setAttribute('value', mode)
        input.onclick = function() {
            whiteModeSelected(shelf, mode)
        }

        if (i == shelf['mode']) {
            input.checked = true
        }

        const label = document.createElement('label')
        label.setAttribute('class', 'form-check-label')
        label.setAttribute('style', 'padding-top: 5px; padding-bottom: 5px')
        label.setAttribute('for', shelfId+'-mode-'+mode)
        label.innerHTML = mode

        div.appendChild(input)
        div.appendChild(label)

        modes_div.appendChild(div)
    }

    radio_div.appendChild(span)
    radio_div.appendChild(modes_div)

    div.appendChild(radio_div)

    if (shelf['mode'] == 0) {
        const main_div = document.createElement('div')
        main_div.setAttribute('class', 'border border-secondary')
        main_div.setAttribute('id', shelfId+'-msg-div')
        main_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

        const p = document.createElement('p')
        p.setAttribute('class', 'automatic')
        p.setAttribute('id', shelf['_id']+'-shelf-p')
        p.innerHTML = 'Automatic Scheduling'
        
        main_div.appendChild(p)

        div.append(main_div)
    } else {
        const slider_div = document.createElement('div')
        //slider_div.setAttribute('class', 'border border-secondary')
        slider_div.setAttribute('id', shelfId+'-msg-div')
        slider_div.setAttribute('style', 'margin: 10px 10px 10px 10px')

        const label = document.createElement('div')
        label.setAttribute('class', 'form-label')
        label.setAttribute('id', shelfId+'-range-label')

        const input = document.createElement('input')
        input.setAttribute('type', 'range')
        input.setAttribute('class', 'form-range')
        input.setAttribute('min', '0')
        input.setAttribute('max', '100')
        input.setAttribute('id', shelfId-'-range')
        input.defaultValue = shelf['wValue'] 
        input.onchange = function() { whiteSlider(shelf, input) }
        
        slider_div.appendChild(label)
        slider_div.appendChild(input)

        label.innerHTML = 'LED Brightness: ' + input.value + '%'

        div.append(slider_div)

    }

    return div
}


const tbdShelf = function(shelf, input) {

    const div = document.createElement('div')
    div.setAttribute('class', 'border border-danger')
    div.setAttribute('style', 'margin: 1rem 1rem 1rem 1rem')
    div.setAttribute('id', shelf['_id']+'-shelf-body-div')

    const p = document.createElement('p')
    p.setAttribute('class', 'unconfigured')
    p.setAttribute('id', shelf['_id']+'-shelf-p')
    p.innerHTML = 'Unconfigured Shelf'
    
    div.appendChild(p)

    return div

}

const rgbSlider = function(shelf, input, color) {
    const r = color == 'r' ? input.value : shelf['rValue']
    const g = color == 'g' ? input.value : shelf['gValue']
    const b = color == 'b' ? input.value : shelf['bValue']
    data = {
        _id: shelf['_id'],
        rValue: r,
        gValue: g,
        bValue: b
    }
    const options = {
        method: 'PUT',
        body: new URLSearchParams(data)
    };
    fetch('/api/shelf/value', options)
    .then(response => response.json())
    .then(shelf => { 
        document.getElementById(shelf['_id']+'-range-label-'+color).innerHTML = full[color] + ': ' + input.value
        input.value = shelf[color+'Value'] 
    })
    .catch(err => alert('cant change shelf value ' + err));
}

const whiteSlider = function(shelf, input) {
    const options = {
        method: 'PUT',
        body: new URLSearchParams({_id: shelf['_id'], wValue: input.value})
    };
    fetch('/api/shelf/value', options)
    .then(response => response.json())
    .then(shelf => { 
        document.getElementById(shelf['_id']+'-range-label').innerHTML = 'LED Brightness: ' + input.value + '%'
        input.value = shelf['wValue'] 
    })
    .catch(err => alert('cant change shelf value ' + err));
}

const whiteModeSelected = function(shelf, mode) {
    var m = mode == 'auto' ? 0 : 1
    const options = {
        method: 'PUT',
        body: new URLSearchParams({_id: shelf['_id'], mode: m})
    };
    fetch('/api/shelf/mode', options)
    .then(response => response.json())
    .then(shelf => {
        const body = document.getElementById(shelf['_id']+'-body')
        const body_div = document.getElementById(shelf['_id']+'-shelf-body-div')
        body.removeChild(body_div)
        const shelf_div = generateShelf(shelf)
        body.appendChild(shelf_div)
    })
    .catch(err => alert('cant save shelf mode ' + err));
}

const rgbModeSelected = function(shelf, mode) {
    var m = mode == 'off' ? 0 : mode == 'on' ? 1 : 2
    const options = {
        method: 'PUT',
        body: new URLSearchParams({_id: shelf['_id'], mode: m})
    };
    fetch('/api/shelf/mode', options)
    .then(response => response.json())
    .then(shelf => {
        const body = document.getElementById(shelf['_id']+'-body')
        const body_div = document.getElementById(shelf['_id']+'-shelf-body-div')
        body.removeChild(body_div)
        const shelf_div = generateShelf(shelf)
        body.appendChild(shelf_div)
    })
    .catch(err => alert('cant save shelf mode ' + err));
}


