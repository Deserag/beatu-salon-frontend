import { IResTablePage } from "../work-page"

export interface IOffice {
    id: string
    number: string
    address: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    creatorId: string
}

export interface ICabinet {
    office: IOffice
}

export interface IGetOffice {
cabinet: ICabinet
}

export interface iGetCabinet {

}

export type TResGetOffice = IResTablePage<IOffice>
export type TResGetCabinet = IResTablePage<ICabinet>