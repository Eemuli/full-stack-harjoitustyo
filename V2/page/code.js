function init() {
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = 'Ladataan hyppyjä palvelimelta, odota...'
    jumpOrder = 'desc'
    loadJumps()

    // Send form with enter
    window.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("addJumpBtn").click();
        }});
}

async function loadJumps() {
    let response = await fetch('http://localhost:3000/jumps')
    jumpsJSON = await response.json()
    showJumps(jumpsJSON)
    let jumpOrderButton = document.getElementById('sortJumpsButton')
    jumpOrderButton.style = 'display: block;'
}

function createJumpListItem(jump) {
    let li = document.createElement('li')
    let li_attr_id = document.createAttribute('id')
    let li_attr_class = document.createAttribute('class')
    li_attr_class.value = 'jumpItem'
    li.setAttributeNode(li_attr_class)
    li_attr_id.value = jump._id
    li.setAttributeNode(li_attr_id)

    let jumpNumber = document.createTextNode(jump.number)
    let numberSpan = document.createElement('span')
    let numberSpanClass = document.createAttribute('class')
    numberSpanClass.value = 'jumpNumber'
    numberSpan.setAttributeNode(numberSpanClass)
    numberSpan.appendChild(jumpNumber)

    let spanDate = document.createElement('span')
    let spanClassDate = document.createAttribute('class')
    spanClassDate.value = 'jumpDate'
    spanDate.setAttributeNode(spanClassDate)
    let jumpDate = document.createTextNode(jump.date)
    spanDate.appendChild(jumpDate)
    li.appendChild(numberSpan)
    li.appendChild(spanDate)

    let spanMore = document.createElement('span')
    let spanClassMore = document.createAttribute('class')
    spanClassMore.value = 'expandJump'
    spanMore.setAttributeNode(spanClassMore)
    let moreButton = document.createTextNode(' ▼ ')
    spanMore.appendChild(moreButton)
    li.appendChild(spanMore)

    li.appendChild(jumpItemFullInfo(jump))

    spanMore.onclick = function() {
        let arrow = document.getElementById(jump._id).getElementsByClassName('expandJump')[0]
        let clickedItem = document.getElementById(jump._id).getElementsByClassName('fullJumpInfo')[0]
            if (clickedItem.style.display != 'none') {
                clickedItem.style.display = 'none'
                arrow.innerHTML = ' ▼ '
            }
            else {
                clickedItem.style.display = 'list-item'
                arrow.innerHTML = ' ▲ '
            }
    }
    return li
}

function jumpItemFullInfo(jump) {
    const specs = ['place', 'plane', 'canopy', 'height', 'falltime', 'totalfalltime', 'comments', 'link' ]
    const specNames = [ 'Paikka', 'Lentokone', 'Päävarjo', 'Korkeus', 'Vapaapudotusaika', 'Yhteensä', 'Kommentit', 'Medialinkki' ]

    let ul = document.createElement('ul')
    let ulClass = document.createAttribute('class')
    ulClass.value = 'fullJumpInfo'
    ul.setAttributeNode(ulClass)
    let ulStyle = document.createAttribute('style')
    ulStyle.value = 'display: none;'
    ul.setAttributeNode(ulStyle)
    
    specs.forEach((specName, index, specs) => {
        let spec = jump[specName]
        let li = document.createElement('li')
        let liClass = document.createAttribute('class')
        liClass.value = specName
        li.setAttributeNode(liClass)

        let specTitle = document.createTextNode(specNames[index] + ': ')
        li.appendChild(specTitle)

        let span = document.createElement('span')
        let spanClass = document.createAttribute('class')
        let jumpSpec = document.createTextNode(spec)
        spanClass.value = 'fullJumpInfoValue'
        if (specName == 'totalfalltime') {
            let formattedTime = document.createTextNode(secondsToMinutes(spec))
            span.appendChild(formattedTime)
            span.setAttributeNode(spanClass)
            li.appendChild(span)
            ul.appendChild(li)
        }
        else if (index === specs.length - 1 && spec != '' && spec != undefined) {
            span.appendChild(createHyperlink(spec))
            span.setAttributeNode(spanClass)
            li.appendChild(span)
            ul.appendChild(li)
        }
        else if (spec != '') {
            span.appendChild(jumpSpec)
            span.setAttributeNode(spanClass)
            li.appendChild(span)
            ul.appendChild(li)
        }
        if (specName != 'link') {
            span.onclick = () => { makeEditable(span) }
        }
    })

    let editDeleteDiv = document.createElement('div')
    let delDivClass = document.createAttribute('class')
    delDivClass.value = 'jumpEditAndDeleteButtons'
    editDeleteDiv.setAttributeNode(delDivClass)
    editDeleteDiv.appendChild(createEditButton(jump))
    editDeleteDiv.appendChild(createDeleteButton(jump))
    ul.appendChild(editDeleteDiv)
    return ul
}

