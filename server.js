const express = require('express')
const bodyParser = require('body-parser')

const { graphqlHTTP } = require('express-graphql')

const mongoose = require('mongoose')

const graphQLSchema  = require('./graphql/schema/schema.js')
const graphQLResolver = require('./graphql/resolver/resolver')


const app = express()
app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue:graphQLResolver,
    graphiql: true
}))

const port = 8081


mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB}`).then(() => {
    app.listen(port, () => console.log(`Server is connected with mongoDB and Up and running at port:${port}`))}
).catch( err => {
    console.log(err)
})


