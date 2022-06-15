var last_config;

const loadPwms = function() {
    fetch('/api/config', { method: 'GET' })
        .then(response => response.json())
        .then(config => {
            const pwms = config['pwms']
            for (var i = 0; i < pwms.length; i++) {
                const root = create_pwm(i, config[pwms[i]], config)
                pwm_div.appendChild(root)
            }
            last_config = config
        })
        .catch(err => alert('unable to load configs '+err));
}

const newPwm = function() {
    fetch('/config/pwm', { method: 'POST' })
        .then(response => response.json())
        .then(response => loadNewPwm(response))
        .catch(err => alert('unable to create new pwm '+err))
    return false
}

const loadNewPwm = function(pwm) {
    last_config['pwms'].push(pwm['_id'])
    last_config[pwm['_id']] = pwm
    
    const root = create_pwm(last_config['pwms'].length-1, pwm, null)

    /* inserts the new pwm module into the pwm divs */
    pwm_div.appendChild(root)
    
    /* rerenders the admin dashboard */
    document.getElementById('root').removeChild(top_div)
    document.getElementById('root').insertBefore(top_div, bot_div)
    return false;
}

const create_pwm = function(pI, pwm, config) {
    const pwmId = pwm['_id']

    const root = document.createElement('div')
    root.setAttribute('class', 'col-auto mb-3')
    root.setAttribute('id', pwmId+'-root')
  
    const card = document.createElement('div')
    card.setAttribute('class', 'card bg-light')
    card.setAttribute('style', 'width: 20rem')
    card.setAttribute('id', pwmId+'-card')
    
    const body = document.createElement('div')
    body.setAttribute('class', 'card-body')
    body.setAttribute('id', pwmId+'-body')

    const header = document.createElement('div')
    header.setAttribute('class', 'card-header')
    header.setAttribute('id', pwmId+'-header')

    const footer = document.createElement('div')
    footer.setAttribute('class', 'card-footer')
    footer.setAttribute('id', pwmId+'-footer')

    const h5 = document.createElement('h5')
    h5.setAttribute('id', pwmId+'-header-h5')
    h5.innerHTML = '[0x' + (40+pI) + ']: ' + pwm['name']
    header.appendChild(h5)
    
    const addrs = pwm['addrs']
    for (var i = 0; i < 4; i++) {
      const ul = document.createElement('ul')
      ul.setAttribute('class', 'p-0')

      for (var j = 0; j < 4; j++) {
        const n = (i*4 + j)

        var addr = 'a' + n

        const li = document.createElement('li')
        li.setAttribute('class', 'list-group-item  p-0 my-0')

        const div = document.createElement('div')
        div.setAttribute('class', 'addr-line')
        div.setAttribute('id', pwmId+'-'+addr+'-div')

        var prepad = n < 10 ? '0' + n : n
        const p = document.createElement('p')
        p.setAttribute('style', 'float: left; ')

        if (addrs[addr] != null) {
            const shelf = config[addrs[addr]]
            const name = shelf['name'] + ' ' + shelfPin(shelf, addr)
            p.setAttribute('class', 'font-weight-bold')
            p.innerHTML = prepad + ': ' + name
        } else {
            p.innerHTML = prepad + ': available'
            p.setAttribute('class', 'text-muted')
        }

        div.appendChild(p)
        li.appendChild(div)
        ul.appendChild(li)
      }
      body.appendChild(ul)
    }
  
    const options_div = document.createElement('div')
    options_div.setAttribute('id', pwmId+'-options-div')

    const edit_btn = document.createElement('button')
    edit_btn.setAttribute('class', 'btn btn-warning')
    edit_btn.setAttribute('style', 'float: right')
    edit_btn.setAttribute('id', pwmId+'-edit-btn')
    edit_btn.onclick = function() { editPwm(pI, pwm) }
    edit_btn.innerHTML = 'Edit'
    options_div.appendChild(edit_btn)

    body.appendChild(options_div)
  
    const small = document.createElement('small')
    small.setAttribute('class', 'text-muted')
    small.innerHTML = pwm['_id']
    footer.appendChild(small)
    
    /* build the main card with 3 componenets */
    card.appendChild(header)
    card.appendChild(body)
    card.appendChild(footer)
  
    /* add the card to the root card manager for card grouping */
    root.appendChild(card)

    return root
}

