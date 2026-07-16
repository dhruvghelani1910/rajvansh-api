import cloudinaryUtil from '../../utilities/cloudinary.js';
import responseManager from '../../utilities/response.manager.js';

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return responseManager.sendError(res, 'No file uploaded', null, 400);
    }
    const folder = req.query.folder || 'general';
    const imageUrl = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);
    
    return responseManager.sendSuccess(res, 'Image uploaded successfully', { url: imageUrl }, 200);
  } catch (error) {
    return responseManager.sendError(res, 'Image upload failed', error, 500);
  }
};

export default uploadImage;
