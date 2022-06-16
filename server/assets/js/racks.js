
const newRack = function() {
    fetch('/config/rack', { method: 'POST' })
        .then(response => response.json())
        .then(response => loadNewRack(response))
        .catch(err => alert('unable to create new pwm '+err))
    return false
}

const loadNewRack = function(rack) {
    last_config['racks'].push(rack['_id'])
    last_config[rack['_id']] = rack
    const root = create_rack(rack, last_config)
    rack_div.appendChild(root)
}

const loadRacks = function() {
    fetch('/api/config', { method: 'GET' })
        .then(response => response.json())
        .then(response => load(response))
        .catch(err => alert('unable to load configs '+err));
}

const load = function(config) {
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

    const footer = document.createElement('div')
    footer.setAttribute('class', 'card-footer')
    footer.setAttribute('id', rackId+'-footer')

    const h5 = document.createElement('h5')
    h5.setAttribute('id', rackId+'-header-h5')
    h5.innerHTML = '[Rack]: ' + rack['name']
    header.appendChild(h5)

    const small = document.createElement('small')
    small.setAttribute('class', 'text-muted')
    small.innerHTML = rack['_id']
    footer.appendChild(small)
    
    const options_div = document.createElement('div')
    options_div.setAttribute('id', rackId+'-options-div')

    const edit_btn = document.createElement('button')
    edit_btn.setAttribute('class', 'btn btn-warning')
    edit_btn.setAttribute('style', 'float: right')
    edit_btn.setAttribute('id', rackId+'-edit-btn')
    edit_btn.onclick = function() { editRack(rack, config) }
    edit_btn.innerHTML = 'Edit'
    options_div.appendChild(edit_btn)

    const add_btn = document.createElement('button')
    add_btn.setAttribute('class', 'btn btn-primary')
    add_btn.setAttribute('style', 'float: left')
    add_btn.setAttribute('id', rackId+'-add-btn')
    add_btn.onclick = function() { addNewShelf(rack, config, body, options_div) }
    add_btn.innerHTML = '+ Shelf'
    options_div.appendChild(add_btn)

    const shelves = rack['shelves']
    for (var i = 0; i < shelves.length; i++) {
        const shelf_root = create_shelf(config[shelves[i]])
        body.appendChild(shelf_root)
    }

    body.appendChild(options_div)

    /* build the main card with 3 componenets */
    card.appendChild(header)
    card.appendChild(body)
    card.appendChild(footer)
  
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

    const footer = document.createElement('div')
    footer.setAttribute('class', 'card-footer')
    footer.setAttribute('id', shelfId+'-footer')

    const h5 = document.createElement('h5')
    h5.setAttribute('id', shelfId+'-header-h5')
    h5.innerHTML = '[Shelf]: ' + shelf['name']
    header.appendChild(h5)

    const small = document.createElement('small')
    small.setAttribute('class', 'text-muted')
    small.innerHTML = shelfId
    footer.appendChild(small)
    
    const options_div = document.createElement('div')
    options_div.setAttribute('id', shelfId+'-options-div')

    const configure_btn = document.createElement('button')
    configure_btn.setAttribute('class', 'btn btn-link')
    configure_btn.setAttribute('style', 'float: right;')
    configure_btn.setAttribute('id', shelfId+'-configure-btn')
    configure_btn.onclick = function() { configureShelf(shelf) }
    configure_btn.innerHTML = 'Configure'
    options_div.appendChild(configure_btn)

    const shelf_div = generateShelf(shelf)

    body.appendChild(shelf_div)
    body.appendChild(options_div)

    card.appendChild(header)
    card.appendChild(body)
  
    root.appendChild(card)

    return root
}

