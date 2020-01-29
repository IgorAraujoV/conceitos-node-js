const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let requestsCount = 0;

server.use((req, res, next) => {
    console.log(`Method: ${req.method}, Resquest: ${requestsCount}`);
    requestsCount++;

    return next();
});

function checkProjectExists(req, res, next) {
    let project = projects.find(item => item.id == req.params.id);

    if (!project) {
        return res.status(404).json({ 
            Message: `Not found project with id ${req.params.id}`
        });
    }

    return next();
}

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    projects.push({
        id,
        title,
        tasks: [],
    });

    return res.json(projects);
});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    let project = projects.find(item => item.id == id);

    project.title = title; 
    return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    let project = projects.find(item => item.id == id);

    project.tasks = [...project.tasks, title];

    return res.json(projects);
});

server.listen(3000);