import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    bankAccountNumber: '',
    IFSCCODE: '',
    ACCOUNTHOLDERNAME: '',
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    bankAccountNumber: {
        required: 'REQUIRED_BANK',
        minlength: 'MINLEN_BANK',
    },
    IFSCCODE: {
        required: 'REQUIRED_IFSC',
        minlength: 'MINLEN_IFSC',
    },
    ACCOUNTHOLDERNAME: {
        required: 'REQUIRED_ACCOUNT_HOLDER_NAME',
        minlength: 'MINLEN_ACCOUNT_HOLDER_NAME',
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
