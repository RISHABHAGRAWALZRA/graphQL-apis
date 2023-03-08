const { transformBooking, transformEvent } = require('../../helper/helper')
const Booking = require('../../models/booking')
const Event = require('../../models/event')


module.exports = {

    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },


    bookEvent: async (args) => {
        try {
            const foundEvent = await Event.findById(args.eventID);
            const booking = new Booking({
                user: '640749d0ef23832673065c68',
                event: foundEvent
            })

            const resultBooking = await booking.save()
            return transformBooking(resultBooking)
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    cancelBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingID).populate('event')
            const foundEvent = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingID })
            return foundEvent
        } catch (err) {
            throw err
        }
    }
}