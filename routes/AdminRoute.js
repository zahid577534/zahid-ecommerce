export const ADMIN_DASHBOARD = '/admin/dashboard'

//media routes
export const ADMIN_MEDIA_SHOW = '/admin/media'
export const ADMIN_MEDIA_EDIT =(id) =>id? '/admin/media/edit/${id}':''
// categfoury routes
export const ADMIN_CATEGORY_ADD = '/admin/category/add'
export const ADMIN_CATEGORY_SHOW = '/admin/category'
export const ADMIN_CATEGORY_EDIT = (id) =>id? '/admin/category/edit/${id}': ''
export const ADMIN_CATEGORY_DELETE= '/api/category/delete'

//trashroute
// trash routes
// routes/AdminRoute.js
// Trash routes
export const ADMIN_TRASH = (trashOf) => `/admin/trash?trashof=${trashOf}`;
export const ADMIN_TRASH_PRODUCT = "/admin/trash?trashof=product";
export const ADMIN_TRASH_CATEGORY = "/admin/trash?trashof=category";



//prodict route

export const ADMIN_PRODUCT_ADD = '/admin/product/add'
export const ADMIN_PRODUCT_SHOW = '/admin/product'

// routes/AdminRoute.js
//export const ADMIN_PRODUCT_EDIT = (id) => id ? `/admin/product/edit/${id}` : '';
export const ADMIN_PRODUCT_EDIT = (id) =>id? '/admin/product/edit/${id}': ''
// product variant
export const ADMIN_PRODUCT_VARIANT_ADD = '/admin/product-variant/add'
export const ADMIN_PRODUCT_VARIANT_SHOW = '/admin/product-variant'
export const ADMIN_PRODUCT_VARIANT_EDIT = (id) =>id? '/admin/product-variant/edit/${id}': ''
// add coupo
export const ADMIN_COUPON_ADD = '/admin/coupon/add'
export const ADMIN_COUPON_SHOW = '/admin/coupon'
export const ADMIN_COUPON_EDIT = (id) =>id? '/admin/product-variant/edit/${id}': ''

// CUSTOMERS ROUTE

export const ADMIN_CUSTOMERS_SHOW = "/admin/customers";
// REVIEW ROUTE
export const ADMIN_REVIEW_SHOW = "/admin/review";

export const ADMIN_ORDER = "/admin/order";