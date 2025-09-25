export interface inputConfigTm {
    labelAndPlaceholderVariable: string;
    isLabelLeftSide: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formControl: any;
    type: string;
    formValidateType: string[];
    isDisabled: boolean;
    isDecimal?: boolean;
    isOnlyNumber?:boolean;
    isOnlyIntegerStartWithOne?:boolean;
    maxNumberValue?: number,
    dateDash?:boolean,
}

export interface selectConfigTm {
    labelAndPlaceholderVariable: string;
    isLabelLeftSide: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formControl: any;
    options: { value: string; label: string; }[];
    formValidateType: string[];
    isDisabled: boolean
    mode?: 'default' | 'multiple' | 'tags';
}