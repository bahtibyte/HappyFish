
const newRack = function() {
    fetch('/config/rack', { method: 'POST' })
        .then(response => response.json())
        .then(response => loadNewRack(response))
        .catch(err => alert('unable to create new pwm '+err))
    return false
}

const loadNewRack = function(rack) {
    const root = create_rack(rack, null)
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

    const racks = config['racks']
    for (var i = 0; i < racks.length; i++) {
        const root = create_rack(config[racks[i]], config)
        rack_div.appendChild(root)
    }
    last_config = config
}

const create_rack = function(rack, config) {

    const rackId = rack['_id']

    const root = document.createElement('div')
    root.setAttribute('class', 'col-auto mb-3')
    root.setAttribute('id', rackId+'-root')

    const card = document.createElement('div')
    card.setAttribute('class', 'card bg-light')
    card.setAttribute('style', 'width: 20rem')
    card.setAttribute('id', rackId+'-card')

    const body = document.createElement('div')
    body.setAttribute('class', 'card-body')
    //body.setAttribute('style', 'background-color: red')
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
    card.setAttribute('style', 'width: 18rem')
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
    configure_btn.onclick = function() { alert('configure shelf') }
    configure_btn.innerHTML = 'Configure'
    options_div.appendChild(configure_btn)


    const shelf_div = generateShelf(shelf)

    body.appendChild(shelf_div)
    body.appendChild(options_div)

    /* build the main card with 3 componenets */
    card.appendChild(header)
    card.appendChild(body)
    //card.appendChild(footer)
  
    root.appendChild(card)

    return root
}


const generateShelf = function(shelf) {

    const p = document.createElement('p')
    p.innerHTML = 'unsupported'
    
    
    return tbdShelf(shelf)

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
        btn.setAttribute('id', shelfId+'-delete-btn')
        btn.onclick = function() { deleteShelf(rack, config, shelfId) }
        btn.innerHTML = 'remove'

        shelf_options_div.removeChild(document.getElementById(shelfId+'-configure-btn'))
        shelf_options_div.appendChild(btn)
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
            .catch(err => alert('unable to save pwm ' + err));
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
        const delete_btn = document.getElementById(shelfId+'-delete-btn')
        shelf_options_div.removeChild(delete_btn)

        const configure_btn = document.createElement('button')
        configure_btn.setAttribute('class', 'btn btn-link')
        configure_btn.setAttribute('style', 'float: right;')
        configure_btn.setAttribute('id', shelfId+'-configure-btn')
        configure_btn.onclick = function() { alert('configure shelf') }
        configure_btn.innerHTML = 'Configure'
        shelf_options_div.appendChild(configure_btn)
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


