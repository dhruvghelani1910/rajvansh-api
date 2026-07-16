import { v2 as cloudinary } from 'cloudinary';
import stream from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const saveToCloud = async (file, projectFolder, parentFolder, userFolderId) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadOptions = {
        folder: `${projectFolder}/${parentFolder}/${userFolderId}`,
        quality: "20", 
    };

    if (file.mimetype === "image/svg+xml") {
        uploadOptions.resource_type = "raw";
        uploadOptions.format = "svg";
    } else {
        uploadOptions.resource_type = "auto";
    }

    const res = await cloudinary.uploader.upload(dataURI, uploadOptions);
    return res.secure_url;
};

export const saveToCloudMixedPDFEXCEL = async (file, projectFolder, parentFolder, userFolderId) => {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const folderPath = `${projectFolder}/${parentFolder}/${userFolderId}`;

    const uploadOptions = {
        folder: folderPath,
        resource_type: "auto"
    };

    if (file.mimetype === "image/svg+xml") {
        uploadOptions.resource_type = "raw";
        uploadOptions.format = "svg";
    }

    if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.originalname.endsWith('.xlsx')
    ) {
        uploadOptions.resource_type = 'raw';
        uploadOptions.public_id = file.originalname;   
        uploadOptions.use_filename = true;
        uploadOptions.unique_filename = false;             
    }

    if (file.mimetype.startsWith("image/") && file.mimetype !== "image/svg+xml") {
        uploadOptions.quality = "20";
    }

    const res = await cloudinary.uploader.upload(dataURI, uploadOptions);
    return res.secure_url;
};

export const savePdfToCloud = async (buffer, projectFolder, parentFolder, userFolderId) => {
    const folderPath = `${projectFolder}/${parentFolder}/${userFolderId}`;
    const publicId = `${Date.now()}.pdf`;

    return new Promise((resolve, reject) => {
        const passthrough = new stream.PassThrough();
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folderPath,
                public_id: publicId.replace(/\.pdf$/, ''),
                resource_type: 'raw',
                format: 'pdf'
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error);
                    return reject(error);
                }
                return resolve(result.secure_url);
            }
        );
        passthrough.end(buffer);
        passthrough.pipe(uploadStream);
    });
};

export const multipleImageUpload = async (images, parentFolder, userFolderId) => {
    if (!Array.isArray(images)) {
        throw new Error("Images must be an array");
    }
    const uploadPromises = images.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString('base64');
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.uploader.upload(dataURI, {
            folder: `${parentFolder}/${userFolderId}`,
        });
        return res.secure_url;
    });
    return await Promise.all(uploadPromises);
};

export const saveExcelToCloud = async (fileBuffer, projectFolder, parentFolder, fileName) => {
    const b64 = fileBuffer.toString('base64');
    const dataURI = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI, {
        folder: `${projectFolder}/${parentFolder}`,
        resource_type: 'raw',
        public_id: `${fileName}`,
    });
    return res.secure_url;
};

export const uploadToCloudinary = async (buffer, folder, mimetype = 'image/jpeg') => {
    const b64 = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${mimetype};base64,${b64}`;
    
    // For videos, quality compression works differently or is unsupported by basic transformations
    const isVideo = mimetype.startsWith('video/');
    
    const res = await cloudinary.uploader.upload(dataURI, {
        folder: `rajvansh/${folder}`,
        resource_type: 'auto',
        quality: isVideo ? undefined : 'auto',
    });
    return res.secure_url;
};

export default {
    saveToCloud,
    saveToCloudMixedPDFEXCEL,
    savePdfToCloud,
    multipleImageUpload,
    saveExcelToCloud,
    uploadToCloudinary
};
