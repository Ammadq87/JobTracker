const AuthDAL = require('../database/auth.js')
const bcrypt = require('bcrypt')
class AuthController {
    static async signUp (email, password, fullName) {
        try {
            const isUnqiueEmail = await AuthDAL.getUserByEmail(email)
            if (isUnqiueEmail[0] && isUnqiueEmail[0]['Found'] !== 0)
                return {status: 400, msg: 'Email is taken.'}
    
            AuthDAL.signUp(email, password, fullName)
            return {status: 200, msg: 'Sucessfully signed up.'}
    
        } catch (e) {
            console.log(e)
            return {status: 500, msg: 'Something went wrong in SignUp'}
        }
    }
    
    static async login (email, password) {
        try {
            const user = await AuthDAL.getUserByEmail(email)
            if (user.length === 0) return {status: 401, msg: 'Invalid email/password'}
    
            const passwordMatch = await bcrypt.compare(password, user[0].Password)

            const data = {UserID: user[0]['UserID'], Email: user[0]['Email'], FullName: user[0]['FullName']}
            if (!passwordMatch) return {status: 401, msg: 'Invalid email/password'}
            return {status: 200, msg: 'Login Successful', data: data}
        } catch (e) {
            console.log(e)
            return {status: 500, msg: 'Internal Server Error'}
        }
    }
}

module.exports = AuthController