const Event = require("../models/event")
const User = require("../models/user")


const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        creator: getUser.bind(this, event._doc.creator)
    }
}

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: getUser.bind(this, booking._doc.user),
        event: getEvent.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString()
    }
}
const getEvents = async (eventIds) => {
    try {
        const foundEvents = await Event.find({ _id: { $in: eventIds } })
        return foundEvents.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const getEvent = async (eventID) => {
    try {
        const event = await Event.findById(eventID)
        return transformEvent(event)
    } catch (err) {
        throw err
    }
}

const getUser = async (userId) => {
    try {
        const foundUser = await User.findById(userId)
        return { ...foundUser._doc, _id: foundUser.id, createdEvents: getEvents.bind(this, foundUser._doc.createdEvents) }
    } catch (err) {
        throw err
    }
}

module.exports = {
    getUser,
    getEvent,
    getEvents,
    transformEvent,
    transformBooking
}