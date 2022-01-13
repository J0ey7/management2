export interface Dictionary {
    dictCode: string;
    id: string;
    itemCode: string
    itemName: string
    pitemCode: string
    serialNumber: number
    children?: Array<Dictionary>
}