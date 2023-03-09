const { buildSchema } = require('graphql')

module.exports = buildSchema(`

        type Event{
            _id: ID
            title: String!
            description: String
            price: Float!
            date: String!
            creator: User!
        }

        type User{
            _id: ID
            email: String!
            password: String
            createdEvents: [Event!]
        }

        type Booking{
            _id: ID
            event: Event!
            user: User!
            createdAt: String
            updatedAt: String
        }

        type AuthData{
            userID: ID
            token: String!
            tokenExpiration: Int!
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
            bookEvent(eventID: ID!) : Booking!
            cancelBooking(bookingID: ID!) : Event!
        }

        type RootQuery{
            events : [Event!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }

        schema {
            query : RootQuery
            mutation : RootMutation
        }
    
    `)