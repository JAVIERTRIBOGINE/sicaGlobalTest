export interface Payments {
    id: number,
    nif: string,
    docNumber: number,
    amount: number,
    paymentCode: string,
    state: string
}

export interface Collections {
    id: number,
    nif: string,
    concept: string,
    amount: number,
    collectionCode: string
}