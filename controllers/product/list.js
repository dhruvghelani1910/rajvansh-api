import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';
import userModel from '../../models/user.js';
import categoryModel from '../../models/category.js';

export const list = async (req, res) => {
    const { page = 1, limit = 10, search = '', sortfield = 'createdAt', sortoption = -1, status, isDeleted = false, category, color, availability, maxPrice } = req.body;
    
    let query = { isDeleted };
    if (typeof status === 'boolean') query.status = status;
    
    if (category && category !== 'All') query.category = category;
    if (availability && availability !== 'All') query.availability = availability;
    if (color && color !== 'All') query.color = new RegExp(color, 'i');
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    
    if (search && search.trim() !== '') {
        let searchRegex = new RegExp(search, "i");
        query.$or = [
            { productname: searchRegex },
            { description: searchRegex }
        ];
    }
    
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const Model = primary.model(constants.MODELS.product, modelSchema);
        const User = primary.model(constants.MODELS.users, userModel);
        const Category = primary.model(constants.MODELS.category, categoryModel);

        Model.paginate(query, {
            page,
            limit: parseInt(limit),
            populate: [
                { path: 'createdBy', model: User, select: '_id username profilepic' },
                { path: 'updatedBy', model: User, select: '_id username profilepic' },
                { path: 'category', model: Category, select: '_id name' }
            ],
            sort: { [sortfield]: sortoption },
            lean: true
        }).then((data) => {
            // Flatten the category object so frontend components using product.category (string) still work where possible
            if (data && data.docs) {
                data.docs = data.docs.map(doc => {
                    if (doc.category && doc.category.name) {
                        doc.categoryName = doc.category.name;
                        doc.categoryId = doc.category._id;
                        doc.category = doc.category.name; // Keep product.category as a string for backward compatibility on frontend
                    }
                    return doc;
                });
            }
            return responseManager.onSuccess('List fetched successfully', data, res);
        }).catch((error) => {
            return responseManager.onError(error, res);
        });
    } catch (error) {
        return responseManager.onError(error, res);
    }
};
