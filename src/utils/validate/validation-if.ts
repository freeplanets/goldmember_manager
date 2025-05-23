import { ValidationError } from "@nestjs/common";

export interface IValidationError {
    /**
     * Object that was validated.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
     */
    target?: object;
    /**
     * Object's property that haven't pass validation.
     */
    property: string;
    /**
     * Value that haven't pass a validation.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
     */
    value?: any;
    /**
     * Constraints that failed validation with error messages.
     */
    constraints?: {
        [type: string]: string;
    };
    /**
     * Contains all nested validation errors of the property.
     */
    children?: ValidationError[];
    contexts?: {
        [type: string]: any;
    };    
}