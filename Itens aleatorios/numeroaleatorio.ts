function gerarNumeroAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const numero = gerarNumeroAleatorio(1, 100);
console.log(`O número aleatório gerado foi: ${numero}`);