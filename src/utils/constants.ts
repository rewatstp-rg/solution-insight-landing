/* eslint-disable no-template-curly-in-string */

export const ENV_NAME_ADMIN = Object.freeze('ADMIN');
export const ENV_NAME_CUSTOMER = Object.freeze('CUSTOMER');

export const MENU_ID: any = Object.freeze({
  EVENT: 'MN002',
  PAYMENT: 'MN019',
  REPORT: 'MN006',
  VR_RESULT: 'MN029',
  VR_REPORT: 'MN030',
});

export const AUTH_INVALID_MESSAGE: any = Object.freeze({
  VALIDATION_FAILED: 'ชื่อหรือรหัสผ่านไม่ถูกต้อง',
  UNAUTHORIZED: 'กรุณาติดต่อผู้ดูแลระบบ',
});

export const AUTH_TYPE: any = Object.freeze({
  NEW_USER: 'NEW_USER',
  ACTIVE: 'ACTIVE',
  USER_VALID: 'USER_VALID'
})


export const STORAGE_KEYS = Object.freeze({
  USER_INFO: 'user-info-easy-etax',
  CUSTOMER_INFO: 'customer-info-easy-etax',
});

export const MASTER_CONFIG_GROUP = Object.freeze({
  REGISTER_STATUS: 'REGISTER_STATUS',
  CUSTOMER_TYPE: 'CUSTOMER_TYPE',
  EVENT_STATUS: 'EVENT_STATUS',
  ADMIN_STATUS: 'ADMIN_STATUS',
  PROVINCE_STATUS: 'PROVINCE_STATUS',
  INPUT_CONTROL_TYPE: 'INPUT_CONTROL_TYPE',
  INPUT_COL: 'INPUT_COL',
  INPUT_TYPE: 'INPUT_TYPE',
  EVENT_RACE_TYPE: 'EVENT_RACE_TYPE',
  DEFAULT_STATUS: 'DEFAULT_STATUS',
  PAYMENT_GATEWAY: 'PAYMENT_GATEWAY',
  PAYMENT_GATEWAY_UNIT: 'PAYMENT_GATEWAY_UNIT',
  PAYMENT_GATEWAY_STATUS: 'PAYMENT_GATEWAY_STATUS',
  TAG: 'TAG',
  EVENT_REGISTER_TYPE: 'EVENT_REGISTER_TYPE',
  DISTANCE_UNIT: 'DISTANCE_UNIT',
  TICKET_STATUS_OPTION: 'TICKET_STATUS',
  PRICE_TYPE: 'PRICE_TYPE',
  TICKET_AGE_GROUP_STATUS: 'TICKET_AGE_GROUP_STATUS',
  GENDER: 'GENDER',
  EVENT_SECTION_STATUS: 'EVENT_SECTION_STATUS',
  INPUT_FIELD_STATUS: 'INPUT_FIELD_STATUS',
  EVENT_CONTROL_TYPE: 'EVENT_CONTROL_TYPE',
  INPUT_HTML_KEY: 'INPUT_HTML_KEY',
  EVENT_SPECIA_INPUT: 'EVENT_SPECIA_INPUT',
  EVENT_INPUT_TYPE: 'EVENT_INPUT_TYPE',
  NATIONALITY_ENG: 'NATIONALITY_ENG',
  ORDER_STATUS: 'ORDER_STATUS',
  DISCOUNT_STATUS: 'DISCOUNT_STATUS',
  DISCOUNT_TYPE: 'DISCOUNT_TYPE',
  DISCOUNT_MODE: 'DISCOUNT_MODE',
  DISCOUNT_UNIT: 'DISCOUNT_UNIT',
  EMAIL_TEMPLATE_STATUS: 'EMAIL_TEMPLATE_STATUS',
  EMAIL_TRANSACTION_STATUS: 'EMAIL_TRANSACTION_STATUS',
  ORG_STATUS: 'ORG_STATUS',
  MERCHANDIES_TYPE: 'MERCHANDIES_TYPE',
  MERCHANDISE_GROUP: 'MERCHANDISE_GROUP',
  E_CONFIG_KEY_TYPE: 'E_CONFIG_KEY_TYPE',
  E_CONFIG_TYPE: 'E_CONFIG_TYPE',
  VR_TRACKING_STATUS: 'VR_TRACKING_STATUS',
  RACE_TRACKING_STATUS: 'RACE_TRACKING_STATUS',
  PROMOTION_TYPE: 'PROMOTION_TYPE',
});

export const DATA_TYPE_KEY = Object.freeze({
  CUSTOMER_NAME: 'CUSTOMER_FULL_NAME',
  CUSTOMER_CODE: 'CUSTOMER_NO',
  CLIENT_TAX_BRANCH_CODE: 'CUSTOMER_TAX_BRANCH_CODE', /** BRANCH */
  CLIENT_TAX_ID: 'CUSTOMER_TAX_ID'
});

