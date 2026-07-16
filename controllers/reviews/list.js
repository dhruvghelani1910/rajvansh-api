import mongoConnection from "../../utilities/connections.js";
import constants from "../../utilities/constants.js";
import responseManager from "../../utilities/response.manager.js";
import reviewsModel from "../../models/reviews.js";

export const list = async (req, res) => {
    const { productid, limit, page } = req.body;
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    try {
        let query = {};
        
        // Filter by specific product if provided
        if (productid) {
            query.productid = productid;
        }

        // Admins can see all reviews, clients see only approved (status: true)
        if (req.body.status !== undefined) {
            query.status = req.body.status;
        } else {
            // Default: only fetch visible reviews for clients
            query.status = true;
        }

        let options = {
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 50,
            sort: { createdAt: -1 }
        };

        const reviews = await primary.model(constants.MODELS.reviews, reviewsModel).paginate(query, options);
        return responseManager.onSuccess("Reviews fetched successfully!", reviews, res);
    } catch (error) {
        console.log("Error in review list:", error);
        return responseManager.onError(error, res);
    }
};
