const express = require('express') 
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.use(express.json())

const mongoose = require('mongoose')
const mongoDB = 'mongodb+srv://eemuli:P4s1ll3-L0v33@test.147x5qr.mongodb.net/hyppynet'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("Database connected")
})

const jumpSchema = new mongoose.Schema({
    number: { type: String, required: true },
    date: { type: String, required: true },
    place: { type: String, required: true },
    plane: { type: String, required: true },
    canopy: { type: String, required: true },
    height: { type: String, required: true },
    falltime: { type: String, required: true },
    totalfalltime: { type: String, required: true },
    comments: { type: String, required: false },
    link: { type: String, required: false }
})

const Jump = mongoose.model('Jump', jumpSchema, 'jumps')
  
app.post('/jumps', async (request, response) => {
    console.log(request.body)
    const { number, date, place, plane, canopy, height, falltime, totalfalltime, comments, link  } = request.body
    console.log(number, date, place, plane, canopy, height, falltime, totalfalltime, comments, link )
    const jump = new Jump({
        number: number,
        date: date,
        place: place,
        plane: plane,
        canopy: canopy,
        height: height,
        falltime: falltime,
        totalfalltime: totalfalltime,
        comments: comments,
        link: link
    })
    try {
        const savedJump = await jump.save()
        response.json(savedJump)  
    } catch (error) {
        if (error.name === "ValidationError") {
            return response.status(400)
        }
        response.status(500)
    }
})

app.get('/jumps/:id', async (request, response) => {
    const jump = await Jump.findById(request.params.id)
    if (jump) {
        response.json(jump)
    }
    else {
        response.status(404).end()
    }
})

app.get('/jumps', async (request, response) => {
    const jumps = await Jump.find({})
    response.json(jumps)
})

app.delete('/jumps/:id', async (request, response) => {
    const deletedJump = await Jump.findByIdAndRemove(request.params.id)
    if (deletedJump) response.json(deletedJump)
    else response.status(404).end()
})

app.put('/jumps/:id', async (request, response) => {
    const { number, date, place, plane, canopy, height, falltime, totalfalltime, comments, link } = request.body
    console.log(number, date, place, plane, canopy, height, falltime, totalfalltime, comments, link)
    const { id } = request.params
    const jump = await Jump.findByIdAndUpdate(
        id, 
        {'number': number,
        'date': date,
        'place': place,
        'plane': plane,
        'canopy': canopy,
        'height': height,
        'falltime': falltime,
        'totalfalltime': totalfalltime,
        'comments': comments,
        'link': link},
        {'new': true}
    )
    response.json(jump)
})

app.listen(port, () => {
    console.log('App listening on port 3000')
})