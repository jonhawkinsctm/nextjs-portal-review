import { ValidationErrors, ValidationReport } from "./dogs-api";

export interface FormResponseField<N extends string = string> {
    name: N;
    value?: string;
    errors?: ValidationReport[];
}

export interface FormResponse {
    values: {
        [name: string]: string;
    };
    validationErrors?: {
        [name: string]: ValidationReport[];
    };
}

export function createFormResponse(
    data: Record<string, string>,
    serverResponse?: ValidationErrors
) {
    const response: FormResponse = {
        values: data,
    };

    if (serverResponse?.statusCode === 400) {
        response.validationErrors = formatValidationErrors(serverResponse);
    }

    return response;
}

export function formatValidationErrors(serverResponse: ValidationErrors) {
    const validationErrors: {
        [name: string]: ValidationReport[];
    } = {};

    for (let message of serverResponse.message) {
        validationErrors[message.property] = message.messages;
    }

    return validationErrors;
}
