const express = require('express');
const { body, validationResult } = require('express-validator');
const app = express();
const port = 3000;

app.use(express.json());

// Helper function to generate a random ID
function generateRandomId() {
    return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

// Event array with initial dummy data
let events = [
    {
        id: generateRandomId(),
        title: 'Community Cleanup',
        time: '2024-09-30T10:00:00Z',
        owner: 'Alice',
        limit: 50,
        description: 'A community event to clean up the park.'
    },
    {
        id: generateRandomId(),
        title: 'Tech Talk',
        time: '2024-10-05T14:00:00Z',
        owner: 'Bob',
        limit: 100,
        description: 'A talk on the latest in technology.'
    },
    {
        id: generateRandomId(),
        title: 'Food Festival',
        time: '2024-10-10T12:00:00Z',
        owner: 'Carol',
        limit: 200,
        description: 'A festival celebrating local food and culture.'
    }
];

// GET endpoint to retrieve all event IDs
app.get('/', (req, res) => {
    // const ids = events.map(e => e.id).join('\n');
    let x = "";

    events.forEach(e => {
        x += `<h1>${e.id}</h1>`
    });
    res.send(x);
});

// GET endpoint to retrieve an event by ID
app.get('/event', (req, res) => {
    const eventId = parseInt(req.query.id, 10);
    const event = events.find(e => e.id === eventId);

    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
});

// POST endpoint to add a new event
app.post('/event', [
    body('title').isString().notEmpty(),
    body('time').isISO8601(),
    body('owner').isString().notEmpty(),
    body('limit').isInt({ min: 1 }),
    body('description').isString().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, time, owner, limit, description } = req.body;
    const newEvent = { id: generateRandomId(), title, time, owner, limit, description };
    events.push(newEvent);
    res.status(201).json(newEvent);
});

// PUT endpoint to update an existing event
app.put('/event/:id', [
    body('title').isString().notEmpty(),
    body('time').isISO8601(),
    body('owner').isString().notEmpty(),
    body('limit').isInt({ min: 1 }),
    body('description').isString().notEmpty()
], (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const index = events.findIndex(e => e.id === eventId);

    if (index === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, time, owner, limit, description } = req.body;
    events[index] = { id: eventId, title, time, owner, limit, description };
    res.json(events[index]);
});

// DELETE endpoint to remove an event
app.delete('/event/:id', (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const index = events.findIndex(e => e.id === eventId);

    if (index === -1) {
        return res.status(404).json({ message: 'Event not found' });
    }

    events.splice(index, 1);
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
