const User = require('../../models/user')
const bcrypt = require('bcryptjs')


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


}