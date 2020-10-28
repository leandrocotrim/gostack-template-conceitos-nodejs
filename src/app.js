const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title) return response.status(400).json({ error: 'Title is requerid.' });
  if (!url) return response.status(400).json({ error: 'Url is requerid.' });
  if (!techs || !Array.isArray(techs) || techs.length === 0) return response.status(400).json({ error: 'Techs is requerid.' });

  const repository = { title, url, techs, likes: 0, id: uuid() };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!id) return response.status(400).json({ error: 'Id is requerid.' });
  // if (!title) return response.status(400).json({ error: 'Title is requerid.' });
  // if (!url) return response.status(400).json({ error: 'Url is requerid.' });
  // if (!techs || !Array.isArray(techs) || techs.length === 0) return response.status(400).json({ error: 'Techs is requerid.' });

  const repository = repositories.find(repository => repository.id === id);
  if (!repository) return response.status(400).json({ error: 'Repository not found.' });

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => repository.id === id);

  if (indexRepository === -1) return response.status(400).json({ error: 'Repository not found.' });

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id, like } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  if (!repository) return response.status(400).json({ error: 'Repository not found.' });

  repository.likes++;

  return response.json({ likes: repository.likes });
});

module.exports = app;