const configureShelf = function(shelf) {
    
    const shelfId = shelf['_id']

    const shelf_body = document.getElementById(shelfId+'-body')
    const old_div = document.getElementById(shelfId+'-shelf-body-div')

    const options_div = document.getElementById(shelfId+'-options-div')
    const configure_btn = document.getElementById(shelfId+'-configure-btn')

    options_div.removeChild(configure_btn)

    console.log(shelf_body)
    console.log(old_div)
    shelf_body.removeChild(old_div)
    shelf_body.removeChild(options_div)

    const header = document.getElementById(shelfId+'-header')
    const h5 = document.getElementById(shelfId+'-header-h5')
    header.removeChild(h5)

    const input_div = document.createElement('div')
    input_div.setAttribute('id', shelfId+'-input-div')
    input_div.setAttribute('class', 'input-group')

    const prepend_div = document.createElement('div')
    prepend_div.setAttribute('class', 'input-group-prepend')

    const name_span = document.createElement('span')
    name_span.setAttribute('class', 'input-group-text')
    name_span.setAttribute('id', shelfId+'-input-span')
    name_span.innerHTML = '[Shelf]: '

    prepend_div.appendChild(name_span)

    const shelf_name = document.createElement('input')
    shelf_name.setAttribute('type', 'text')
    shelf_name.setAttribute('class', 'form-control')
    shelf_name.setAttribute('placeholder', 'new shelf name')

    input_div.appendChild(prepend_div)
    input_div.appendChild(shelf_name)

    header.appendChild(input_div)

    const new_div = document.createElement('div')
    new_div.setAttribute('id', shelfId+'-configure-body')
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

    const kinds = ['white', 'rgb', 'hybrid']
    for (var i = 0; i < kinds.length; i++) {
        const div = document.createElement('div')
        div.setAttribute('class', 'form-check form-check-inline')
        //div.setAttribute('style', 'padding: 5px 5px 5px 5px')

        const kind = kinds[i]
        const input = document.createElement('input')
        input.setAttribute('class', 'form-check-input')
        input.setAttribute('type', 'radio')
        input.setAttribute('name', shelfId+'-kinds')
        input.setAttribute('id', shelfId+'-kind-'+kinds[i])
        input.setAttribute('value', kinds[i])
        input.onclick = function() {
            radioSelected(shelf, kind)
        }

        if (i == 0) {
            input.checked = true
        }

        const label = document.createElement('label')
        label.setAttribute('class', 'form-check-label')
        label.setAttribute('style', 'padding-top: 5px; padding-bottom: 5px')
        label.setAttribute('for', shelfId+'-kind-'+kinds[i])
        label.innerHTML = kinds[i]

        div.appendChild(input)
        div.appendChild(label)

        kinds_div.appendChild(div)
    }

    radio_div.appendChild(span)
    radio_div.appendChild(kinds_div)

    new_div.appendChild(radio_div)

    const save_btn = document.createElement('button')
    save_btn.setAttribute('class', 'btn btn-success')
    save_btn.setAttribute('style', 'float: right; margin-right: 10px; margin-bottom: 10px')
    save_btn.setAttribute('id', shelfId+'-save-btn')
    save_btn.onclick = function() { saveShelf(shelf, shelf_name.value, configure_btn, h5, input_div, old_div) }
    save_btn.innerHTML = 'Save'
    options_div.appendChild(save_btn)

    const cancel_btn = document.createElement('button')
    cancel_btn.setAttribute('class', 'btn btn-secondary')
    cancel_btn.setAttribute('style', 'float: right; margin-right: 10px')
    cancel_btn.setAttribute('id', shelfId+'-cancel-btn')
    cancel_btn.onclick = function() { cancelShelf(shelf, configure_btn, h5, input_div, old_div) }
    cancel_btn.innerHTML = 'Cancel'
    options_div.appendChild(cancel_btn)

    const delete_btn = document.createElement('button')
    delete_btn.setAttribute('class', 'btn btn-danger')
    delete_btn.setAttribute('style', 'float: left; margin-left: 10px')
    delete_btn.setAttribute('id', shelfId+'-delete-btn')
    delete_btn.onclick = function() { deleteShelf(last_config[shelf['rackId']], last_config, shelf['_id']) }
    delete_btn.innerHTML = 'Delete'
    options_div.appendChild(delete_btn)

    shelf_body.appendChild(new_div)
    shelf_body.appendChild(options_div)

    radioSelected(shelf, 'white')
}