export const CUSTOMER_TYPE = Object.freeze({
  CORPORATION: 'CORPORATION',
  INDIVIDUAL: 'INDIVIDUAL',
});

export const RESPONSE_STATUS = Object.freeze({
  SUCCESS: 'SUCCESS',
});

export const ERROR_MESSAGE = Object.freeze({
  REQUIRED: 'กรุณาระบุ',
  REQUIRED_REJECT: 'กรุณาระบุเหตุผลที่ไม่ผ่านการอนุมัติ',
  MIN: 'ต้องมีอย่างน้อย ${min} ตัวอักษร',
  MAX: 'ต้องไม่เกิน ${max} ตัวอักษร',
  PATTERN: 'รูปแบบไม่ถูกต้อง',
  PATTERN_DATE: 'รูปแบบไม่ถูกต้อง (ตัวอย่าง วัน/เดือน/ปี , 01/01/25xx)',
  EMAIL: 'รูปแบบของ อีเมล ไม่ถูกต้อง',
  MIN_NUMBER: 'ค่าต้องมากกว่าหรือเท่ากับ ${min}',
  MIN_PRICE: 'ราคาต้องมากกว่า ${moreThan}',
})

export const PAGE_SIZE_DEFAULT = Object.freeze(10);
export const ROW_PER_PAGE = Object.freeze([10, 25, 50, 100]);

export const PAGE_EDIT = Object.freeze('edit');
export const PAGE_MODIFY = Object.freeze('modify');
export const PAGE_ADD = Object.freeze('add');
export const PAGE_INQUIRY = Object.freeze('inquiry');

export const DAILOG_KEY = Object.freeze({
  add: 'add',
  modify: 'modify',
  inquiry: 'inquiry',
  delete: 'delete',
  alert: 'alert',
  upload: 'upload',
  uploadUnSuccess: 'uploadUnSuccess',
  success: 'success',
  unSuccess: 'unSuccess',
  fileSizeInvalid: 'fileSizeInvalid',
  fileInvalid: 'fileInvalid',
  submit: 'submit',
});

export const DAILOG_TITLE = Object.freeze({
  add: 'ยืนยันการเพิ่มข้อมูล',
  modify: 'ยืนยันการแก้ไขข้อมูล',
  delete: 'ยืนยันการลบข้อมูล',
  alert: 'แจ้งเตือนจากระบบ',
  upload: 'ยืนยันการอัพโหลดข้อมูล',
  uploadUnSuccess: 'ไฟล์ข้อมูลผิดผลาด',
  success: 'บันทึกข้อมูลเรียบร้อยแล้ว',
  unSuccess: 'บันทึกข้อมูลไม่สำเร็จแล้ว',
  fileSizeInvalid: 'ไฟล์ขนาดต้องไม่เกิน 5 MB',
  fileInvalid: 'ชนิดไฟล์ไม่ถูกต้อง',
  seriveUnSuccess: 'เกิดข้อผิดพลาด กรุณาติดต่อผู้ดูแลระบบ',
  submit: 'ยืนยันการส่งคำขอ',
});

export const DAILOG_MESSAGE = Object.freeze({
  add: 'ท่านต้องการเพิ่มข้อมูลหรือไม่ ?',
  modify: 'ท่านต้องการแก้ไขข้อมูลหรือไม่ ?',
  delete: 'ท่านต้องการลบข้อมูลหรือไม่ ?',
  success: 'บันทึกข้อมูลเรียบร้อยแล้ว',
  unSuccess: 'บันทึกข้อมูลไม่สำเร็จแล้ว',
  submit: 'ท่านต้องการส่งคำขอหรือไม่ ?',
  upload: 'ทำการอัปโหลดข้อมูลเรียบร้อย',
});

export type DIALOG_MODE = 'add' | 'modify' | 'inquiry' | 'upload' | 'export';

export const DIALOG_MODE_KEY = Object.freeze({
  ADD: 'add',
  MODIFY: 'modify',
  INQUIRY: 'inquiry',
  UPLOAD: 'upload',
  EXPORT: 'export'
});

export const DIALOG_MODE_TITLE = Object.freeze({
  add: 'เพิ่มข้อมูล',
  modify: 'แก้ไขข้อมูล',
  edit: 'แก้ไขข้อมูล',
  inquiry: 'เรียกดูข้อมูล',
  upload: 'อัพโหลดข้อมูล',
  export: 'นำข้อมูลออก'
});

export const TICKET_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE',
  FULL: 'FULL'
});

export const CUSTOMER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});

export const EVENT_STATUS = Object.freeze({
  PAST: 'PAST',
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  CLOSE: 'CLOSE',
  INACTIVE: 'INACTIVE'
});

export const USER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});

export const ADMIN_USER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});

export const PROVINCE_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});

export const DEFAULT_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});

export const CONTENT_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
});


export const CUSTOMER_USER_DUPLICATE = Object.freeze('CUSTOMER_USER_DUPLICATE');
export const CUSTOMER_USER_EMAIL_DUPLICATE = Object.freeze('CUSTOMER_USER_EMAIL_DUPLICATE');

