const express = require('express')
const bodyParser = require('body-parser')

const { buildSchema }  = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const mongoose = require('mongoose')
const Event = require('./models/event')

const app = express()
app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`

        type Event{
            _id: ID
            title: String!
            description: String
            price: Float!
            date: String!
        }

        input EventInput{
            title: String!
            description: String
            price: Float!
            date: String!
        }

        type RootMutation{
            createEvent(input: EventInput) : Event
        }

        type RootQuery{
            event : [Event!]!
        }

        schema {
            query : RootQuery
            mutation : RootMutation
        }
    
    `),
    rootValue:{
        event : () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return {...event._doc, _id: event.id}
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
                date: new Date().toISOString()
            })
            return event.save().then(result => {
                console.log(result)
                return {...result._doc, _id: result._doc._id.toString()}
            }).catch(err => {
                console.log(err)
            })
            return 
        }
    },
    graphiql: true
}))

const port = 8081


mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`).then(() => {
    app.listen(port, () => console.log(`Server is connected with mongoDB and Up and running at port:${port}`))}
).catch( err => {
    console.log(err)
})