const editPwm = function(pI, pwm) {
    const pwmId = pwm['_id']

    const options_div = document.getElementById(pwmId+'-options-div')
    const edit_btn = document.getElementById(pwmId+'-edit-btn')

    options_div.removeChild(edit_btn)

    const header = document.getElementById(pwmId+'-header')
    const h5 = document.getElementById(pwmId+'-header-h5')
    header.removeChild(h5)

    const input_div = document.createElement('div')
    input_div.setAttribute('id', pwmId+'-input-div')
    input_div.setAttribute('class', 'input-group')

    const prepend_div = document.createElement('div')
    prepend_div.setAttribute('class', 'input-group-prepend')

    const span = document.createElement('span')
    span.setAttribute('class', 'input-group-text')
    span.setAttribute('id', pwmId+'-input-span')
    span.innerHTML = '[0x' + (40+pI) + ']'

    prepend_div.appendChild(span)

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('class', 'form-control')
    input.setAttribute('placeholder', 'new pwm name')

    input_div.appendChild(prepend_div)
    input_div.appendChild(input)

    header.appendChild(input_div)

    const save_btn = document.createElement('button')
    save_btn.setAttribute('class', 'btn btn-success')
    save_btn.setAttribute('style', 'float: right')
    save_btn.setAttribute('id', pwmId+'-save-btn')
    save_btn.onclick = function() { savePwm(pI, pwm, input.value, h5, input_div) }
    save_btn.innerHTML = 'Save'
    options_div.appendChild(save_btn)

    const cancel_btn = document.createElement('button')
    cancel_btn.setAttribute('class', 'btn btn-secondary')
    cancel_btn.setAttribute('style', 'float: right; margin-right: 10px')
    cancel_btn.setAttribute('id', pwmId+'-cancel-btn')
    cancel_btn.onclick = function() { cancelPwm(pI, pwm, h5, input_div) }
    cancel_btn.innerHTML = 'Cancel'
    options_div.appendChild(cancel_btn)

    const delete_btn = document.createElement('button')
    delete_btn.setAttribute('class', 'btn btn-danger')
    delete_btn.setAttribute('style', 'float: left; margin-right: 10px')
    delete_btn.setAttribute('id', pwmId+'-delete-btn')
    delete_btn.onclick = function() { deletePwm(pwm) }
    delete_btn.innerHTML = 'Delete'
    options_div.appendChild(delete_btn)

    const addrs = pwm['addrs']
    for (var i = 0; i < 16; i++) {
        const addr = 'a' + i
        if (addrs[addr] != null) {
            const addr_div = document.getElementById(pwmId+'-'+addr+'-div')

            const btn = document.createElement('button')
            btn.setAttribute('style', 'float: right')
            btn.setAttribute('class', 'btn btn-danger')
            btn.setAttribute('id', pwmId+'-'+addr+'-x-btn')
            btn.onclick = function() { disconnectShelf(addrs[addr]) }
            btn.innerHTML = 'X'

            addr_div.appendChild(btn)
        }
    }

}

const savePwm = function(pI, pwm, newName, h5, input_div) {
    if (newName.length == 0) {
        cancelPwm(pI, pwm, h5, input_div)
    }else{
        const options = {
            method: 'PUT',
            body: new URLSearchParams({_id: pwm['_id'], name: newName})
        };
        fetch('/config/pwm/name', options)
            .then(response => response.json())
            .then(response => pwmSaved(pI, response, h5, input_div))
            .catch(err => alert('unable to save pwm ' + err));
    }
}

const pwmSaved = function(pI, pwm, h5, input_div) {
    h5.innerHTML = '[0x' + (40+pI) + ']: ' + pwm['name']
    cancelPwm(pI, pwm, h5, input_div)
}

const cancelPwm = function(pI, pwm, h5, input_div) {

    const pwmId = pwm['_id']
    const addrs = pwm['addrs']
    
    const header = document.getElementById(pwmId+'-header')
    header.removeChild(input_div)
    header.appendChild(h5)

    for (var i = 0; i < 16; i++) {
        const addr = 'a' + i
        if (addrs[addr] != null) {
            const addr_div = document.getElementById(pwmId+'-'+addr+'-div')
            const btn = document.getElementById(pwmId+'-'+addr+'-x-btn')

            addr_div.removeChild(btn)
        }
    }

    const options_div = document.getElementById(pwmId+'-options-div')
    options_div.removeChild(document.getElementById(pwmId+'-save-btn'))
    options_div.removeChild(document.getElementById(pwmId+'-cancel-btn'))
    options_div.removeChild(document.getElementById(pwmId+'-delete-btn'))

    const edit_btn = document.createElement('button')
    edit_btn.setAttribute('class', 'btn btn-warning')
    edit_btn.setAttribute('style', 'float: right')
    edit_btn.setAttribute('id', pwmId+'-edit-btn')
    edit_btn.onclick = function() { editPwm(pI, pwm) }
    edit_btn.innerHTML = 'Edit'
    options_div.appendChild(edit_btn)
}

const deletePwm = function(pwm) {
    
    const addrs = pwm['addrs']
    for (var i = 0; i < 16; i++) {
        const addr = 'a' + i
        if (addrs[addr] != null) {
            alert('Shelves are attached to this pwm. Please disconnect before deleting.')
            return
        }
    }

    fetch('/config/pwm/' + pwm['_id'], {method: 'DELETE'})
        .then(response => response.json())
        .then(response => pwmDeleted(response))
        .catch(err => alert('unable to delete pwm ' + err));
    
}

const pwmDeleted = function(pwm) {
    
    while (pwm_div.firstChild) {
        pwm_div.removeChild(pwm_div.firstChild);
    }

    loadPwms()
}

const disconnectShelf = function(shelfId) {
    let isExecuted = confirm("Are you sure you want to disconnect this shelf?");
    if (isExecuted) {
        const options = {
            method: 'PUT',
            body: new URLSearchParams({shelfId: shelfId})
        };
        fetch('/config/pwm/dc', options)
            .then(response => response.json())
            .then(response => {
                while (pwm_div.firstChild) {
                    pwm_div.removeChild(pwm_div.firstChild);
                }
                loadPwms()
            })
            .catch(err => alert('unable to dc shelf ' + err));
    }
}

const shelfPin = function(shelf, addr) {
    if (shelf['kind'] == 'white' || shelf['kind'] == 'hybrid') {
        if (shelf['wAddr'] == addr) {
            return '(white)'
        }
    }
    if (shelf['kind'] == 'rgb' || shelf['kind'] == 'hybrid') {
        if (shelf['rAddr'] == addr)
            return '(red)'
        if (shelf['gAddr'] == addr)
            return '(green)'
        if (shelf['bAddr'] == addr)
            return '(blue)'
    }
    return '(unknown)'
}

const refreshRpi = function() {
    fetch('/config/pwm/resync', { method: 'PUT' })
        .then(response => response.json())
        .catch(err => alert('unable to refresh pwm ' + err));
}
