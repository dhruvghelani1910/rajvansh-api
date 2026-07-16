import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';

const deleteItem = async (req, res) => {
  try {
    const { id } = req.body;
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const CollectionModel = primary.model(constants.MODELS.product, modelSchema);
    const item = await CollectionModel.findById(id);
    if (!item) {
      return responseManager.sendError(res, 'Collection item not found', null, 404);
    }

    await CollectionModel.findByIdAndDelete(id);
    return responseManager.sendSuccess(res, 'Collection item deleted successfully', { id });
  } catch (error) {
    return responseManager.sendError(res, 'Failed to delete collection item', error, 500);
  }
};

export default deleteItem;
