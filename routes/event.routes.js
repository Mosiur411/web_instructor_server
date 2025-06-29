
const { Router } = require('express');
const { addeventController, getAlleventController, joineventController, getmyeventsController, updateeventController, deleteeventController } = require('../controller/event.controller');

const eventRoutes = Router();

eventRoutes.post("/", addeventController);

eventRoutes.get("/", getAlleventController); 

eventRoutes.post("/:id/join", joineventController);

eventRoutes.get("/my-events", getmyeventsController); 

eventRoutes.put("/:id", updateeventController); 

eventRoutes.delete("/:id", deleteeventController); 



module.exports = { eventRoutes }