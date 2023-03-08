const { transformEvent } = require("../../helper/helper")
const Event = require("../../models/event")
const User = require("../../models/user")


module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event)
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
                const resultEvent = await event.save()
                foundUser.createdEvents.push(event)
                await foundUser.save()
                return transformEvent(resultEvent)
            } else {
                throw new Error("User not found")
            }

        } catch (err) {
            console.log(err)
            throw err
        }
    },

}