const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


module.exports = {

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
    },

    login: async (args) => {
        try {
            const user = await User.findOne({ email: args.email })
            if (!user) {
                throw new Error("User does not exists")
            }
            const isEqual = await bcrypt.compare(args.password, user.password)
            if (!isEqual) {
                throw new Error("Wrong Credentials")
            }

            const token = jwt.sign({ userID: user.id, email: user.email }, 'somesupersecretkey', { expiresIn: '1h' })
            return { userID: user.id, token: token, tokenExpiration: 1 }
        } catch (err) {
            console.log(err)
            throw err
        }
    }

}