const saveShelf = function(shelf, newName, configure_btn, h5, input_div, old_div) {
    const shelfId = shelf['_id']

    var kind = 'white'
    const kinds = ['white', 'rgb', 'hybrid']
    for (var i = 0; i < 3; i++){
        const input = document.getElementById(shelfId+'-kind-'+kinds[i])

        if (input.checked) {
            kind = input.value
            break
        }
    }

    const white_pwm = document.getElementById(shelfId+'-white-pwm')
    const rgb_pwm = document.getElementById(shelfId+'-rgb-pwm')

    const white_select = document.getElementById(shelfId+'-white-select')
    const red_select = document.getElementById(shelfId+'-red-select')
    const green_select = document.getElementById(shelfId+'-green-select')
    const blue_select = document.getElementById(shelfId+'-blue-select')

    const white_addr = white_select != null ? white_select.value.length != 0 ? white_select.value : null : null
    const red_addr = red_select != null ? red_select.value.length != 0 ? red_select.value : null : null
    const green_addr = green_select != null ? green_select.value.length != 0 ? green_select.value : null : null
    const blue_addr = blue_select != null ? blue_select.value.length != 0 ? blue_select.value : null : null

    if (kind == 'white' || kind == 'hybrid') {
        if (white_addr == null) {
            alert('Please select a pwm address for white pin')
            return
        }
    }
    if (kind == 'rgb' || kind == 'hybrid') {
        if (red_addr == null) {
            alert('Please select a pwm address for red pin'); return;
        }
        if (green_addr == null) {
            alert('Please select a pwm address for green pin'); return;
        }
        if (blue_addr == null) {
            alert('Please select a pwm address for blue pin'); return;
        }

        if (kind == 'rgb') {
            const arr = [red_addr, green_addr, blue_addr]
            const s = new Set(arr)
            if (arr.length != s.size){
                alert('Duplicate addresses were used. Please use unique address per pin'); return;
            }
        }
        if (kind == 'hybrid') {
            const temp_white_addr = null;
            if (white_pwm.value == rgb_pwm.value) {
                temp_white_addr = white_addr
            }
            const arr = [temp_white_addr, red_addr, green_addr, blue_addr]
            const s = new Set(arr)
            if (arr.length != s.size){
                alert('Duplicate addresses were used. Please use unique address per pin'); return;
            }
        }
    }

    const data = {
        '_id': shelfId,
        'kind': kind
    }

    if (kind == 'white' || kind == 'hybrid') {
        data['pwmIdW'] = white_pwm.value
        data['wAddr'] = white_addr
    }

    if (kind == 'rgb' || kind == 'hybrid') {
        data['pwmIdRGB'] = rgb_pwm.value
        data['rAddr'] = red_addr
        data['gAddr'] = green_addr
        data['bAddr'] = blue_addr
    }

    const options = {
        method: 'PUT',
        body: new URLSearchParams(data)
    };

    fetch('/config/shelf/addr', options)
        .then(response => response.json())
        .then(shelf => { shelfSaved(shelf, newName, configure_btn, h5, input_div, old_div) })
        .catch(err => alert('unable to save shelf ' + err));

}

const shelfSaved = function(shelf, newName, configure_btn, h5, input_div, old_div) {
    pwmDeleted()
    last_config[shelf['_id']] = shelf
    if (newName.length == 0) {
        cancelShelf(shelf, configure_btn, h5, input_div, old_div) 
    }else{
        const options = {
            method: 'PUT',
            body: new URLSearchParams({_id: shelf['_id'], name: newName})
        };

        fetch('/config/shelf/name', options)
            .then(response => response.json())
            .then(shelf => {
                last_config[shelf['_id']] = shelf
                h5.innerHTML = '[Shelf]: ' + shelf['name']
                cancelShelf(shelf, configure_btn, h5, input_div, old_div) 
            })
            .catch(err => alert('cant save shelf name ' + err));
    }
}

