import mongoConnection from '../../utilities/connections.js';
import constants from '../../utilities/constants.js';
import responseManager from '../../utilities/response.manager.js';
import modelSchema from '../../models/product.js';
import mongoose from 'mongoose';
import cloudinaryUtil from '../../utilities/cloudinary.js';

const create = async (req, res) => {
  try {
    const { collectionid, name, category, color, fabric, description, price, availability, occasion } = req.body;
    let imageUrl = req.body.image;
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const Collection = primary.model(constants.MODELS.product, modelSchema);

    if (!collectionid && (!name || !price)) {
      return responseManager.sendError(res, 'Name and price are required for new collections', null, 400);
    }

    // Handle uploaded file
    if (req.file) {
      imageUrl = await cloudinaryUtil.uploadToCloudinary(req.file.buffer, 'collections');
    }

    if (collectionid) {
      // Update Mode
      const collection = await Collection.findById(collectionid);
      if (!collection) {
        return responseManager.sendError(res, 'Collection entry not found', null, 404);
      }

      collection.name = name || collection.name;
      collection.category = category !== undefined ? category : collection.category;
      collection.color = color !== undefined ? color : collection.color;
      collection.fabric = fabric !== undefined ? fabric : collection.fabric;
      collection.description = description !== undefined ? description : collection.description;
      collection.price = price || collection.price;
      collection.availability = availability || collection.availability;
      collection.occasion = occasion !== undefined ? occasion : collection.occasion;

      if (imageUrl) {
        collection.image = imageUrl;
      }

      await collection.save();
      return responseManager.sendSuccess(res, 'Collection entry updated successfully', collection, 200);
    } else {
      // Create Mode
      if (!imageUrl) {
        return responseManager.sendError(res, 'An image URL or file upload is required', null, 400);
      }

      const newItem = await Collection.create({
        name,
        category,
        color,
        fabric,
        description,
        price,
        image: imageUrl,
        availability: availability || 'Available',
        occasion
      });

      return responseManager.sendSuccess(res, 'Collection entry created successfully', newItem, 201);
    }
  } catch (error) {
    return responseManager.sendError(res, 'Failed to create collection entry', error, 500);
  }
};

export default create;
