
export interface AuditDataModel {
    selector: string,
    action: Actions,
    data: DataModel[]
}

export interface DataModel {
    name: string,
    value: string
}

export enum Actions {
    New = 'New',
    Update = 'Update',
    Remove = 'Remove'
}