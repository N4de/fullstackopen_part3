require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact')


app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

const generateId = () => {
  const newId = Math.floor(Math.random() * 133337);

  return newId;
}


app.get('/api/persons', (req, res) => {

  Contact.find({})
    .then(contacts => {
      res.json(contacts.map(contact => contact.toJSON()))
    });
})

app.get('/info', (req, res) => {

  const date = new Date();
  const infos = `Phonebook has info for ${persons.length} people`
  
  res.send(
    `${infos} </br> </br> ${date}`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  
  Contact.findById(id).then(contact => {
    res.json(contact.toJSON())
  })

  
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const duplicateName = persons.find(person => person.name === body.name);

  console.log(body);

  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return res.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (duplicateName) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    })
  }  

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})