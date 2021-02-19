import { FormGroup } from '@angular/forms';

// tslint:disable-next-line: prefer-const
let formErrors = {
    firstname: '',
    lastname: '',
};

// tslint:disable-next-line: prefer-const
let validationMessages = {
    firstname: {
        required: 'REQUIRED_FIRSTNAME',
        minlength: 'MINLEN_FIRSTNAME',
        maxlength : 'MAXLEN_FIRSTNAME'
    },
    lastname: {
        required: 'REQUIRED_LASTNAME',
        minlength: 'MINLEN_LASTNAME',
        maxlength : 'MAXLEN_LASTNAME'
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
