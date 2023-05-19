export const emailRegex = new RegExp(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)

export const emailPattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)

export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export const creditCardPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9][0-9])[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;


export const nomePattern = /^[a-zA-Z][a-zA-Z\s]*$/ //new RegExp(/[^a-zA-Z\u00C0-\u017F\s]/g)

export const justNumberPattern = /^\d+$/ 

export const cpfRegex = new RegExp(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)

export const nameReplace = (string: string) => {
  return string.trim() ? string.replace(/[^a-zA-Z\u00C0-\u017F\s]/g, "") : ''
}