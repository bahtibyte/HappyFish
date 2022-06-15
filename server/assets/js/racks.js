

const newRack = function() {
    alert('new rack')
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
        const root = create_rack(i, config[racks[i]], config)
        rack_div.appendChild(root)
    }
    last_config = config
}

const create_rack = function(rI, rack, config) {

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
    edit_btn.onclick = function() { alert('edit rack') }
    edit_btn.innerHTML = 'Edit'
    options_div.appendChild(edit_btn)

    const add_btn = document.createElement('button')
    add_btn.setAttribute('class', 'btn btn-primary')
    add_btn.setAttribute('style', 'float: left')
    add_btn.setAttribute('id', rackId+'-add-btn')
    add_btn.onclick = function() { alert('add shelf') }
    add_btn.innerHTML = '+ Shelf'
    options_div.appendChild(add_btn)

    const shelves = rack['shelves']
    for (var i = 0; i < shelves.length; i++) {
        const shelf_root = create_shelf(shelves[i], config)
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


const create_shelf = function(shelfId, config) {
    
    const shelf = config[shelfId]

    const root = document.createElement('div')
    root.setAttribute('class', 'col-auto mb-3')
    root.setAttribute('style', 'margin-left: -35px')
    root.setAttribute('id', shelfId+'-root')

    const card = document.createElement('div')
    card.setAttribute('class', 'card bg-light')
    card.setAttribute('style', 'width: 18rem')
    card.setAttribute('id', shelfId+'-card')

    const body = document.createElement('div')
    body.setAttribute('class', 'card-body')
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
    configure_btn.setAttribute('style', 'float: right')
    configure_btn.setAttribute('id', shelfId+'-edit-btn')
    configure_btn.onclick = function() { alert('edit shelf') }
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
    div.setAttribute('style', 'margin-bottom: 1rem')

    const p = document.createElement('p')
    p.setAttribute('class', 'unconfigured')
    p.innerHTML = 'Unconfigured Shelf'
    

    div.appendChild(p)

    return div
}

