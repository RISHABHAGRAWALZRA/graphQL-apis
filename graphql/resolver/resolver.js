const Event = require('../../models/event')
const User = require('../../models/user')

const bcrypt = require('bcryptjs')

module.exports = {
    event : () => {
        return Event.find().then(events => {
            return events.map(event => {
                return {...event._doc, _id: event.id, date: new Date(event._doc.date).toISOString()}
            })
        }).catch(err => {
            console.log(err)
        })
    },

    createEvent : (args) => {
        const event = new Event({
            title: args.input.title,
            description: args.input.description,
            price: args.input.price,
            date: new Date().toISOString(),
        })

        return event.save().then(result => {
            console.log(result)
            return {...result._doc, _id: result._doc._id.toString(), date: new Date(result._doc.date).toISOString()}
        }).catch(err => {
            console.log(err)
        }) 
    },

    createUser : (args) => {
        return User.findOne({email:args.input.email}).then( user => {
            if(user){
                throw new Error("User is already exists")
            }
            return bcrypt.hash(args.input.password, 12)
        }).then(hashedPassword => {
            const user = new User({
                email: args.input.email,
                password: hashedPassword
            })
            return user.save()
        }).then(result => {
            return {...result._doc, password: null, _id: result.id}
        }).catch(err => {
            console.log(err)
            throw err
        })
        
    }
}