const radioSelected = function(shelf, kind) {
    console.log('radio value selected ' + kind)
    console.log(shelf)

    const shelfId = shelf['_id']
    
    const configure_div = document.getElementById(shelfId+'-configure-body')
    const white_div = document.getElementById(shelfId+'-white-configure-div')
    const rgb_div = document.getElementById(shelfId+'-rgb-configure-div')
    if (white_div != null) {
        configure_div.removeChild(white_div)
    } 
    if (rgb_div != null) {
        configure_div.removeChild(rgb_div)
    } 

    if (kind == 'white' || kind == 'hybrid') {

        const div = document.createElement('div')
        div.setAttribute('class', 'form-control mb-3')
        //div.setAttribute('style', 'background-color: red; padding-bottom: 0px')
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
        
        pwms = last_config['pwms']
        for (var i = 0; i < pwms.length; i++) {
            const option = document.createElement('option')
            option.setAttribute('value', pwms[i])
            option.innerHTML = '[0x' + (40+i) + ']: ' + last_config[pwms[i]]['name']

            pwm_select.appendChild(option)
        }

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
        addr_select.disabled = true

        pwm_select.selectedIndex = -1;
        pwm_select.onchange = function() {
            pwmSelected(shelf, pwm_select.value, addr_select)
        }

        addr_div.appendChild(addr_span)
        addr_div.appendChild(addr_select)

        div.appendChild(pwm_div)
        div.appendChild(addr_div)

        configure_div.appendChild(div)
    }
    if (kind == 'rgb' || kind == 'hybrid') {

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
        
        pwms = last_config['pwms']
        for (var i = 0; i < pwms.length; i++) {
            const option = document.createElement('option')
            option.setAttribute('value', pwms[i])
            option.innerHTML = '[0x' + (40+i) + ']: ' + last_config[pwms[i]]['name']

            pwm_select.appendChild(option)
        }

        pwm_div.appendChild(pwm_span)
        pwm_div.appendChild(pwm_select)

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
            addr_select.setAttribute('id', shelfId+'-'+color+'-select')
            addr_select.setAttribute('style', 'width: auto')
            addr_select.disabled = true
    
            addr_div.appendChild(addr_span)
            addr_div.appendChild(addr_select)
    
            div.appendChild(addr_div)
        }
        
        pwm_select.selectedIndex = -1;
        pwm_select.onchange = function() {
            rgbPwmSelected(shelf, pwm_select.value)
        }

        configure_div.appendChild(div)
    }
}

const rgbPwmSelected  = function(shelf, value) {
    
    const colors = ['red', 'green', 'blue']
    for (var k = 0; k < colors.length; k++) {
        const color = colors[k]

        const addr_select = document.getElementById(shelf['_id']+'-'+color+'-select')
        
        while (addr_select.firstChild) {
            addr_select.removeChild(addr_select.firstChild);
        }

        const pwm = last_config[value]
        const addrs = pwm['addrs']
        for (var i = 0; i < 16; i++) {
            const addr = 'a' + i

            if (addrs[addr] == null) {
                const option = document.createElement('option')
                option.setAttribute('value', addr)
                option.innerHTML = addr 
                addr_select.appendChild(option)
            }

        }

        addr_select.selectedIndex = -1
        addr_select.disabled = false

        console.log(addr_select)
    }

}

const pwmSelected = function(shelf, value, addr_select) {

    console.log(value)
    console.log(addr_select)

    while (addr_select.firstChild) {
        addr_select.removeChild(addr_select.firstChild);
    }

    const pwm = last_config[value]
    const addrs = pwm['addrs']
    for (var i = 0; i < 16; i++) {
        const addr = 'a' + i

        if (addrs[addr] == null) {
            const option = document.createElement('option')
            option.setAttribute('value', addr)
            option.innerHTML = addr 
            addr_select.appendChild(option)
        }

    }

    addr_select.selectedIndex = -1
    addr_select.disabled = false
}

