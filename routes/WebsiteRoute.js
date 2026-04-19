export const WEBSITE_HOME = "/";
export const WEBSITE_LOGIN = "/auth/login"; 
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = '/auth/reset-password';
//export const WEBSITE_FORGOT_PASSWORD = "/auth/forgot-password";
// user route
export const USER_DASHBOARD = '/my-account';
export const USER_PROFILE = '/profile';
export const USER_ORDER = '/orders';

export const WEBSITE_SHOP = '/shop';
export const PRODUCT_DETAIL = (slug) => slug? `/product/${slug}` : '/product';
export const WEBSITE_CART = '/cart'
export const WEBSITE_CHECKOUT = '/checkout'
