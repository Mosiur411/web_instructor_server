
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true,
        trim: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    posterName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    attendeeCount: {
        type: Number,
        default: 0,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

}, { timestamps: true });

eventSchema.index({ eventTitle: 'text', description: 'text' })
eventSchema.index({ eventTitle: 1 }); 
eventSchema.index({ date: 1 });   
eventSchema.index({ postedBy: 1 });  
eventSchema.index({ date: -1, time: -1 })
module.exports = {
    EventModel: mongoose.model('Event', eventSchema)
};