function makeEditable(span) {
    let input = document.createElement('input')
    const onlyNumbers = ['height', 'falltime', 'totalfalltime']
    if (onlyNumbers.includes(span.parentElement.className)) {
        let preventLetters = document.createAttribute('onkeypress')
        preventLetters.value = 'return /[0-9]/i.test(event.key)'
        input.setAttributeNode(preventLetters)
    }
    if (span.parentElement.className == 'totalfalltime') {
        input.value = minutesAndSecondsToSeconds(span.innerHTML)
    } else {
        input.value = span.innerHTML
    }
    let li = span.parentElement
    let id = li.parentElement.parentElement.id
    let originalValue = span.innerHTML
    span.remove()
    li.appendChild(input)
    input.focus()
    let validateForUpdate = function () {
        if (input.value != '') {
            saveJump(id)
            inputToSpan(li)
        } else {
            input.value = originalValue
            input.style.color = 'red'
            input.style.transitionDuration = '0s'
            setTimeout(() => {
                input.style.transitionDuration = '1s'
                input.style.color = 'black'
            }, 1000);
        }
    }
    input.addEventListener('focusout', validateForUpdate)
    input.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            validateForUpdate
            input.blur()
        }
    } )
}

function inputToSpan(li, fromEditAll = false) {
    let input = li.getElementsByTagName('input')[0]
    if (li.className == 'totalfalltime' && !fromEditAll) {
        input.value = secondsToMinutes(input.value)
    }
    let savedValue = input.value
    input.remove()
    let span = document.createElement('span')
    let spanClass = document.createAttribute('class')
    spanClass.value = 'fullJumpInfoValue'
    span.setAttributeNode(spanClass)
    span.appendChild(document.createTextNode(savedValue))
    if ( li.className != 'link') {
        span.onclick = () => { makeEditable(span) }
        li.appendChild(span)
    } else {
        link = span.innerHTML
        span.innerHTML = ''
        span.appendChild(createHyperlink(link))
        li.appendChild(span)
    }
    return li
}

function createHyperlink(link) {
    if (link.slice(0,4) != 'http') {
        link = `https://${link}`
    }
    let a = document.createElement('a')
    let href = document.createAttribute('href')
    href.value = link
    a.setAttributeNode(href)
    let target = document.createAttribute('target')
    target.value = '_blank'
    a.setAttributeNode(target)
    let linkText = document.createTextNode(link)
    a.appendChild(linkText)
    return a
}

function createEditButton(jump) {
    let editButton = document.createElement('img')
    let editTitle = document.createAttribute('title')
    editTitle.value = 'Muokkaa kaikkia kerralla'
    editButton.setAttributeNode(editTitle)
    let editClass = document.createAttribute('Class')
    editClass.value = 'editButton'
    editButton.setAttributeNode(editClass)
    editButton.src = '../img/edit.png'
    editButton.onclick = function() { editJump(jump._id) }
    return editButton
}

function createDeleteButton(jump) {
    let deleteButton = document.createElement('img')
    deleteButton.src = "../img/delete.png"
    deleteButton.onclick = function() { cancelDelete(jump._id) }
    return deleteButton
}

function cancelDelete(id) {
    let jumpItem = document.getElementById(id)
    let jumpIndex = jumpsJSON.findIndex(jump => jump._id === id)
    let jumpNumber = jumpsJSON[jumpIndex].number
    jumpItem.innerHTML = `${jumpNumber} Poistetaan...`
    let cancelButtonSpan = document.createElement('span')
    let cancelButtonSpanClass = document.createAttribute('class')
    cancelButtonSpanClass.value = 'cancelDeleteButton'
    cancelButtonSpan.setAttributeNode(cancelButtonSpanClass)
    let cancelButton = document.createTextNode('Peruuta')
    cancelButtonSpan.appendChild(cancelButton)
    jumpItem.appendChild(cancelButtonSpan)
    
    let cancel = false
    cancelButtonSpan.onclick = () => {
        cancel = true
        document.getElementById('jumpsList').innerHTML = ''
        showJumps(jumpsJSON)
    }

    setTimeout(() => {
        if (!cancel) {
            removeJump(id)
        }
    }, 2500);
}

