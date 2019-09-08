const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const morgan = require('morgan');

app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
morgan.token('person', function (req, res) { return JSON.stringify(req.body) })

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
];

const generateId = () => {
  const newId = Math.floor(Math.random() * 1337);

  return newId;
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {

  res.json(persons)
})

app.get('/info', (req, res) => {

  const date = new Date();
  const infos = `Phonebook has info for ${persons.length} people`
  
  res.send(
    `${infos} </br> </br> ${date}`
  );
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if(person) {
    res.json(person);
  }
  else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(note => note.id !== id)

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})