const cancelShelf = function(shelf, configure_btn, h5, input_div, old_div) {

    const shelfId = shelf['_id']

    const options_div = document.getElementById(shelfId+'-options-div')
    
    options_div.removeChild(document.getElementById(shelfId+'-save-btn'))
    options_div.removeChild(document.getElementById(shelfId+'-cancel-btn'))
    options_div.removeChild(document.getElementById(shelfId+'-delete-btn'))

    options_div.appendChild(configure_btn)

    const header = document.getElementById(shelfId+'-header')
    header.removeChild(input_div)
    header.appendChild(h5)

    const shelf_body = document.getElementById(shelfId+'-body')

    const configure_body = document.getElementById(shelfId+'-configure-body')
    shelf_body.removeChild(configure_body)

    const new_shelf_div = generateShelf(shelf)
    shelf_body.insertBefore(new_shelf_div, options_div)

}

const generateShelf = function(shelf) {

    if (shelf['kind'] == 'tbd')
        return tbdShelf(shelf)

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

const tbdShelf = function(shelf) {

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

const editRack = function(rack, config) {

    const rackId = rack['_id']
    
    const options_div = document.getElementById(rackId+'-options-div')
    const edit_btn = document.getElementById(rackId+'-edit-btn')
    const add_btn = document.getElementById(rackId+'-add-btn')

    options_div.removeChild(edit_btn)
    options_div.removeChild(add_btn)

    const header = document.getElementById(rackId+'-header')
    const h5 = document.getElementById(rackId+'-header-h5')
    header.removeChild(h5)

    const input_div = document.createElement('div')
    input_div.setAttribute('id', rackId+'-input-div')
    input_div.setAttribute('class', 'input-group')

    const prepend_div = document.createElement('div')
    prepend_div.setAttribute('class', 'input-group-prepend')

    const span = document.createElement('span')
    span.setAttribute('class', 'input-group-text')
    span.setAttribute('id', rackId+'-input-span')
    span.innerHTML = '[Rack]: '

    prepend_div.appendChild(span)

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', 'form-control')
    input.setAttribute('placeholder', 'new rack name')

    input_div.appendChild(prepend_div)
    input_div.appendChild(input)

    header.appendChild(input_div)

    const save_btn = document.createElement('button')
    save_btn.setAttribute('class', 'btn btn-success')
    save_btn.setAttribute('style', 'float: right')
    save_btn.setAttribute('id', rackId+'-save-btn')
    save_btn.onclick = function() { saveRack(rack, input.value, edit_btn, add_btn, h5, input_div) }
    save_btn.innerHTML = 'Save'
    options_div.appendChild(save_btn)

    const cancel_btn = document.createElement('button')
    cancel_btn.setAttribute('class', 'btn btn-secondary')
    cancel_btn.setAttribute('style', 'float: right; margin-right: 10px')
    cancel_btn.setAttribute('id', rackId+'-cancel-btn')
    cancel_btn.onclick = function() { cancelRack(rack, edit_btn, add_btn, h5, input_div) }
    cancel_btn.innerHTML = 'Cancel'
    options_div.appendChild(cancel_btn)

    const delete_btn = document.createElement('button')
    delete_btn.setAttribute('class', 'btn btn-danger')
    delete_btn.setAttribute('style', 'float: left; margin-right: 10px')
    delete_btn.setAttribute('id', rackId+'-delete-btn')
    delete_btn.onclick = function() { deleteRack(rack) }
    delete_btn.innerHTML = 'Delete'
    options_div.appendChild(delete_btn)

    const shelves = rack['shelves']
    for (var i = 0; i < shelves.length; i++) {
        const shelfId = shelves[i]

        const shelf_options_div = document.getElementById(shelfId+'-options-div')
        
        const btn = document.createElement('button')
        btn.setAttribute('style', 'float: left; margin-bottom: 15px; margin-left: 15px')
        btn.setAttribute('class', 'btn btn-danger')
        btn.setAttribute('id', shelfId+'-remove-btn')
        btn.onclick = function() { deleteShelf(rack, config, shelfId) }
        btn.innerHTML = 'remove'

        const configure_btn = document.getElementById(shelfId+'-configure-btn')
        if (configure_btn == null) {
            console.log('this shelf is bad ' + shelfId)
        }else {
            shelf_options_div.removeChild(configure_btn)
            shelf_options_div.appendChild(btn)
        }
    }

}

const saveRack = function(rack, newName,  edit_btn, add_btn, h5, input_div) {
    if (newName.length == 0) {
        cancelRack(rack, edit_btn, add_btn, h5, input_div)
    }else{
        const options = {
            method: 'PUT',
            body: new URLSearchParams({_id: rack['_id'], name: newName})
        };
        fetch('/config/rack/name', options)
            .then(response => response.json())
            .then(response => rackSaved(response, edit_btn, add_btn, h5, input_div))
            .catch(err => alert('unable to save rack ' + err));
    }
}

const rackSaved = function(rack, edit_btn, add_btn, h5, input_div) {
    h5.innerHTML = '[Rack]: ' + rack['name']
    cancelRack(rack, edit_btn, add_btn, h5, input_div)
}

const deleteShelf = function(rack, config, shelfId) {
    let isExecuted = confirm("Are you sure you want to delete this shelf?");
    if (!isExecuted) {
        return
    }
    fetch('/config/shelf/' + shelfId, {method: 'DELETE'})
        .then(response => response.json())
        .then(shelf => {
            rack['shelves'].splice(rack['shelves'].indexOf(shelf['_id']), 1)
            const rack_div = document.getElementById(rack['_id']+'-body')
            const shelf_div = document.getElementById(shelf['_id']+'-root')
            rack_div.removeChild(shelf_div)
            
            if (shelf['kind'] != 'tbd') {
                console.log('refresh pwm deleted???')
                pwmDeleted()
            }
        })
        .catch(err => alert('unable to delete shelf ' + err))
}

const cancelRack = function(rack, edit_btn, add_btn, h5, input_div) {
    
    const rackId = rack['_id']

    const options_div = document.getElementById(rackId+'-options-div')
    
    options_div.removeChild(document.getElementById(rackId+'-save-btn'))
    options_div.removeChild(document.getElementById(rackId+'-cancel-btn'))
    options_div.removeChild(document.getElementById(rackId+'-delete-btn'))

    const shelves = rack['shelves']
    for (var i = 0; i < shelves.length; i++) {
        const shelfId = shelves[i]
        const shelf_options_div = document.getElementById(shelfId+'-options-div')
        const remove_btn = document.getElementById(shelfId+'-remove-btn')
        
        if (remove_btn != null) {
            shelf_options_div.removeChild(remove_btn)

            const configure_btn = document.createElement('button')
            configure_btn.setAttribute('class', 'btn btn-link')
            configure_btn.setAttribute('style', 'float: right;')
            configure_btn.setAttribute('id', shelfId+'-configure-btn')
            configure_btn.onclick = function() { configureShelf(last_config[shelfId]) }
            configure_btn.innerHTML = 'Configure'
            shelf_options_div.appendChild(configure_btn)
        }
    }

    options_div.appendChild(edit_btn)
    options_div.appendChild(add_btn)

    const header = document.getElementById(rackId+'-header')
    header.removeChild(input_div)
    header.appendChild(h5)
}

const deleteRack = function(rack) {
    if (rack['shelves'].length != 0) {
        alert('There are shelves on this rack. Delete the shelves before deleting rack.')
        return
    }
    fetch('/config/rack/' + rack['_id'], {method: 'DELETE'})
        .then(response => response.json())
        .then(response => {
            last_config['racks'].splice(last_config['racks'].indexOf(rack['_id']), 1)
            const root = document.getElementById(response['_id']+'-root')
            rack_div.removeChild(root)
        })
        .catch(err => alert('unable to delete rack ' + err))
}

const addNewShelf = function(rack, config, body, options_div) {
    const options = {
        method: 'POST',
        body: new URLSearchParams({rackId: rack['_id']})
    };
    
    fetch('/config/shelf', options)
    .then(response => response.json())
    .then(shelf => {
        rack['shelves'].push(shelf['_id'])
        config[shelf['_id']] = shelf
        const shelf_root = create_shelf(shelf)
        body.insertBefore(shelf_root, options_div)
    })
    .catch(err => alert('unable to add new shelf ' + err));
}


