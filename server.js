const express = require('express')
const bodyParser = require('body-parser')
const { buildSchema }  = require('graphql')
const { graphqlHTTP } = require('express-graphql')


const events = []

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
            return events
        },

        createEvent : (args) => {
            const event = {
                _id : Math.random().toString(),
                title: args.input.title,
                description: args.input.description,
                price: args.input.price,
                date: new Date().toISOString()
            }
            events.push(event)
            return event
        }
    },
    graphiql: true
}))

const port = 8081
app.listen(port, () => console.log(`Server is Up and running at port:${port}`))