function showJumps(jumps) {
    let jumpsList = document.getElementById('jumpsList')
    let infoText = document.getElementById('infoText')

    if (jumps.length === 0) {
        infoText.innerHTML = 'Ei hyppyjä'
    } else {
        if (jumpOrder == 'desc') {
            jumps.sort((a, b) => a.number - b.number)
        } else {
            jumps.sort((a, b) => b.number - a.number)
        }
        jumps.reverse().forEach(jump => {
            let li = createJumpListItem(jump)        
            jumpsList.appendChild(li)
        })
        infoText.innerHTML = ''
    }
}

function changeJumpOrder() {
    document.getElementById('jumpsList').innerHTML = ''
    let button = document.getElementById('sortJumpsButton')
    if (button.innerHTML == 'Järjestys ▼ ') {
        button.innerHTML = 'Järjestys ▲ '
        jumpOrder = 'asc'
        showJumps(jumpsJSON)
    } else {
        button.innerHTML = 'Järjestys ▼ '
        jumpOrder = 'desc'
        showJumps(jumpsJSON)
    }
}

async function addJump() {
    if (checkEmptyInputs()) return
    const keys = ['Number','Date','Place','Plane','Canopy',
                  'Height','Falltime','TotalFalltime','Comments','Link']
    let data = {}

    keys.forEach(key => {
        let inputID = 'newJump' + key
        let element = document.getElementById(inputID)
        let dataKey = key.toLowerCase()
        if (inputID == 'newJumpTotalFalltime') {
            data[`${dataKey}`] = minutesAndSecondsToSeconds(element.value)
        } else {
            data[`${dataKey}`] = element.value
        }
        element.value = ''
    })

    try {
        const response = await fetch('http://localhost:3000/jumps', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    } catch (error) {
        console.log(error)
    }
      
    let infoText = document.getElementById('infoText')
    infoText.innerHTML = ''
    let jumpsList = document.getElementById('jumpsList')
    jumpsList.innerHTML = ''
    loadJumps()
}

function checkEmptyInputs() {
    const mandatory = ['Number','Date','Place','Plane','Canopy','Height','Falltime','TotalFalltime']
    let empty = 0
    mandatory.forEach(name => {
        let inputID = 'newJump' + name
        let input = document.getElementById(inputID)
        if (input.value == '') {
            input.style = 'border-color: red;'
            input.onfocus = () => input.style = 'border-color: #ccc;'
            empty++
        }
    })
    if (empty > 0) return true
    else return false
}

function editJump(id){
    let jump = document.getElementById(id)
    let fullJumpInfo = jump.getElementsByClassName('fullJumpInfo')[0]
    const headerColumns = ['Date','Number']

    headerColumns.forEach(column => {
        let span = jump.getElementsByClassName(`jump${column}`)[0]
        let input = document.createElement('input')
        let inputClass = document.createAttribute('class')
        inputClass.value = `input${column}`
        input.setAttributeNode(inputClass)
        input.value = span.innerHTML
        span.remove()
        jump.prepend(input)
    })

    for (let index = 1; index < fullJumpInfo.childElementCount; index++) {
        let li = fullJumpInfo.querySelector(`li :nth-child(${index})`)
        let span = li.getElementsByClassName('fullJumpInfoValue')[0]
        let input = document.createElement('input')
        if (li.className == 'totalfalltime') {
            input.value = minutesAndSecondsToSeconds(span.innerHTML)
        }
        else if (li.className != 'link') {
            input.value = span.innerHTML
        }
        else if (li.className == 'link') {
            input.value = span.getElementsByTagName('a')[0].innerHTML
        }
        span.remove()
        li.appendChild(input)
    }

    let editButton = jump.getElementsByClassName('editButton')[0]
    editButton.src = '../img/save.png'
    let editTitle = document.createAttribute('title')
    editTitle.value = 'Tallenna'
    editButton.setAttributeNode(editTitle)
    
    const addButtons = ['comments','link']
    editButton.onclick = () => validateAndUpdate(id, headerColumns, addButtons)

    let editDeleteDiv = jump.getElementsByClassName('jumpEditAndDeleteButtons')[0]
    addButtons.forEach(buttonName => {
        if (fullJumpInfo.querySelector(`.${buttonName}`) === null) {
            let newButton = buttonsForAddingFields(buttonName)
            newButton.onclick = () => { 
                addDataField(id, buttonName),
                newButton.remove()
            }
            editDeleteDiv.prepend(newButton)
        }
    })
}

function validateAndUpdate(id, headerColumns, addButtons) {
    let jump = document.getElementById(id)
    let inputs = jump.getElementsByTagName('input')
    let inputsLegth = inputs.length
    let valid = []
    for (let index = 0; index < inputsLegth; index += 1) {
        let input = inputs[index]
        let inputClass = input.parentElement.className
        if (addButtons.includes(inputClass) && input.value == '') {
            valid.push(true)
            input.parentElement.remove()
            index--
            inputsLegth--
        }
        else if (input.value == '' || input.value.charAt(0) == '*') {
            input.value = '*'
            input.style.color = 'red'
            input.style.transitionDuration = '0s'
            valid.push(false)
            setTimeout(() => {
                input.style.transitionDuration = '1s'
                input.style.color = 'black'
            }, 1000)
        } else { valid.push(true) }
    }
    if (valid.every((valid) => valid == true)) {
        const easyClasses = ['place', 'plane', 'canopy', 'height', 'falltime', 'totalfalltime', 'comments', 'link']
        easyClasses.forEach(className => {
            try {
                let li = jump.getElementsByClassName(className)[0]
                inputToSpan(li, true)
            } catch {}
        })
        headerColumns.forEach(column => {
            let input = jump.getElementsByClassName(`input${column}`)[0]
            let span = document.createElement('span')
            let spanClass = document.createAttribute('class')
            spanClass.value = `jump${column}`
            span.setAttributeNode(spanClass)
            span.innerHTML = input.value
            input.remove()
            jump.prepend(span)
        })
        saveJump(id)
        let editDeleteDiv = jump.getElementsByClassName('jumpEditAndDeleteButtons')[0]
        let editButton = jump.getElementsByClassName('editButton')[0]
        editButton.src = '../img/edit.png'
        let editTitle = document.createAttribute('title')
        editTitle.value = 'Muokkaa kaikkia kerralla'
        editButton.setAttributeNode(editTitle)
        editButton.onclick = () => editJump(id)
        addButtons.forEach(buttonName => {
            let button = editDeleteDiv.getElementsByClassName(`add-${buttonName}Button`)[0]
            if (button !== undefined) button.remove()
        })
    }
}

function buttonsForAddingFields(buttonName) {
    let icon = document.createElement('img')
    icon.src = `../img/add-${buttonName}.png`
    let iconClass = document.createAttribute('class')
    iconClass.value = `add-${buttonName}Button`
    icon.setAttributeNode(iconClass)
    let title = document.createAttribute('title')
    title.value = `Add ${buttonName}`
    icon.setAttributeNode(title)
    return icon
}

function addDataField(id, fieldName) {
    let jump = document.getElementById(id)
    let fullJumpInfo = jump.getElementsByClassName('fullJumpInfo')[0]
    let jumpEditAndDeleteButtons = jump.getElementsByClassName('jumpEditAndDeleteButtons')[0]
    let newField = document.createElement('li')
    let liClass = document.createAttribute('class')
    liClass.value = `${fieldName}`
    newField.setAttributeNode(liClass)
    let title
    if (fieldName == 'comments') {
        title = document.createTextNode('Kommentti: ')
    } else if (fieldName == 'link') {
        title = document.createTextNode('Medialinkki: ')
    }
    newField.appendChild(title)
    let input = document.createElement('input')
    newField.appendChild(input)
    fullJumpInfo.insertBefore(newField, jumpEditAndDeleteButtons)
}

async function nextJumpNumber() {
    let numberInput = document.getElementById('newJumpNumber')
    if (numberInput.value != '') return
    let response = await fetch('http://localhost:3000/jumps')
    originalOrderJSON = await response.json()
    originalOrderJSON.reverse()
    let lastAddedJumpNumber = parseInt(originalOrderJSON[0].number)
    let newJumpNumber = lastAddedJumpNumber + 1
    let allJumpNumbers = []
    originalOrderJSON.forEach(jump => {
        allJumpNumbers.push(jump.number)
    })
    while (true) {
        if (allJumpNumbers.includes(newJumpNumber.toString())) {
            newJumpNumber++
        } break
    }    
    numberInput.value = newJumpNumber
}

function totalFalltime() {
    let totalFalltimeInput = document.getElementById('newJumpTotalFalltime')
    let falltimeInput = document.getElementById('newJumpFalltime')
    let jumpNumber = document.getElementById('newJumpNumber')
    jumpNumber = parseInt(jumpNumber.value)
    let jumpIndexUntilJumpNumber = jumpsJSON.length
    jumpsJSON.forEach(jump => {
        if (jumpNumber > jump.number) {
            jumpIndexUntilJumpNumber--
        }
    })
    let totalFalltime = 0
    if (parseInt(jumpNumber) < 2) {
        totalFalltime = 0
        jumpIndexUntilJumpNumber--
    } else {
        totalFalltime = parseInt(jumpsJSON[jumpIndexUntilJumpNumber].totalfalltime)
    }
    if (falltimeInput.value != '') {
        totalFalltime += parseInt(falltimeInput.value)
    } else {
        totalFalltimeInput.value = ''
    }
    totalFalltimeInput.value = `${secondsToMinutes(totalFalltime)}`
}

function secondsToMinutes(timeInSec) {
    let minutes = Math.floor(timeInSec/60)
    let seconds = timeInSec - ( minutes * 60 )
    let time = `${minutes} min ${seconds} s (${timeInSec} s)`
    return time
}

function minutesAndSecondsToSeconds(time) {
    let seconds = time.substring(time.indexOf('(') + 1, time.length - 3)
    return seconds
}

function ifValueInSeconds(value) {
    let input = document.getElementById('newJumpTotalFalltime')
    if (/^\d+$/.test(value)) {
        input.value = secondsToMinutes(value)
    }
}

function cumulativeFreeFalltime(id) {
    let jumpIndex = jumpsJSON.findIndex(jump => jump._id === id)
    let totalTime = 0
    for (let index = jumpsJSON.length - 1; index >= jumpIndex; index--) {
        totalTime += parseInt(jumpsJSON[index].falltime)
    }
    return totalTime
}

function getJumpInfo(id) {
    let jump = document.getElementById(id)
    let number = jump.getElementsByClassName('jumpNumber')[0].innerHTML
    let date = jump.getElementsByClassName('jumpDate')[0].innerHTML
    let data = {
        'number': number,
        'date': date
    }
    let infoKeys = ['place','plane','canopy','height','falltime','totalfalltime','comments']

    infoKeys.forEach(infoName => {
        try {
            let li = jump.getElementsByClassName(infoName)[0]
            try {
                let span = li.getElementsByClassName('fullJumpInfoValue')[0]
                data[infoName] = span.innerHTML
            } catch {
                let input = li.getElementsByTagName('input')[0].value
                data[infoName] = input  
            }
        } catch { data[infoName] = '' }
    })

    try {
        let liLink = jump.getElementsByClassName('link')[0]
        let spanLink = liLink.getElementsByClassName('fullJumpInfoValue')[0]
        let link = spanLink.getElementsByTagName('a')[0].innerHTML
        data['link'] = link
    } catch { data['link'] = '' }
    return data
}

async function saveJump(id){
    const data = getJumpInfo(id)
    const response = await fetch('http://localhost:3000/jumps/'+id, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json'
        },
    body: JSON.stringify(data)
    })
    let jumpIndex = jumpsJSON.findIndex(jump => jump._id === id)
    data['_id'] = id
    jumpsJSON[jumpIndex] = data
}

async function removeJump(id) {
    const response = await fetch('http://localhost:3000/jumps/'+id, {
        method: 'DELETE'
    })
    let responseJson = await response.json()
    let li = document.getElementById(id)
    li.parentNode.removeChild(li)
    removeLocally(id)
  
    let jumpsList = document.getElementById('jumpsList')
    if (!jumpsList.hasChildNodes()) {
        let infoText = document.getElementById('infoText')
        infoText.innerHTML = 'Ei hyppyjä'
    }
}

function removeLocally(id) {
    var index = jumpsJSON.findIndex(jump => jump._id === id)
    if (index > -1) {
        jumpsJSON.splice(index, 1)
    }
}