export class Extrato {
  #lancamentos = [];

  registrar(tipo, valor) {
    this.#lancamentos.push({ tipo, valor, data: new Date() });
  }

  listar() {
    return [...this.#lancamentos]; // cópia: ninguém altera o original por fora
  }
}