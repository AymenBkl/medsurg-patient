import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    city: '',
    streetName: '',
    postalCode: '',
    buildingNumber: '',
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    city: {
        required: 'City is required.',
        minlength: 'City must be at least 4 characters long.',
    },
    streetName: {
        required: 'StreetName is required.',
        minlength: 'StreetName must be at least 4 characters long.',
    },
    postalCode: {
        required: 'PostalCode is required.',
        minlength: 'PostalCode must be at least 4 characters long.',
        maxlength : 'PostalCode must be at most 6 characters long.'
    },
    buildingNumber: {
        required: 'BuildingNumber is required.',
    },

};

export function onValueChanged(data: any, registerForm: FormGroup) {
    console.log(registerForm);
    if (!registerForm) { return; }
    const form = registerForm;
    for (const field in formErrors) {
        if (formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = validationMessages[field];
                for (const key in control.errors) {
                    if (control.errors.hasOwnProperty(key)) {
                        formErrors[field] += messages[key] + ' ';
                    }
                }
            }
        }
    }
    return formErrors;
}
