const constants = {
    DEFAULT_DB: process.env.NODE_ENV === 'development' ? process.env.DEV_DATABASE || 'rajvansh' : process.env.PRO_DATABASE || 'rajvansh',
    MODELS: {
        users: 'users',
        banner: 'banner',
        blog: 'blog',
        category: 'category',
        gallery: 'gallery',
        inquiry: 'inquiry',
        product: 'product',
        order: 'order',
        testimonial: 'testimonial',
        setting: 'setting',
        instagram: 'instagram',
        customer: 'customer',
        reviews: 'reviews',
        appointment: 'appointment',
        dailySlot: 'dailySlot'
    }
};

export default constants;
