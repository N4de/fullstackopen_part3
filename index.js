require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');


app.use(express.static('build'));
app.use(cors());
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'));
morgan.token('person', (req) => JSON.stringify(req.body));


app.get('/api/persons', (req, res) => {
  Contact.find({})
    .then((contacts) => {
      res.json(contacts.map((contact) => contact.toJSON()));
    });
});

app.get('/info', (req, res) => {
  Contact.find({})
    .then((contacts) => {
      const date = new Date();
      const infos = `Phonebook has info for ${contacts.length} people`;

      res.send(
        `${infos} </br> </br> ${date}`,
      );
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Contact.findById(id).then((contact) => {
    res.json(contact.toJSON());
  })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id);
  Contact.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing',
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing',
    });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  return (
    contact.save()
      .then((savedContact) => (res.json(savedContact.toJSON())))
      .catch((error) => next(error))
  );
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then((updatedContact) => {
      console.log(updatedContact);
      res.json(updatedContact.toJSON());
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  return (next(error));
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
