/**
 * Created by Terry on 4/28/2017.
 */
///<reference path='../../typings/jquery/jquery.d.ts' />
/// <reference path='../core/peanut.d.ts' />

namespace Peanut {

    /**
     * Constants for entity editState
     */
    export class editState {
        public static unchanged : number = 0;
        public static created : number = 1;
        public static updated : number = 2;
        public static deleted : number = 3;
    }


    export class Helper {
        /*
         * Utility routines
         */

        public static getRequestParam(name){
            if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
                return decodeURIComponent(name[1]);
            return null;
        }

        public static ValidateEmail(email: string) {
            if (!email || email.trim() == '') {
                return false;
            }
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        }

        public static ValidateCredential(value, minlength = 10, requireLower = false)  {
            if (value.length < minlength) {
                return false;
            }
            if (value.replace(' ','') !== value) {
                return false;
            }
            if (requireLower) {
                return (value.toLowerCase() === value);
            }
            return true;
        };

        public static validatePositiveWholeNumber(text: string,maxValue = null, emptyOk: boolean = true) {
            return Helper.validateWholeNumber(text,maxValue,0,emptyOk);
        }

        public static validateWholeNumber(numberText: string, maxValue = null, minValue = null, emptyOk: boolean = true) {
            if (numberText == null) {
                numberText = '';
            }

            numberText = numberText + ' '; // convert to string to ensure .trim() works.
            let result = {
                errorMessage: '',
                text: numberText.trim(),
                value: 0,
            };

            let parts = result.text.split('.');
            if (parts.length > 1) {
                let fraction = parseInt(parts[1].trim());
                if (fraction != 0) {
                    result.errorMessage = 'Must be a whole number.';
                    return result;
                }
                else {
                    result.text = parts[0].trim();
                }
            }

            if (result.text == '') {
                if (!emptyOk) {
                    result.errorMessage = 'A number is required.'
                }
                return result;
            }

            result.value = parseInt(result.text);
            if (isNaN(result.value)) {
                result.errorMessage = 'Must be a valid whole number.';
            }
            else {
                if (minValue != null && result.value < minValue) {
                    if (minValue == 0) {
                        result.errorMessage = 'Must be a positive number';
                    }
                    else {
                        result.errorMessage =  'Must be greater than ' + minValue;
                    }
                }
                if (maxValue != null && result.value > maxValue) {
                    if (result.errorMessage) {
                        result.errorMessage += ' and less than ' + maxValue;
                    }
                    else {
                        result.errorMessage =  'Must be less than ' + maxValue;
                    }
                }
            }
            return result;
        }

        public static validateCurrency(value:any): any {
            if (!value) {
                return false;
            }
            if (typeof value == 'string') {
                value = value.replace(/\s+/g, '');
                value = value.replace(',', '');
                value = value.replace('$', '');
            }
            else {
                value = value.toString();
            }
            if (!value) {
                return false;
            }
            let parts = value.split('.');
            if (parts.length > 2) {
                return false;
            }
            if (!jQuery.isNumeric(parts[0])) {
                return false;
            }
            if (parts.length == 1) {
                return parts[0] + '.00';
            }

            if (!jQuery.isNumeric(parts[1])) {
                return false;
            }

            let result = Number(parts[0] + '.' + parts[1].substring(0, 2));
            if (isNaN(result)) {
                return false;
            }
        };

        public static getSelectedFiles(elementId: string) {
            let element = <any>jQuery(elementId);
            if (element && element.length && element[0].files) {
                return element[0].files;
            }
            return null;
        }

        public static getHostUrl() {
            let protocol = location.protocol;
            let slashes = protocol.concat("//");
            let host = slashes.concat(window.location.hostname);
            return host;
        }

    }

}  // end namespace
