var Peanut;
(function (Peanut) {
    var editState = (function () {
        function editState() {
        }
        editState.unchanged = 0;
        editState.created = 1;
        editState.updated = 2;
        editState.deleted = 3;
        return editState;
    }());
    Peanut.editState = editState;
    var Helper = (function () {
        function Helper() {
        }
        Helper.getRequestParam = function (name) {
            if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
                return decodeURIComponent(name[1]);
            return null;
        };
        Helper.ValidateEmail = function (email) {
            if (!email || email.trim() == '') {
                return false;
            }
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        };
        Helper.ValidateCredential = function (value, minlength, requireLower) {
            if (minlength === void 0) { minlength = 10; }
            if (requireLower === void 0) { requireLower = false; }
            if (value.length < minlength) {
                return false;
            }
            if (value.replace(' ', '') !== value) {
                return false;
            }
            if (requireLower) {
                return (value.toLowerCase() === value);
            }
            return true;
        };
        ;
        Helper.validatePositiveWholeNumber = function (text, maxValue, emptyOk) {
            if (maxValue === void 0) { maxValue = null; }
            if (emptyOk === void 0) { emptyOk = true; }
            return Helper.validateWholeNumber(text, maxValue, 0, emptyOk);
        };
        Helper.validateWholeNumber = function (numberText, maxValue, minValue, emptyOk) {
            if (maxValue === void 0) { maxValue = null; }
            if (minValue === void 0) { minValue = null; }
            if (emptyOk === void 0) { emptyOk = true; }
            if (numberText == null) {
                numberText = '';
            }
            numberText = numberText + ' ';
            var result = {
                errorMessage: '',
                text: numberText.trim(),
                value: 0,
            };
            var parts = result.text.split('.');
            if (parts.length > 1) {
                var fraction = parseInt(parts[1].trim());
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
                    result.errorMessage = 'A number is required.';
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
                        result.errorMessage = 'Must be greater than ' + minValue;
                    }
                }
                if (maxValue != null && result.value > maxValue) {
                    if (result.errorMessage) {
                        result.errorMessage += ' and less than ' + maxValue;
                    }
                    else {
                        result.errorMessage = 'Must be less than ' + maxValue;
                    }
                }
            }
            return result;
        };
        Helper.validateCurrency = function (value) {
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
            var parts = value.split('.');
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
            var result = Number(parts[0] + '.' + parts[1].substring(0, 2));
            if (isNaN(result)) {
                return false;
            }
        };
        ;
        Helper.getSelectedFiles = function (elementId) {
            var element = jQuery(elementId);
            if (element && element.length && element[0].files) {
                return element[0].files;
            }
            return null;
        };
        Helper.getHostUrl = function () {
            var protocol = location.protocol;
            var slashes = protocol.concat("//");
            var host = slashes.concat(window.location.hostname);
            return host;
        };
        return Helper;
    }());
    Peanut.Helper = Helper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=ViewModelHelpers.js.map