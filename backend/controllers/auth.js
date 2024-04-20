const auth = require('../database/auth.js')
const bcrypt = require('bcrypt')

async function signUp (email, password, fullName) {
    try {
        const isUnqiueEmail = await auth.isUnqiueEmail(email)
        if (isUnqiueEmail[0]['Found'] !== 0)
            return {status: 400, msg: 'Email is taken.'}

        auth.signUp(email, password, fullName)
        return {status: 200, msg: 'Sucessfully signed up.'}

    } catch (e) {
        console.log(e)
        return {status: 500, msg: 'Something went wrong in SignUp'}
    }
}

async function login (email, password) {
    try {
        const user = await auth.getUserByEmail(email)
        if (!user) return {status: 401, msg: 'Invalid email/password'}

        const passwordMatch = await bcrypt.compare(password, user[0].Password)

        if (!passwordMatch) return {status: 401, msg: 'Invalid email/password'}
        return {status: 200, msg: 'Login Successful'}
    } catch (e) {
        console.log(e)
        return {status: 500, msg: 'Internal Server Error'}
    }
}

module.exports = {signUp, login}