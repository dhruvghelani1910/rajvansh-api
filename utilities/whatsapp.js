// whatsapp.js - WhatsApp Integration Utility
// Placeholder for future WhatsApp Business API integration (e.g. Twilio, Gupshup, Meta Cloud API)

import mongoConnection from './connections.js';
import constants from './constants.js';
import settingSchema from '../models/setting.js';

/**
 * Helper function to get the company mobile number from settings
 */
const getCompanyMobile = async () => {
    try {
        const primary = mongoConnection.useDb(constants.DEFAULT_DB);
        const SettingModel = primary.model(constants.MODELS.setting, settingSchema);
        const settings = await SettingModel.findOne();
        return settings?.phone || 'DEFAULT_COMPANY_NUMBER';
    } catch (error) {
        return 'DEFAULT_COMPANY_NUMBER';
    }
};

/**
 * Sends a WhatsApp notification to the store owner or customer when a new order is placed.
 * @param {Object} orderDetails - The details of the newly created order
 */
export const sendOrderNotification = async (orderDetails) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log('🔔 [WHATSAPP STUB] New Order Notification Triggered');
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer): ${orderDetails.mobile || orderDetails.phone || 'Unknown'}`);
        console.log(`Order ID: ${orderDetails._id || 'N/A'}`);
        console.log(`Total Amount: ${orderDetails.totalAmount || 0}`);
        console.log('TODO: Insert actual WhatsApp API call here (e.g. UltraMsg, Twilio).');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Order Notification:', error);
        return false;
    }
};

/**
 * Sends a WhatsApp notification to the customer when their order status changes.
 * @param {Object} orderDetails - The details of the updated order
 */
export const sendOrderStatusUpdate = async (orderDetails) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log(`🔔 [WHATSAPP STUB] Order Status Update Triggered`);
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer): ${orderDetails.mobile || orderDetails.phone || 'Unknown'}`);
        console.log(`Order ID: ${orderDetails._id}`);
        console.log(`New Status: ${orderDetails.orderStatus}`);
        console.log('TODO: Insert actual WhatsApp API call here (e.g. UltraMsg, Twilio).');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Order Status Update:', error);
        return false;
    }
};

/**
 * Sends a WhatsApp notification when a new inquiry is submitted.
 * @param {Object} inquiryDetails - The details of the inquiry
 */
export const sendInquiryNotification = async (inquiryDetails) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log('🔔 [WHATSAPP STUB] New Inquiry Notification Triggered');
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer): ${inquiryDetails.phone || 'Unknown'}`);
        console.log(`Name: ${inquiryDetails.fullname || 'Unknown'}`);
        console.log(`Email: ${inquiryDetails.email || 'N/A'}`);
        console.log('TODO: Insert actual WhatsApp API call here (e.g. UltraMsg, Twilio).');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Inquiry Notification:', error);
        return false;
    }
};

/**
 * Sends a WhatsApp notification when a new review is submitted.
 * @param {Object} reviewDetails - The details of the review
 */
export const sendReviewNotification = async (reviewDetails) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log('🔔 [WHATSAPP STUB] New Review Notification Triggered');
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer): ${reviewDetails.customerPhone || 'Unknown'}`);
        console.log(`Product: ${reviewDetails.productid || 'Unknown'}`);
        console.log(`Rating: ${reviewDetails.rating || 'N/A'} Stars`);
        console.log('TODO: Insert actual WhatsApp API call here (e.g. UltraMsg, Twilio).');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Review Notification:', error);
        return false;
    }
};

/**
 * Sends a WhatsApp invoice notification when an order is approved.
 * @param {Object} orderDetails - The details of the approved order
 * @param {Object} customer - The customer object containing phone number
 */
export const sendInvoiceNotification = async (orderDetails, customer) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log('🔔 [WHATSAPP STUB] Sending Invoice Notification');
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer Phone): ${customer?.phone || 'N/A'}`);
        console.log(`Order ID: ${orderDetails._id}`);
        console.log(`Amount Paid: ₹${orderDetails.totalAmount}`);
        console.log(`Status: ${orderDetails.paymentStatus}`);
        console.log('TODO: Insert actual WhatsApp API call (e.g., Twilio/Gupshup) to send PDF/Invoice message.');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Invoice:', error);
        return false;
    }
};

/**
 * Sends a WhatsApp notification when a new appointment is booked.
 * @param {Object} appointmentDetails - The details of the appointment
 */
export const sendAppointmentNotification = async (appointmentDetails) => {
    try {
        const companyMobile = await getCompanyMobile();
        console.log('================================================');
        console.log('🔔 [WHATSAPP STUB] New Appointment Notification Triggered');
        console.log(`FROM (Company): ${companyMobile}`);
        console.log(`TO (Customer): ${appointmentDetails.mobile || 'Unknown'}`);
        console.log(`Name: ${appointmentDetails.name || 'Unknown'}`);
        console.log(`Date: ${appointmentDetails.eventDate || 'N/A'}`);
        console.log(`Time: ${appointmentDetails.time || 'N/A'}`);
        console.log('TODO: Insert actual WhatsApp API call here (e.g. UltraMsg, Twilio).');
        console.log('================================================');
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp Appointment Notification:', error);
        return false;
    }
};

export default {
    sendOrderNotification,
    sendOrderStatusUpdate,
    sendInquiryNotification,
    sendReviewNotification,
    sendInvoiceNotification,
    sendAppointmentNotification
};
