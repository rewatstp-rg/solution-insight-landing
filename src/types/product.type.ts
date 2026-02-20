import { BaseDataResponse } from "src/api/base/types";

import { BasePaginateRequest } from "./base-paginate";

export type ProductImageModel = {
  id?: number;
  fileId?: number;
  fileUid?: string;
  imageName?: string;
  imageType?: 'THUMBNAIL' | 'NORMAL' | string;
  status?: string;
  createDtm?: string | Date;
  createBy?: string;
  lastUpdateDtm?: string | Date;
  productUid?: string;
};

export type ProductModel = {
  id?: number;
  productUid?: string;
  productName?: string;
  productType?: string;
  productDesc?: string;
  status?: string;
  statusDesc?: string;
  createDtm?: string | Date;
  createBy?: string;
  lastUpdateDtm?: string | Date;
  lastUpdateBy?: string;
  listImage?: ProductImageModel[];

  downloadImageUrl?: string;
  downloadImageThumbnailUrl?: string;
  imageThumbnailName?: string;
};

export type ProductSearchModel = {
  productName?: string;
  status?: string;
} & BasePaginateRequest;

export type ProductModelResponse = {
  data: ProductModel
} & BaseDataResponse;

export type ProductModelListResponse = {
  data: ProductModel[]
} & BaseDataResponse;