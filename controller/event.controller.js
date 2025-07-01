const { EventModel } = require("../model/event.model");
const { errorMessageFormatter } = require("../utils/helpers");




const addeventController = async (req, res) => {
    try {
        const { eventTitle, date, time, location, description } = req.body;
        const postedBy = req.user._id;
        const posterName = req.user.name;

        const newEvent = new EventModel({
            eventTitle,
            postedBy,
            posterName,
            date,
            time,
            location,
            description,
            attendeeCount: 0,
            attendees: []
        });

        await newEvent.save();
        return res.status(201).json({
            message: 'Event added successfully!',
            event: newEvent
        });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

const getAlleventController = async (req, res) => {
    try {
        const { search, filterDate, filterRange } = req.query;
        let query = {};
        // console.log(search)

  if (search) {
  const searchableFields = ['eventTitle', 'location', 'description'];

  query.$or = searchableFields.map((field) => ({
    [field]: { $regex: new RegExp(search, 'i') },
  }));
}



        if (filterDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (filterDate === 'today') {
                query.date = today;
            }
        } else if (filterRange) {
            const now = new Date();
            let startDate, endDate;

            if (filterRange === 'currentWeek') {
                startDate = new Date(now.setDate(now.getDate() - now.getDay()));
                endDate = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            } else if (filterRange === 'lastWeek') {
                startDate = new Date(now.setDate(now.getDate() - now.getDay() - 7));
                endDate = new Date(now.setDate(now.getDate() - now.getDay() - 1));
            } else if (filterRange === 'currentMonth') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            } else if (filterRange === 'lastMonth') {
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            }

            if (startDate && endDate) {
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                query.date = { $gte: startDate, $lte: endDate };
            }
        }

        const events = await EventModel.find(query)
            .sort({ date: 1, time: 1 })
            .populate('postedBy', 'name email photoURL');

        return res.status(200).json({ events });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

const joineventController = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await EventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        if (event.attendees.includes(userId)) {
            return res.status(400).json({ message: 'You have already joined this event.' });
        }

        event.attendees.push(userId);
        event.attendeeCount += 1;
        await event.save();

        return res.status(200).json({
            message: 'You have successfully joined the event!',
            event
        });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

const getmyeventsController = async (req, res) => {
    try {
        const userId = req.user._id;

        const myEvents = await EventModel.find({ postedBy: userId })
            .sort({ date: -1, time: -1 });

        return res.status(200).json({ events: myEvents });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

const updateeventController = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await EventModel.findOne({ _id: eventId, postedBy: userId });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to update it.' });
        }

        const { eventTitle, date, time, location, description } = req.body;

        event.eventTitle = eventTitle || event.eventTitle;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.description = description || event.description;

        await event.save();
        return res.status(200).json({
            message: 'Event updated successfully!',
            event
        });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

const deleteeventController = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const result = await EventModel.deleteOne({ _id: eventId, postedBy: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Event not found or you are not authorized to delete it.' });
        }

        return res.status(200).json({ message: 'Event deleted successfully!' });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};

module.exports = {
    addeventController, getAlleventController, joineventController, getmyeventsController, updateeventController, deleteeventController
};