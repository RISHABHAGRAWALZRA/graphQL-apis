const Event = require('../../models/event')
const User = require('../../models/user')

const bcrypt = require('bcryptjs')

const events = async (eventIds) => {
    try {
        const foundEvents = await Event.find({ _id: { $in: eventIds } })
        return foundEvents.map(event => {
            return { ...event._doc, _id: event.id, creator: user.bind(this, event.creator) }
        })
    } catch (err) {
        throw err
    }
}

const user = async (userId) => {
    try {
        const foundUser = await User.findById(userId)
        return { ...foundUser._doc, _id: foundUser.id, createdEvents: events.bind(this, foundUser._doc.createdEvents) }
    } catch (err) {
        throw err
    }
}

module.exports = {
    event: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return { ...event._doc, _id: event.id, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator) }
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.input.title,
                description: args.input.description,
                price: args.input.price,
                date: new Date().toISOString(),
                creator: '640749d0ef23832673065c68'
            })

            const foundUser = await User.findById('640749d0ef23832673065c68')

            if (foundUser) {
                const result = await event.save()
                foundUser.createdEvents.push(event)
                await foundUser.save()
                console.log(result)
                return { ...result._doc, _id: result._doc._id.toString(), date: new Date(result._doc.date).toISOString(), creator: user.bind(this, result._doc.creator) }
            } else {
                throw new Error("User not found")
            }

        } catch (err) {
            console.log(err)
            throw err
        }
    },

    createUser: async (args) => {
        try {
            const existingUser = await User.findOne({ email: args.input.email })
            if (existingUser) {
                throw new Error("User is already exists")
            }

            const hashedPassword = await bcrypt.hash(args.input.password, 12)
            const newUser = new User({
                email: args.input.email,
                password: hashedPassword
            })
            const result = await newUser.save()

            return { ...result._doc, password: null, _id: result.id }
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}