import Banner from '../../models/banner.js';
import responseManager from '../../utilities/response.manager.js';

export const getAll = async (req, res) => {
  try {
    const { type, status } = req.query;
    let query = {};
    if (type) query.type = type;
    if (status !== undefined) query.status = status === 'true';

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });
    return responseManager.sendSuccess(res, 'Banners fetched successfully', banners, 200);
  } catch (error) {
    return responseManager.sendError(res, 'Failed to fetch banners', error, 500);
  }
};

export const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    
    if (!banner) {
      return responseManager.sendError(res, 'Banner not found', null, 404);
    }

    return responseManager.sendSuccess(res, 'Banner fetched successfully', banner, 200);
  } catch (error) {
    return responseManager.sendError(res, 'Failed to fetch banner', error, 500);
  }
};
