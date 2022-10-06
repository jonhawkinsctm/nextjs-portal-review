
export interface Dog {
    id: string;
    name: string;
    breed: string;
    owner: string;
}

export interface ValidationReport {
    constraint: string;
    message: string;
}

export interface ValidationErrorDto {
    property: string;
    messages: ValidationReport[];
}

export interface ValidationErrors {
    statusCode: 400;
    message: ValidationErrorDto[];
}
