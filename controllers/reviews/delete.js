import mongoConnection from "../../utilities/connections.js";
import constants from "../../utilities/constants.js";
import responseManager from "../../utilities/response.manager.js";
import reviewsModel from "../../models/reviews.js";

export const deleteReview = async (req, res) => {
    const { id } = req.body;
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    try {
        if (!id) {
            return responseManager.badrequest({ message: "Review ID is required" }, res);
        }

        const deletedReview = await primary.model(constants.MODELS.reviews, reviewsModel).findByIdAndDelete(id);
        
        if (!deletedReview) {
            return responseManager.badrequest({ message: "Review not found" }, res);
        }

        return responseManager.onSuccess("Review deleted successfully!", deletedReview, res);
    } catch (error) {
        console.log("Error in review delete:", error);
        return responseManager.onError(error, res);
    }
};
