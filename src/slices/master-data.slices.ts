import { createSlice } from '@reduxjs/toolkit';

import { DIALOG_MODE } from 'src/utils/constants';

import type { RootState } from 'src/store/types';

import { BasePaginateResponse } from 'src/types/base-paginate';
import type { Config, ConfigGroup, MasterDistrictModel, MasterSubDistrictModel, MasterProvinceSearchResponse } from 'src/types/master-config';

export type MasterDataState = {
    searchProvinceResult?: BasePaginateResponse<MasterProvinceSearchResponse>,
    listProvinceStatusOption: Config[],
    provinceDetail: MasterProvinceSearchResponse,
    provinceDetailDialogMode: DIALOG_MODE,
    districtDetail?: MasterDistrictModel,
    districtDetailDialogMode: DIALOG_MODE,
    subDistrictDetail?: MasterSubDistrictModel,
    subDistrictDetailDialogMode: DIALOG_MODE,
    searchDistrictResult?: BasePaginateResponse<MasterDistrictModel>,
    searchConfigGroupResult?: BasePaginateResponse<ConfigGroup>,
    listConfigByGroup?: Config[],
    configGroupDetail?: ConfigGroup,
    configGroupDetailDialogMode: DIALOG_MODE,
    searchSubDistrictResult?: BasePaginateResponse<MasterSubDistrictModel>,
    listProvinceOption: MasterProvinceSearchResponse[],
    listDistrictOption: MasterDistrictModel[],
    listAllListboxGroup: Config[],
    listboxDetail?: Config,
    listboxDetailDialogMode: DIALOG_MODE,

    // New
    listDefaultStatus: Config[],
    listGenderOption: Config[],
    clientListDistrict: MasterDistrictModel[],
    clientListSubDistrict: MasterSubDistrictModel[],
    listUserAdminStatus: Config[],
    listEmailMktTemplateStatus: Config[],
    listEmailTransectionStatus: Config[],
    listEmailTemplateOption: Config[],
}

const initialState: MasterDataState = {
    searchProvinceResult: undefined,
    listProvinceStatusOption: [],
    provinceDetail: {
        id: 0,
        provinceCode: '',
        provinceNameTh: '',
        provinceNameEng: '',
        geoId: '',
        seq: 0,
        status: '',
        statusDesc: '',
        lastUpdateDtm: '',
        lastUpdateBy: ''
    },
    provinceDetailDialogMode: 'add',
    districtDetail: undefined,
    districtDetailDialogMode: 'add',
    searchDistrictResult: undefined,
    searchConfigGroupResult: undefined,
    listConfigByGroup: [],
    configGroupDetail: undefined,
    configGroupDetailDialogMode: 'add',
    subDistrictDetail: undefined,
    subDistrictDetailDialogMode: 'add',
    searchSubDistrictResult: undefined,
    listProvinceOption: [],
    listDistrictOption: [],
    listAllListboxGroup: [],
    listboxDetail: undefined,
    listboxDetailDialogMode: 'add',

    // New
    listDefaultStatus: [],
    listGenderOption: [],
    clientListDistrict: [],
    clientListSubDistrict: [],
    listUserAdminStatus: [],
    listEmailMktTemplateStatus: [],
    listEmailTransectionStatus: [],
    listEmailTemplateOption: []
}

const masterDataSlice = createSlice({
    name: 'MasterData',
    initialState,
    reducers: {
        setSearchProvinceResult: (state, action) => {
            state.searchProvinceResult = action.payload
        },
        setProvinceStatusOption: (state, action) => {
            state.listProvinceStatusOption = action.payload
        },
        setProvinceDetail: (state, action) => {
            state.provinceDetail = action.payload
        },
        setProvinceDetailDialogMode: (state, action) => {
            state.provinceDetailDialogMode = action.payload
        },
        setDistrictDetail: (state, action) => {
            state.districtDetail = action.payload
        },
        setDistrictDetailDialogMode: (state, action) => {
            state.districtDetailDialogMode = action.payload
        },
        setSearchDetailResult: (state, action) => {
            state.searchDistrictResult = action.payload
        },
        setSearchConfigGroupResult: (state, action) => {
            state.searchConfigGroupResult = action.payload
        },
        setListConfigByGroup: (state, action) => {
            state.listConfigByGroup = action.payload
        },
        setConfigGroupDetail: (state, action) => {
            state.configGroupDetail = action.payload
        },
        setConfigGroupDetailDialogMode: (state, action) => {
            state.configGroupDetailDialogMode = action.payload
        },
        setSubDistrictDetail: (state, action) => {
            state.subDistrictDetail = action.payload
        },
        setSubDistrictDetailDialogMode: (state, action) => {
            state.subDistrictDetailDialogMode = action.payload
        },
        searchSubDistrictResult: (state, action) => {
            state.searchSubDistrictResult = action.payload
        },
        setListDistrictOption: (state, action) => {
            state.listDistrictOption = action.payload
        },
        setListAllListboxGroup: (state, action) => {
            state.listAllListboxGroup = action.payload
        },
        setListboxDetail: (state, action) => {
            state.listboxDetail = action.payload
        },
        setListboxDetailDialogMode: (state, action) => {
            state.listboxDetailDialogMode = action.payload
        },
        setListDefaultStatus: (state, action) => {
            state.listDefaultStatus = action.payload
        },
        setListGenderOption: (state, action) => {
            state.listGenderOption = action.payload
        },
        setClientListSubDistrict: (state, action) => {
            state.clientListSubDistrict = action.payload
        },
        setClientListDistrict: (state, action) => {
            state.clientListDistrict = action.payload
        },
        setListUserAdminStatus: (state, action) => {
            state.listUserAdminStatus = action.payload
        },
        setListEmailMktTemplateStatusOtion: (state, action) => {
            state.listEmailMktTemplateStatus = action.payload
        },
        setListEmailTransectionStatusOtion: (state, action) => {
            state.listEmailTransectionStatus = action.payload
        },
        setlistEmailTemplateOtion: (state, action) => {
            state.listEmailTemplateOption = action.payload
        },
        setListProvinceOption : (state, action) => {
            state.listProvinceOption = action.payload
        }
    },
})

export const {
    setSearchProvinceResult,
    setProvinceStatusOption,
    setProvinceDetail,
    setProvinceDetailDialogMode,
    setDistrictDetail,
    setDistrictDetailDialogMode,
    setSearchDetailResult,
    setSearchConfigGroupResult,
    setListConfigByGroup,
    setConfigGroupDetail,
    setConfigGroupDetailDialogMode,
    setSubDistrictDetail,
    setSubDistrictDetailDialogMode,
    searchSubDistrictResult,
    setListDistrictOption,
    setListAllListboxGroup,
    setListboxDetail,
    setListboxDetailDialogMode,
    setListDefaultStatus,
    setListGenderOption,
    setClientListSubDistrict,
    setClientListDistrict,
    setListUserAdminStatus,
    setListEmailMktTemplateStatusOtion,
    setListEmailTransectionStatusOtion,
    setlistEmailTemplateOtion,
    setListProvinceOption
} = masterDataSlice.actions;

export const selectMasterData = (state: RootState) => state.masterData;

export default masterDataSlice.reducer;
