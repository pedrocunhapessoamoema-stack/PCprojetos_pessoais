const nomes = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo"];

function sortearNome(lista: string[]): string {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
}

const nomeSorteado = sortearNome(nomes);
console.log(`O nome sorteado foi: ${nomeSorteado}`);