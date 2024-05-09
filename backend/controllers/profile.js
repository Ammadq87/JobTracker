const ProfileDAL = require('../database/profile')
class ProfileController {
    
    static async getMyProfile(uID) {
        try {
            const myProfileInfo = await ProfileDAL.getMyProfile(uID)
            return myProfileInfo[0]
        } catch (e) {
            console.error(e)
        }
        
    }
}

module.exports = ProfileController