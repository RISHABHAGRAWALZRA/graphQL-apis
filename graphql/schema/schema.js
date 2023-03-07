const { buildSchema }  = require('graphql')

module.exports = buildSchema(`

        type Event{
            _id: ID
            title: String!
            description: String
            price: Float!
            date: String!
        }

        type User{
            _id: ID
            email: String!
            password: String
        }

        input EventInput{
            title: String!
            description: String
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type RootMutation{
            createEvent(input: EventInput) : Event
            createUser(input: UserInput) : User
        }

        type RootQuery{
            event : [Event!]!
        }

        schema {
            query : RootQuery
            mutation : RootMutation
        }
    
    `)