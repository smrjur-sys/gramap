/**
 * Gerador de Códigos GRAMAP
 * 
 * Formato: XXXXXX.YYYYYY.ZZZ.NNNNN
 * - XXXXXX: Posição Leste-Oeste (0 a 999.999)
 * - YYYYYY: Multiplicador/Fator (0 a 999.999)
 * - ZZZ: Sequência alfabética (AAA a ZZZ)
 * - NNNNN: ID numérico da letra (000.001 a 999.999)
 */

class GramapGenerator {
  /**
   * Gera o primeiro código GRAMAP
   * @returns {string} Primeiro código GRAMAP
   */
  static generateFirstCode() {
    return '000001.000001.AAA.000001';
  }

  /**
   * Gera o próximo código GRAMAP válido
   * @param {string} previousCode - Código anterior
   * @returns {string} Novo código GRAMAP
   * @throws {Error} Se limite máximo foi atingido
   */
  static generateNextCode(previousCode) {
    if (!this.isValidCode(previousCode)) {
      throw new Error('Código GRAMAP anterior é inválido!');
    }

    const parts = previousCode.split('.');
    let x = parseInt(parts[0]);
    let multiplier = parseInt(parts[1]);
    let letters = parts[2];
    let numId = parseInt(parts[3]);

    // Incrementar ID numérico
    numId++;
    if (numId > 999999) {
      numId = 1;
      letters = this.nextLetterSequence(letters);
    }

    // Se letras voltaram ao início (AAA)
    if (letters === 'AAA' && numId === 1) {
      multiplier++;
      if (multiplier > 999999) {
        multiplier = 1;
        x++;
        if (x > 999999) {
          throw new Error('Limite máximo de códigos GRAMAP atingido!');
        }
      }
    }

    return `${String(x).padStart(6, '0')}.${String(multiplier).padStart(6, '0')}.${letters}.${String(numId).padStart(6, '0')}`;
  }

  /**
   * Calcula a próxima sequência de letras
   * Progressão: AAA → AAB → AAZ → ABA → ABB → ... → ZZZ → AAA (reinicia)
   * @param {string} current - Sequência atual
   * @returns {string} Próxima sequência
   */
  static nextLetterSequence(current) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let arr = current.split('');

    // Incrementar da direita para esquerda (como contador binário)
    for (let i = arr.length - 1; i >= 0; i--) {
      let idx = alphabet.indexOf(arr[i]);
      if (idx < 25) {
        arr[i] = alphabet[idx + 1];
        return arr.join('');
      } else {
        arr[i] = 'A';
      }
    }

    // Se chegou aqui, todas as letras foram Z, volta para AAA
    return 'AAA';
  }

  /**
   * Valida se um código GRAMAP é válido
   * Formato: XXXXXX.YYYYYY.ZZZ.NNNNN
   * @param {string} code - Código a validar
   * @returns {boolean} True se válido, false caso contrário
   */
  static isValidCode(code) {
    if (typeof code !== 'string') return false;
    const regex = /^\d{6}\.\d{6}\.[A-Z]{3}\.\d{6}$/;
    return regex.test(code);
  }

  /**
   * Decodifica um código GRAMAP em seus componentes
   * @param {string} code - Código a decodificar
   * @returns {object} Objeto com componentes do código
   * @throws {Error} Se código é inválido
   */
  static decodeCode(code) {
    if (!this.isValidCode(code)) {
      throw new Error('Código GRAMAP inválido!');
    }

    const parts = code.split('.');
    return {
      x: parseInt(parts[0]),           // Posição Leste-Oeste
      multiplier: parseInt(parts[1]),  // Multiplicador
      letters: parts[2],               // Sequência alfabética
      numId: parseInt(parts[3])        // ID numérico
    };
  }

  /**
   * Calcula coordenadas visuais do código no mapa
   * @param {string} code - Código GRAMAP
   * @returns {object} Objeto com x, y em pixels (aproximado)
   */
  static getCoordinates(code) {
    const decoded = this.decodeCode(code);
    const cellSize = 100; // pixels por célula
    
    // X: baseado na posição Leste-Oeste
    const x = decoded.x * cellSize;
    
    // Y: baseado no multiplicador e sequência alfabética
    // Cada multiplicador representa múltiplas linhas
    const lineMultiplier = decoded.multiplier * 1000;
    const lineFromLetters = this.getLineFromLetters(decoded.letters);
    const y = (lineMultiplier + lineFromLetters) * cellSize;
    
    return { x, y };
  }

  /**
   * Calcula número da linha baseado nas letras (0-17577)
   * @param {string} letters - Sequência de 3 letras
   * @returns {number} Número da linha
   */
  static getLineFromLetters(letters) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let value = 0;
    
    for (let i = 0; i < 3; i++) {
      const charIdx = alphabet.indexOf(letters[i]);
      value = value * 26 + charIdx;
    }
    
    return value;
  }

  /**
   * Gera um código GRAMAP aleatório (para testes)
   * @returns {string} Código GRAMAP aleatório válido
   */
  static generateRandomCode() {
    const x = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const multiplier = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let letters = '';
    for (let i = 0; i < 3; i++) {
      letters += alphabet[Math.floor(Math.random() * 26)];
    }
    const numId = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
    
    return `${x}.${multiplier}.${letters}.${numId}`;
  }
}

module.exports = GramapGenerator;