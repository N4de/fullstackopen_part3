const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://jarannal:${password}@cluster0-amjar.mongodb.net/phonebook-app?retryWrites=true`;  

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length === 3) {
    console.log('phonebook: ');
    Contact.find({}).then(response => {
      response.forEach(contact => console.log(`${contact.name} ${contact.number}`));
      mongoose.connection.close();
    });
}
else {
    const name = process.argv[3];
    const number = process.argv[4];
    
    
    const contact = new Contact({
        name: name,
        number: number,
    })
    
    contact.save().then(response => {
        console.log(response);
        console.log(`added ${response.name} number ${response.number} to phonebook`);
        mongoose.connection.close();
    })
}