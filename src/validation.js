import { defineRule, configure } from 'vee-validate'
import { required, email, min, max, is, numeric } from '@vee-validate/rules'

const phone = value => /^\+?\d{6,20}$/.test(value) || 'Invalid number.'
const countryCode = value => /^\d{1,3}$/.test(value) || 'Invalid'
const localPhone = value => /^\d{6,20}$/.test(value) || 'Invalid number.'

function name(value) {
  return value.split(' ').length >= 4 || 'يجب ادخال الاسم الرباعي'
}


configure({
  generateMessage: context => {
    if (context.name == 'رقم الهوية') {
      return 'يجب إدخال 10 أرقام للهوية'
    }
    return `ادخل ${context.field}`;
  },
});

defineRule('required', required)
defineRule('name', name)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
defineRule('numeric', numeric)
defineRule('is', is)
defineRule('phone', phone)
defineRule('countryCode', countryCode)
defineRule('localPhone', localPhone)