/**
 * Validadores para entrada de dados
 */

class Validators {
  /**
   * Valida email
   * @param {string} email
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Valida senha (mínimo 6 caracteres)
   * @param {string} password
   * @returns {boolean}
   */
  static isValidPassword(password) {
    return password && password.length >= 6;
  }

  /**
   * Valida nome (não vazio, máximo 100 caracteres)
   * @param {string} name
   * @returns {boolean}
   */
  static isValidName(name) {
    return name && name.length > 0 && name.length <= 100;
  }

  /**
   * Valida descrição (máximo 500 caracteres)
   * @param {string} description
   * @returns {boolean}
   */
  static isValidDescription(description) {
    return !description || (typeof description === 'string' && description.length <= 500);
  }

  /**
   * Valida contato (telefone, email, etc.)
   * @param {string} contact
   * @returns {boolean}
   */
  static isValidContact(contact) {
    return !contact || (typeof contact === 'string' && contact.length > 0 && contact.length <= 100);
  }

  /**
   * Valida código GRAMAP usando regex
   * @param {string} code
   * @returns {boolean}
   */
  static isValidGramapCode(code) {
    const regex = /^\d{6}\.\d{6}\.[A-Z]{3}\.\d{6}$/;
    return regex.test(code);
  }

  /**
   * Sanitiza entrada (remove caracteres perigosos)
   * @param {string} input
   * @returns {string}
   */
  static sanitize(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>"']/g, '');
  }

  /**
   * Valida tamanho de arquivo
   * @param {number} fileSize - Tamanho em bytes
   * @param {number} maxSize - Tamanho máximo em bytes (padrão 5MB)
   * @returns {boolean}
   */
  static isValidFileSize(fileSize, maxSize = 5242880) {
    return fileSize > 0 && fileSize <= maxSize;
  }

  /**
   * Valida tipo MIME de imagem
   * @param {string} mimeType
   * @returns {boolean}
   */
  static isValidImageMimeType(mimeType) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(mimeType);
  }
}

module.exports = Validators;