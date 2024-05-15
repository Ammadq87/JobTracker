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

            const Name = req.body.Name
            if (Name.length > 255) {
                console.log(`Category name too long.`)
                return {status: 400, msg: `Category name too long.`}
            }

            const uID = await Utils.getUID(req)
            const doesCategoryExist = await DocsDAL.doesCategoryExist(uID, req.body.Name)
            if (doesCategoryExist[0] && doesCategoryExist[0]['Found'] !== 0) {
                console.log(`Category '${req.body.Name}' already exists. Please choose a different name.`)
                return {status: 400, msg: `Category '${req.body.Name}' already exists. Please choose a different name.`}
            }

            await DocsDAL.createNewCategory(uID, req.body.Name);
            console.log('Category successfully created.')
            return {status: 200, msg: 'Category successfully created.'}
        } catch (e) {
            console.error(e)
        }
    }

    static async getAllCategoriesAndDocuments(req) {
        
    }
}

module.exports = DocsController