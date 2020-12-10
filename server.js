const { response } = require('express');
const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';
app.use(express.json());
app.use(express.static('public'))
app.locals.pets = [
  { id: 'a1', name: 'Jessica', type: 'dog' },
  { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
  { id: 'c3', name: 'Craisins', type: 'cat' }
]

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box!');
});

app.get('/pets', (request, response) => {
  response.json(app.locals.pets)
})

app.get('/pets/:id', (request, response) => {
  const id = request.params.id;
  const pet = app.locals.pets.find(pet => pet.id === id)
  
  if(!pet) {
    response.sendStatus(404);
  }
  response.json(pet);
})

app.post('/pets', (request, response) => {
  const pet = request.body;
  const id = Date.now();

  for (let requiredParameter of ['name', 'type']) {
    if (!pet[requiredParameter]) {
      response
        .status(422)
        .send({error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.`});
    }
  }

  app.locals.pets.push({ id, name: pet.name, type: pet.type })
  response.status(201).send(`Created ${pet.name} with id ${id}`);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
})