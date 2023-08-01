const express = require("express");
const morgan = require("morgan")
const cors = require("cors");
const app = express();

// create a new token for 'body'
morgan.token("body", function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
// use morgan middleware with custom format
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// app.get("/", (request, response) => {
//   response.send("<h1>Hello this is a Phonebook!</h1>");
// });

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${phonebook.length} people</p>
  
  <p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body
  const randomId = Math.floor(Math.random() * 9999999)

  if (phonebook.find(p => p.name === body.name)) {
    response.status(400).json({
      error: 'name must be unique'
    }) 
  } else if (!body.number || !body.name) {
    response.status(400).json({
      error: 'name or number is missing '
    })
  }

  const person = {
    id: randomId,
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
