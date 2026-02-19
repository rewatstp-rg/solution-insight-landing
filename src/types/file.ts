// ----------------------------------------------------------------------

import { BaseDataResponse } from "src/api/base/types";

import { BasePaginateRequest } from "./base-paginate";

export type IFileFilterValue = string | string[] | Date | null;

export type IFileFilters = {
  name: string;
  type: string[];
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: Date | number | string;
  modifiedAt: Date | number | string;
};

export type IFile = IFileManager | IFolderManager;

export type IFolder = {
  id?: number;
  folderCode?: string;
  eventCode?: string;
  photographerCode?: string;
  folderName?: string;
  totalFile?: number;
  status?: string;
  createDtm?: string | Date;
  createBy?: string;
  lastUpdateDtm?: string | Date;
  lastUpdateBy?: string;
};

export interface UploadFile extends File {
  id: string;
  preview: string;
  status: string; // หรือใช้ enum
  isRemoving?: boolean;
  imageType?: string;
  progress?: number;
  isPaused: boolean;
  name: string;
  size: number;
  type: string;
  lastModifiedDate?: string;
}

export type FileResponse = {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number; // BigDecimal -> number
  filePath: string;
  uploadType: string;
  status: string;
  actionBy: string;
  fileDesc: string;
};

export type FileRequest = {
  uploadType: string;
} & BasePaginateRequest;

export type FileResponseData = {
  data: FileResponse
} & BaseDataResponse;