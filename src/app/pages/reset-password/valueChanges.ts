import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    phoneNumber: '',
    password: '',
    confirmPassword: ''
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    phoneNumber: {
        required: 'REQUIRED_PHONE',
        minlength: 'MINLEN_PHONE',
        maxlength : 'MAXLEN_PHONE'
    },
    password : {
        required: 'REQUIRED_PASSWORD',
        minlength: 'MINLEN_PASSWORD',
        mustMatch : 'MUSTMUTCH_PASSWORD'
    },
    confirmPassword : {
        required: 'REQUIRED_PASSWORD',
        minlength: 'MINLEN_PASSWORD',
        mustMatch : 'MUSTMUTCH_PASSWORD'
    }

};

export function onValueChanged(data: any, loginForm: FormGroup) {
    console.log(loginForm);
    if (!loginForm) { return; }
    const form = loginForm;
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
