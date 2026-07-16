import mongoConnection from "../../utilities/connections.js";
import constants from "../../utilities/constants.js";
import responseManager from "../../utilities/response.manager.js";
import reviewsModel from "../../models/reviews.js";

export const create = async (req, res) => {
    const { productid, author, rating, content } = req.body;
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    try {
        if (!productid || !author || !rating || !content) {
            return responseManager.badrequest({ message: "All fields are required" }, res);
        }

        const newReview = await primary.model(constants.MODELS.reviews, reviewsModel).create({
            productid,
            author,
            rating: parseInt(rating),
            content,
            status: true // Default to true so they are visible automatically
        });

        return responseManager.onSuccess("Review created successfully!", newReview, res);
    } catch (error) {
        console.log("Error in review create:", error);
        return responseManager.onError(error, res);
    }
};
