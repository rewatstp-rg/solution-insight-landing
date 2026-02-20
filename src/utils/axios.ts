import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

import { ENV_NAME_ADMIN } from './constants';

// ----------------------------------------------------------------------

const ENV = import.meta.env.VITE_HOST_NAME;
const clientModule = ENV === ENV_NAME_ADMIN ? { 'Client-Module': `administrator` } : { 'Client-Module': `customer` };
const headers = { 'Accept-Language': 'th', ...clientModule }
const axiosInstance = axios.create({ baseURL: HOST_API, headers });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: '/api/authen/admin/authenticate',
    loginCustomer: '/api/authen/customer/authenticate',
    verifyUser: '/api/authen/customer/verifyUser',
    verifyAdminUser: '/api/authen/admin/verifyAdminUser',
    changePasswordAdminUser: '/api/app/adminUser/resetPassword',
    changePasswordCustomer: '/api/app/customerUserController/resetPassword',
    forgotPassword: 'api/authen/admin/forgotPassword',
    forgotPasswordVerif: '/api/app/forgotPasswordCodeController/getByValue',
    resetForgotPassword: '/api/app/forgotPasswordCodeController/resetForgotPassword',
  },
  masterData: {
    root: '/api/app/masterDataController/',
    listboxByGroup: 'listboxByGroup',
    searchProvince: 'searchProvince',
    saveProvince: 'saveProvince',
    getProvinceByCode: 'getProvinceByCode',
    searchDistrict: 'searchDistrict',
    getByDistrictCode: 'listDistrictByDistrictCode',
    saveDistrict: 'saveDistrict',
    searchConfig: 'searchListboxGroup',
    getByConfigGroup: 'getListboxGroupMaster',
    searchSubDistrict: 'searchSubDistrict',
    getBySubDistrictCode: 'getBySubDistrictCode',
    listProvince: 'listProvince',
    listDistrictByProvinceCode: 'listDistrictByProvinceCode',
    saveSubDistrict: 'saveSubDistrict',
    listSubDistrictByDistrictCode: 'listSubDistrictByDistrictCode',
    listAllListboxGroup: 'listAllListboxGroup',
    listboxGroupMaster: 'listboxGroupMaster',
    saveListBoxGroupMaster: 'saveListBoxGroupMaster',
    saveListBoxMaster: 'saveListBoxMaster',
    getDocumentTypeByCustomer: 'getDocumentTypeByCustomer',
    getListboxMapRdByKey: 'getListboxMapRdByKey',
    listOrganizerDropdown: 'listOrganizerDropdown',
    listEventDropdown: 'listEventDropdown'
  },
  customer: {
    root: '/api/app/customerController/',
    searchCustomer: 'search',
    getCustomerByCode: 'getCustomerByCode',
    createCustomer: 'create',
    updateCustomer: 'update',
    deleteCustomer: 'delete',
    listCustomerByStatus: 'listCustomerByStatus'
  },
  customerUser: {
    root: '/api/app/customerUserController/',
    searchUser: 'search',
    getCustomerUserById: 'getById',
    updateUser: 'update',
    createUser: 'create',
    deleteUser: 'delete',
    getCustomerUserDetailByUserCode: 'getCustomerUserDetailByUserCode'
  },
  administrator: {
    root: '/api/app/adminUser/',
    searchAdminUser: 'search',
    getAdminByCode: 'getAdminByCode',
    createAdminUser: 'create',
    updateAdminUser: 'update',
    deleteAdminUser: 'delete'
  },
  report: {
    root: '/api/app/reportController/',
    demo: 'demo',
    summaryOrder: 'summaryOrder',
    summaryOrderDetailCheckrace: 'summaryOrderDetailCheckrace',
    importTracking: 'importTracking',
    importBib: 'importBib',
    summaryOrderVrCheckrace: 'summaryOrderVrCheckrace'
  },
  file: {
    root: '/api/app/fileController/',
    downloadFileById: 'downloadFileById'
  },
  inputColumn: {
    root: '/api/app/inputColumnController/',
    createInputColumn: 'createInputColumn',
    updateInputColumn: 'updateInputColumn',
    listInputColumnByTemplateCode: 'listInputColumnByTemplateCode',
    createInputColumnOption: 'createInputColumnOption',
    updateInputColumnOption: 'updateInputColumnOption',
    listInputColumnOption: 'listInputColumnOption',
    listInputColumnByTemplateCodeFromRedis: 'listInputColumnByTemplateCodeFromRedis',
    createListInputColumn: 'createListInputColumn',
    updateListInputColumn: 'updateListInputColumn'
  },
  menus: {
    root: '/api/v1/menus/',
    listAllMenu: 'listAllMenu'
  },
  landingPage: {
    root: '/api/app/landingPageController/',
    createProduct: 'createProduct',
    updateProduct: 'updateProduct',
    listProduct: 'listProduct',
    createBanner: 'createBanner',
    updateBanner: 'updateBanner',
    listBanner: 'listBanner',
    createAboutUs: 'createAboutUs',
    updateAboutUs: 'updateAboutUs',
    listAboutUs: 'listAboutUs',
    searchAboutUs: 'searchAboutUs',
    getAboutUsById: 'getAboutUsById',
    deleteAboutUs: 'deleteAboutUs',
    searchProduct: 'searchProduct',
    deleteProduct: 'deleteProduct',
    getProductById: 'getProductById',
    deleteBanner: 'deleteBanner',
    getBannerById: 'getBannerById',
    searchBanner: 'searchBanner',
    searchAnnouncement: 'searchAnnouncement',
    deleteAnnouncement: 'deleteAnnouncement',
    createAnnouncement: 'createAnnouncement',
    updateAnnouncement: 'updateAnnouncement',
    getAnnouncement: 'getAnnouncement'
  },
  eventConfig: {
    root: '/api/app/eventController/',
    getEventByEventUrl: 'getEventByEventUrl',
    searchEvent: 'searchEvent',
    createEvent: 'create',
    updateEvent: 'update',
    listEventOption: 'listEventOption',
    validateEventUrl: 'validateEventUrl',
    listEventSectionByEventCode: 'listEventSectionByEventCode',
    createSection: 'createSection',
    updateSection: 'updateSection',
    createListSectionContent: 'createListSectionContent',
    updateListSectionContent: 'updateListSectionContent',
    createSectionContent: 'createSectionContent',
    updateSectionContent: 'updateSectionContent',
    updateInputField: 'updateInputField',
    createInputField: 'createInputField',
    listInputFieldByEventCode: 'listInputFieldByEventCode',
    updateListInputSequence: 'updateListInputFieldSequence',
    updateListSectionSequence: 'updateListSectionSequence',
    updateSectionContentSequence: 'updateSectionContentSequence',
    listInputFieldByMerchandiseType: 'listInputFieldByMerchandiseType',
    saveEBadge: 'saveEBadge',
    listEventByEventType: 'listEventByEventType'
  },
  ticket: {
    root: '/api/app/ticketController/',
    getTicketByEventCode: 'getTicketByEventCode',
    createTicket: 'create',
    updateTicket: 'update',
    listTicketByEventCode: 'listTicketByEventCode',
    getTicketPriceByTicketCode: 'getTicketPriceByTicketCode',
    createPrice: 'createPrice',
    updatePrice: 'updatePrice',
    getTicketAgeGroupByTicketCode: 'getTicketAgeGroupByTicketCode',
    createAgeGroup: 'createAgeGroup',
    updateAgeGroup: 'updateAgeGroup',
    updateTicketSequence: 'updateTicketSequence',
    updateTicketAgeGroupSequence: 'updateTicketAgeGroupSequence',
    getTicketInputFieldByEventCode: 'getTicketInputFieldByEventCode',
    getTicketOptionByTicketCode: 'getTicketOptionByTicketCode',
    saveListInputOption: 'saveListInputOption'
  },
  order: {
    root: '/api/app/orderController/',
    searchOrder: 'searchOrder',
    getAllOrderCount: 'getAllOrderCount',
    getOrderDetail: 'getOrderDetail',
    updateOrderStatus: 'updateOrderStatus',
    uploadPaymentSlip: 'uploadSlipByAdmin',
    getOrderDetailByOrderTicketCode: 'getOrderDetailByOrderTicketCode',
    saveChangeRunnerDetail: 'saveChangeRunnerDetail',
    adminSaveOrderAddress: 'adminSaveOrderAddress',
    getOrderDetailByOrderMerchandiseCode: 'getOrderDetailByOrderMerchandiseCode',
    saveChangeOrderMerchandiseDetail: 'saveChangeOrderMerchandiseDetail',
    getOrderDetailByOrderHotel: 'getOrderDetailByOrderHotel',
    saveChangeOrderHotelDetail:'saveChangeOrderHotelDetail'
  },
  email: {
    root: '/api/app/emailController/',
    resendEmail: 'resendEmail',
  },
  discount: {
    root: '/api/app/discountController/',
    searchRedeemCoupon: 'searchRedeemCouponCode',
    updateDiscountCode: 'updateDiscountCode',
    searchDiscount: 'searchDiscountConfig',
    createDiscount: 'createDiscountConfig',
    updateDiscount: 'updateDiscountConfig',
    couponReport: 'couponReport',
    getDiscountConfigByCode: 'getDiscountConfigByCode'
  },
  dashboard: {
    root: '/api/app/dashBoardController/',
    getDashBoard: 'getDashBoard',
    getGraph30Day: 'getGraph30Day',
    getGraph3Month: 'getGraph3Month'
  },
  user: {
    root: '/api/app/userController/',
    saveUserAddress: 'saveUserAddress',
    listUserAddressByUserId: 'listUserAddressByUserId',
    listUserFriends: 'listUserFriends'
  },
  role: {
    root: '/api/app/roleController/',
    listRole: 'listRole'
  },
  commonController: {
    uploadImageEmail: '/api/commonController/uploadImageEmail'
  },
  emailMarketing: {
    root: '/api/app/emailMarketingController/',
    searchEmailTemplate: 'searchEmailTemplate',
    create: 'create',
    update: 'update',
    getByEmailTemplateCode: 'getByEmailTemplateCode',
    searchEmailTransaction: 'searchEmailTransaction',
    createEmailTransaction: 'createEmailTransaction',
    getEmailTransaction: 'getEmailTransaction',
    updateEmailTransaction: 'updateEmailTransaction',
    listEmailTemplate: 'listEmailTemplate',
    listEmailTransactionData: 'listEmailTransactionData',
    deleteEmailTransaction: 'deleteEmailTransaction',
    sendExampleEmail: 'sendExampleEmail'
  },
  organizerController: {
    root: '/api/app/organizerController/',
    create: 'create',
    update: 'update',
    getByOrganizCode: 'getByOrganizCode',
    searchOrganizer: 'searchOrganizer'
  },
  mrchandise: {
    root: '/api/app/merchandiseController/',
    create: 'createMerchandise',
    update: 'updateMerchandise',
    listMerchandise: 'listMerchandise',
    searchMerchandise: 'searchMerchandise',
    getMerchandise: 'getMerchandiseDetail',
    updateListMerchandiseSequence: 'updateListMerchandiseSequence',
    updateMerchandiseStatus: 'updateMerchandiseStatus',
    listMerchandiseByEventCodeAndCondition: 'listMerchandiseByEventCodeAndCondition'
  },
  eConfig: {
    root: '/api/app/eConfigController/',
    searchEBib: 'searchEBib',
    createEConfig: 'createEConfig',
    getEConfigDetail: 'getEConfigDetail',
    updateEConfig: 'updateEConfig',
    previewEconfig: 'previewEconfig'
  },
  vr: {
    root: '/api/app/vrController/',
    uploadVrLog: 'uploadVrLog',
    viewVrHistoryLog: 'viewVrHistoryLog',
    getOrderVr: 'getOrderVr',
    searchRanking: 'searchRanking',
    searchVrResult: 'searchVrResult',
    updateVrLogStatus: 'updateVrLogStatus'
  },
  promotion: {
    root: '/api/app/promotionController/',
    search: 'search',
    create: 'create',
    update: 'update',
    listPrivilegeRunner: 'listPrivilegeRunner',
    updatePrivilegeRunner: 'updatePrivilegeRunner',
    getByPromotionCode: 'getByPromotionCode',
    listPromotionCode:'listPromotionCode'
  },
  hotel: {
    root: '/api/app/hotelController/',
    create: 'createHotel',
    update: 'updateHotel',
    listHotel: 'listHotel',
    searchHotel: 'searchHotel',
    getHotel: 'getHotelDetail',
    updateListHotelSequence: 'updateListHotelSequence',
    updateHotelStatus: 'updateHotelStatus',
    listHotelByEventCodeAndCondition: 'listHotelByEventCodeAndCondition'
  },
   common: {
    root: '/api/app/commonController/',
    uploadImageFrame: 'uploadImageFrame',
    searchImageFrameByType: 'searchImageFrameByType',

  },
  product : {
    root: '/api/app/productController/',
    saveProduct: 'saveProduct',
    searchProduct: 'search',
    getProduct: 'getProduct',
    deleteProduct: 'deleteProduct',
    updateProduct: 'updateProduct'
  },
};

export const endpointsCustomer = {
  ticketRequest: {
    root: '/api/app/ticketRequestController/',
    searchTicketRequest: 'searchTicketRequest',
    getTicketByRequestNo: 'getTicketByRequestNo',
    createTickerRequest: 'createTickerRequest',
    replyTicket: 'replyTicket',
    updateTicketRequestStatus: 'updateTicketRequestStatus'
  },
};
