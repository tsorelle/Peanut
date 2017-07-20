var Peanut;
(function (Peanut) {
    var KeyValueDTO = (function () {
        function KeyValueDTO() {
        }
        return KeyValueDTO;
    }());
    Peanut.KeyValueDTO = KeyValueDTO;
    var editState = (function () {
        function editState() {
        }
        return editState;
    }());
    editState.unchanged = 0;
    editState.created = 1;
    editState.updated = 2;
    editState.deleted = 3;
    Peanut.editState = editState;
    var HttpRequestVars = (function () {
        function HttpRequestVars() {
            this.requestvars = [];
            var me = this;
            var queryString = window.location.search;
            var params = queryString.slice(queryString.indexOf('?') + 1).split('&');
            for (var i = 0; i < params.length; i++) {
                var parts = params[i].split('=');
                var key = parts[0];
                me.requestvars.push(key);
                me.requestvars[key] = parts[1];
            }
        }
        HttpRequestVars.prototype.getValue = function (key) {
            var me = this;
            var value = me.requestvars[key];
            if (value) {
                return value;
            }
            return null;
        };
        HttpRequestVars.Get = function (key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (!HttpRequestVars.instance) {
                HttpRequestVars.instance = new HttpRequestVars();
            }
            var result = HttpRequestVars.instance.getValue(key);
            return (result === null) ? defaultValue : result;
        };
        return HttpRequestVars;
    }());
    Peanut.HttpRequestVars = HttpRequestVars;
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
                value: 0
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
        return Helper;
    }());
    Peanut.Helper = Helper;
})(Peanut || (Peanut = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlld01vZGVsSGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlZpZXdNb2RlbEhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsSUFBVSxNQUFNLENBd0tmO0FBeEtELFdBQVUsTUFBTTtJQUNaO1FBQUE7UUFHQSxDQUFDO1FBQUQsa0JBQUM7SUFBRCxDQUFDLEFBSEQsSUFHQztJQUhZLGtCQUFXLGNBR3ZCLENBQUE7SUFLRDtRQUFBO1FBS0EsQ0FBQztRQUFELGdCQUFDO0lBQUQsQ0FBQyxBQUxEO0lBQ2tCLG1CQUFTLEdBQVksQ0FBQyxDQUFDO0lBQ3ZCLGlCQUFPLEdBQVksQ0FBQyxDQUFDO0lBQ3JCLGlCQUFPLEdBQVksQ0FBQyxDQUFDO0lBQ3JCLGlCQUFPLEdBQVksQ0FBQyxDQUFDO0lBSjFCLGdCQUFTLFlBS3JCLENBQUE7SUFHRDtRQUlJO1lBRlEsZ0JBQVcsR0FBRyxFQUFFLENBQUM7WUFHckIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRWQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDekMsSUFBSSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakMsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FB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