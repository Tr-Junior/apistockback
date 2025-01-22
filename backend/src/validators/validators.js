function ValidationContract() {
    // Agora a propriedade 'errors' é parte da instância
    this.errors = [];
}

/**
 * Valida se um valor é obrigatório.
 */
ValidationContract.prototype.isRequired = function(value, message) {
    if (!value || value.length <= 0) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o comprimento do valor é maior ou igual a um mínimo.
 */
ValidationContract.prototype.hasMinLen = function(value, min, message) {
    if (!value || value.length < min) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o comprimento do valor é menor ou igual a um máximo.
 */
ValidationContract.prototype.hasMaxLen = function(value, max, message) {
    if (!value || value.length > max) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o comprimento do valor é fixo.
 */
ValidationContract.prototype.isFixedLen = function(value, len, message) {
    if (value.length != len) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o valor é um email válido.
 */
ValidationContract.prototype.isEmail = function(value, message) {
    const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value)) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o valor é um número.
 */
ValidationContract.prototype.isNumber = function(value, message) {
    if (isNaN(value)) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o valor é um array.
 */
ValidationContract.prototype.isArray = function(value, message) {
    if (!Array.isArray(value)) {
        this.errors.push({ message: message });
    }
};

/**
 * Valida se o valor numérico é maior que um número mínimo.
 */
ValidationContract.prototype.isGreaterThan = function(value, min, message) {
    if (value <= min) {
        this.errors.push({ message: message });
    }
};

/**
 * Retorna os erros acumulados.
 */
ValidationContract.prototype.errors = function() {
    return this.errors;
};

/**
 * Limpa os erros acumulados.
 */
ValidationContract.prototype.clear = function() {
    this.errors = [];
};

/**
 * Retorna se os dados são válidos (sem erros).
 */
ValidationContract.prototype.isValid = function() {
    return this.errors.length == 0;
};

module.exports = ValidationContract;
