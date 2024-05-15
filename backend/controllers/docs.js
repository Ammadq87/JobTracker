const Redis = require('../lib/redis')
const Utils = require('../lib/utils')
const DocsDAL = require('../database/docs')

class DocsController {

    /**
     * 
     * @param {Request} req 
     */
    static async createNewCategory(req) {
        try {

            const Name = req.body.Name.trim()
            if (Name.length > 255) {
                console.log(`log -- Category name too long.`)
                return {status: 400, msg: `Category name too long.`}
            }

            const uID = await Utils.getUID(req)
            const doesCategoryExist = await DocsDAL.doesCategoryExist(uID, Name)
            if (doesCategoryExist[0] && doesCategoryExist[0]['Found'] !== 0) {
                console.log(`log -- Category '${Name}' already exists. Please choose a different name.`)
                return {status: 400, msg: `Category '${Name}' already exists. Please choose a different name.`}
            }

            await DocsDAL.createNewCategory(uID, Name);
            console.log('log -- Category successfully created.')
            return {status: 200, msg: 'Category successfully created.'}
        } catch (e) {
            console.error(e)
        }
    }

    static async getAllCategoriesAndDocuments(req) {
        
    }
}

module.exports = DocsController