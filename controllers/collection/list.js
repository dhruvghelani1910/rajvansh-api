import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';

const list = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const CollectionModel = primary.model(constants.MODELS.product, modelSchema);
    const items = await CollectionModel.find({}).sort({ createdAt: -1 });
    return responseManager.sendSuccess(res, 'Collections retrieved', items);
  } catch (error) {
    return responseManager.sendError(res, 'Failed to fetch collections', error, 500);
  }
};

export default list;
