const { transformBooking, transformEvent } = require('../../helper/helper')
const Booking = require('../../models/booking')
const Event = require('../../models/event')


module.exports = {

    bookings: async (req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Unauthenticated!")
            }
            const bookings = await Booking.find({ user: req.userID })
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },


    bookEvent: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Unauthenticated!")
            }
            const foundEvent = await Event.findById(args.eventID);
            const booking = new Booking({
                user: req.userID,
                event: foundEvent
            })

            const resultBooking = await booking.save()
            return transformBooking(resultBooking)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    cancelBooking: async (args, req) => {
        try {
            if (!req.isAuth) {
                throw new Error("Unauthenticated!")
            }
            const booking = await Booking.findById(args.bookingID).populate('event')
            const foundEvent = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingID })
            return foundEvent
        } catch (err) {
            throw err
        }
    }
}