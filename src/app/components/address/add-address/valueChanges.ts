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
        required: 'REQUIRED_CITY',
        minlength: 'MINLEN_CITY',
    },
    streetName: {
        required: 'REQUIRED_STREETNAME',
        minlength: 'MINLEN_STREETNAME',
    },
    postalCode: {
        required: 'REQUIRED_POSTALCODE',
        minlength: 'MINLEN_POSTALCODE',
        maxlength : 'MAXLEN_POSTALCODE'
    },
    buildingNumber: {
        required: 'REQUIRED_BUILDINGNUMBER',
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
                        formErrors[field] += messages[key];
                    }
                }
            }
        }
    }
    return formErrors;
}