export const ALREADY_REGISTERED_EMAIL = Object.freeze('ALREADY_REGISTERED_EMAIL');
export const ADMIN_USER_DUPLICATE = Object.freeze('ADMIN_USER_DUPLICATE');

export const WORKFLOW_STATUS = Object.freeze({
  USER_UPLOAD_FILE: 'USER_UPLOAD_FILE',
  PENDING_ACCOUNT_APPROVE: 'PENDING_ACCOUNT_APPROVE',
  ACCOUNT_APPROVED: 'ACCOUNT_APPROVED',
  ACCOUNT_REJECTED: 'ACCOUNT_REJECTED'
});

export const WORKFLOW_UPDATE_STATUS = Object.freeze({
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
});

export const DATA_TYPE_ALIGNMENT = Object.freeze({
  INFO: 'INFO',
  FOOTER: 'FOOTER',
  OTHER: 'OTHER',
  LIST: 'LIST'
});

export const CLIENT_ADDRESS_TYPE = Object.freeze({
  CLIENT_ADDRESS: 'CLIENT_ADDRESS',
  SHIPPING_CLIENT_ADDRESS: 'SHIPPING_CLIENT_ADDRESS'
});

export const ADDRESS_TYPE = Object.freeze({
  SHIPPING_CLIENT: 'SHIPPING_CLIENT',
  CLIENT_ADDRESS: 'CLIENT_ADDRESS'
});

export const TEMPLATE_TYPE: any = Object.freeze({
  ERP: 'ERP',
  CUSTOM: 'CUSTOM',
});

export const DOCUMENT_TYPE: any = Object.freeze({
  TIV: 'TIV',
  DCN: 'DCN',
});

export const STEP_CODE = Object.freeze({
  REGISTER_CODE: 'STEP01',
  RUNNER_CODE: 'STEP02',
  SHIPPING_CODE: 'STEP03',
  PAYMENT_CODE: 'STEP90',
  MERCHANDISE_CODE: 'STEP50',
  HOTEL_CODE: 'STEP70'
});

export const HTML_KEY = Object.freeze({
  FNAME: 'FNAME',
  LNAME: 'LNAME',
  BIRTH: 'BIRTH',
  TEL: 'TEL',
  GENDER: 'GENDER',
  TICKET_CODE: 'TICKET_CODE',
  EMAIL: 'EMAIL',
  SHIRT: 'SHIRT',
  FOOD: 'FOOD',
  VACCINE_COVID: 'VACCINE_COVID',
  EM_CONTACT: 'EM_CONTACT',
  EM_TEL: 'EM_TEL',
  SICK: 'SICK',
  TICKET_NAME_TH: 'TICKET_NAME_TH',
  TICKET_NAME_EN: 'TICKET_NAME_EN',
  TICKET_PRICE: 'TICKET_PRICE',
  AGE_GROUP: 'AGE_GROUP',
  PRICE_CODE: 'PRICE_CODE',
  FILE_NAME: 'FILE_NAME',
  DISCOUNT: 'DISCOUNT',
  NATIONALITY: 'NATIONALITY',
  PROVINCE: 'PROVINCE',
  COUPON_CODE: 'COUPON_CODE',
  DISCOUNT_STATUS: 'DISCOUNT_STATUS',
  DISCOUNT_AMOUNT: 'DISCOUNT_AMOUNT',
  AMOUNT: 'AMOUNT',
  TOTAL_AMOUNT: 'TOTAL_AMOUNT',
  FILE_URL: 'FILE_URL',
  ID_CARD: 'ID_CARD',
  PROMOTION_DISCOUNT: 'PROMOTION_DISCOUNT',
  PROMOTION: 'PROMOTION'
});

export const AGE_GROUP_NOT_FOUND = Object.freeze({
  EN: 'Not found age group',
  TH: 'ไม่พบรุ่นอายุ'
});

export const SPECIAL_INPUT_TYPE = Object.freeze({
  FROM_INPUT: 'FROM_INPUT',
  TICKET_INPUT: 'TICKET_INPUT',
  MERCHANDISE_INPUT: 'MERCHANDISE_INPUT',
  HOTEL_INPUT: 'HOTEL_INPUT'
});

export const PAYMENT_METHOD = Object.freeze({
  Q: 'Q',
  C: 'C',
  D: 'D',
  KC: 'KC'
});

export const EVENT_TYPE = Object.freeze({
  VIRTUAL_RUN: 'VIRTUAL_RUN',
});

export const E_BIB_SCALE = Object.freeze({
  W: 1441,
  H: 960
});

export const PROMOTION_TYPE = Object.freeze({
  PRO_AGE_GROUP: 'PRO_AGE_GROUP',
  PRO_PRIVILEGE_RUNNER: 'PRO_PRIVILEGE_RUNNER',
  PRO_DISCOUNT: 'PRO_DISCOUNT',
  PRO_REGISTER_AMOUNT: 'PRO_REGISTER_AMOUNT'
});

