import { DataProvider, BaseRecord, GetListParams, GetListResponse } from "@refinedev/core";

import { MOCK_SUBJECT } from "@/constants/mock_data";



export const dataProvider : DataProvider = {
    getList : async <TData extends BaseRecord = BaseRecord>({resource}:GetListParams):Promise<GetListResponse<TData>> =>{
        if(resource !== 'subjects'){
            return {data : [] as TData[], total: 0}
        }

        return {
            data: MOCK_SUBJECT as unknown as TData[],
            total: MOCK_SUBJECT.length 
        }
    },

    getOne : async () =>{throw new Error('This function is not present in Mock.')},
    create : async () =>{throw new Error('This function is not present in Mock.')},
    update : async () =>{throw new Error('This function is not present in Mock.')},
    deleteOne : async () =>{throw new Error('This function is not present in Mock.')},

    getApiUrl : () => '',
}