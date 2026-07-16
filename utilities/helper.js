import responseManager from './response.manager.js';
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';

const algorithm = "aes-256-ctr";
// Create key for encryption/decryption (fallback logic for ES Modules environment variable access)
const secretKey = crypto.createHash("sha256").update(String(process.env.CRYPTOSECRET || 'default_secret')).digest("base64").substr(0, 32);
const iv = crypto.randomBytes(16);

// Simple stub for content-types since the original file wasn't provided
const allowedContentTypes = [
    { mimeType: 'image/jpeg', fName: 'jpg' },
    { mimeType: 'image/png', fName: 'png' },
    { mimeType: 'application/pdf', fName: 'pdf' }
];

export const makeid = async (type, length) => {
    const id = uuidv4().replace(/-/g, '') + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return type + id.substring(0, length).toUpperCase();
};

export const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
};

export const getFileType = (mimeType) => {
    let filteredData = allowedContentTypes.filter((element) => element.mimeType == mimeType);
    return filteredData.length > 0 ? filteredData[0].fName : "";
};

export const generateAccessToken = async (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee', {});
};

export const authenticateToken = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader && bearerHeader.split(' ')[1];
        if (!token) return responseManager.unauthorisedRequest(res);
        jwt.verify(token, process.env.JWT_SECRET || 'shivbhavanisecretkey789goldencoffee', async (err, auth) => {
            if (err) {
                console.error("JWT verification failed:", err.message);
                return responseManager.unauthorisedRequest(res);
            } else {
                req.token = auth;
                next();
                // To enable usersessions check, uncomment and adapt to your models:
                // const primary = mongoConnection.useDb(constants.DEFAULT_DB);
                // let sessionData = await primary.model(constants.MODELS.usersessions, usersessionsModel).findOne({ userid: auth.userid });
                // if (sessionData && sessionData?.token === token && sessionData?.isactive === true) {
                // } else { return responseManager.unauthorisedRequest(res); }
            }
        });
    } else {
        return responseManager.unauthorisedRequest(res);
    }
};

export const passwordDecryptor = async (passwordKeyDecrypt) => {
    try {
        const decLayer1 = CryptoJS.TripleDES.decrypt(passwordKeyDecrypt, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret');
        const deciphertext1 = decLayer1.toString(CryptoJS.enc.Utf8);
        const decLayer2 = CryptoJS.DES.decrypt(deciphertext1, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret');
        const deciphertext2 = decLayer2.toString(CryptoJS.enc.Utf8);
        const decLayer3 = CryptoJS.AES.decrypt(deciphertext2, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret');
        const finalDecPassword = decLayer3.toString(CryptoJS.enc.Utf8);
        return finalDecPassword;
    } catch (err) {
        throw err;
    }
};

export const passwordEncryptor = async (passwordKeyEncrypt) => {
    try {
        const encLayer1 = CryptoJS.AES.encrypt(passwordKeyEncrypt, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret').toString();
        const encLayer2 = CryptoJS.DES.encrypt(encLayer1, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret').toString();
        const finalEncPassword = CryptoJS.TripleDES.encrypt(encLayer2, process.env.PASSWORD_ENCRYPTION_SECRET || 'secret').toString();
        return finalEncPassword;
    } catch (err) {
        throw err;
    }
};

export const getInvoiceNo = (invno) => {
    let inv_number = invno + 1;
    const lengoftemp = inv_number.toString().length;
    if (lengoftemp == 1) inv_number = '0000000' + inv_number;
    else if (lengoftemp == 2) inv_number = '000000' + inv_number;
    else if (lengoftemp == 3) inv_number = '00000' + inv_number;
    else if (lengoftemp == 4) inv_number = '0000' + inv_number;
    else if (lengoftemp == 5) inv_number = '000' + inv_number;
    else if (lengoftemp == 6) inv_number = '00' + inv_number;
    else if (lengoftemp == 7) inv_number = '0' + inv_number;
    return inv_number;
};

export const digitTomoney = (cost) => {
    let x = parseFloat(cost).toFixed(2);
    let afterPoint = '';
    if (x.indexOf('.') > 0) afterPoint = x.substring(x.indexOf('.'), x.length);
    x = Math.floor(x).toString();
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
};

export const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
};

export const createTransporters = async () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
        debug: false,
    });
};

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
    };
};

export const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, "hex"));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);
    return decrpyted.toString();
};

export default {
    makeid,
    formatAMPM,
    getFileType,
    generateAccessToken,
    authenticateToken,
    passwordDecryptor,
    passwordEncryptor,
    getInvoiceNo,
    digitTomoney,
    bytesToMB,
    createTransporters,
    encrypt,
    decrypt
};
