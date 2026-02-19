
export const ROOT_ADMIN = '/admin';

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  EVENT: '/event',
  ADMIN: '/administrator',
  IMPORT: '/import',
  REPORT: '/report',
  MASTER_CONFIG: '/master-data',
  CUSTOMER_TEMPALTE: '/customer-template',
  MY_TASK: '/task',
  MY_DOCUMENT: '/documents',
  CONFIG_TEMPALTE: '/config-template',
  LANDINF_PAGE: '/landing-page',
  PROMOTION_PAGE: '/promotion'
};

const ROOTS_CUSTOMER = {
  CUSTOMER_TICKET: '/ticket-customer',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
  // AUTH
  auth: {
    jwt: {
      login: `/login`,
      register: `/register`,
    }
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOT_ADMIN}${ROOTS.DASHBOARD}/overview`,
    general: {
      app: `${ROOT_ADMIN}${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOT_ADMIN}${ROOTS.DASHBOARD}/ecommerce`,
      overview: `${ROOT_ADMIN}${ROOTS.DASHBOARD}/overview`,
    },
  },
  event: {
    root: `${ROOT_ADMIN}${ROOTS.EVENT}`,
    add: `${ROOT_ADMIN}${ROOTS.EVENT}/add`
  },
  admin: {
    root: `${ROOT_ADMIN}${ROOTS.ADMIN}`,
    add: `${ROOT_ADMIN}${ROOTS.ADMIN}/add`,
  },
  import: {
    root: `${ROOT_ADMIN}${ROOTS.IMPORT}`,
    etax: `${ROOT_ADMIN}${ROOTS.IMPORT}/e-tax`,
    eDocument: `${ROOT_ADMIN}${ROOTS.IMPORT}/e-document`,
  },
  report: {
    root: `${ROOT_ADMIN}${ROOTS.REPORT}`,
  },
  ticket: {
    root: `${ROOT_ADMIN}${ROOTS_CUSTOMER.CUSTOMER_TICKET}`,
    add: `${ROOT_ADMIN}${ROOTS_CUSTOMER.CUSTOMER_TICKET}/submitticket/add`,
  },
  masterData: {
    provinces: `${ROOT_ADMIN}${ROOTS.MASTER_CONFIG}/province`,
    district: `${ROOT_ADMIN}${ROOTS.MASTER_CONFIG}/district`,
    subDistrict: `${ROOT_ADMIN}${ROOTS.MASTER_CONFIG}/sub-district`,
    configGroup: `${ROOT_ADMIN}${ROOTS.MASTER_CONFIG}/config-group`
  },
  mytask: {
    root: `${ROOT_ADMIN}${ROOTS.MY_TASK}`,
    accounting: `${ROOT_ADMIN}${ROOTS.MY_TASK}/accounting`,
    preview: `${ROOT_ADMIN}${ROOTS.MY_TASK}/accounting/preview`,
  },
  documents: {
    root: `${ROOT_ADMIN}${ROOTS.MY_DOCUMENT}`,
  },
  landingPage: {
    landingPage: `${ROOT_ADMIN}${ROOTS.LANDINF_PAGE}`,
    aboutUs: `${ROOT_ADMIN}${ROOTS.LANDINF_PAGE}/about-us`,
  },
  promotion: {
    root: `${ROOT_ADMIN}${ROOTS.PROMOTION_PAGE}`,
    add: `${ROOT_ADMIN}${ROOTS.PROMOTION_PAGE}/add`,
    edit: `${ROOT_ADMIN}${ROOTS.PROMOTION_PAGE}/edit`,
    view: `${ROOT_ADMIN}${ROOTS.PROMOTION_PAGE}/inquiry`,
  },
};
