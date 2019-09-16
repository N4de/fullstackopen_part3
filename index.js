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
    .catch(error => {
      console.log(error);
      res.status(404).end()
    });

  
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  Contact.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error);
      res.status(404).end()
    });

})

app.post('/api/persons', (req, res) => {
  const body = req.body

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
 
  const contact = new Contact ({
    name: body.name,
    number: body.number,
  });

  contact.save()
    .then(savedContact => {
      res.json(savedContact.toJSON());
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})