var listaOriginal = [];

// Array para armazenar os participantes do sorteio
var participantes = [];

// Função para cadastrar participantes no sorteio
function participarSorteio() {
    var nome = document.getElementById('nome').value;

    // Verifica se o nome é válido (não vazio)
    if (nome.trim() !== '') {
        // Verifica se o nome já foi cadastrado
        if (!participantes.includes(nome)) {
            // Adiciona o nome ao array de participantes
            participantes.push(nome);
            // Exibe uma mensagem de sucesso ao usuário
            document.getElementById('mensagem-erro').textContent = '';
            alert('Você foi adicionado ao sorteio, boa sorte!');
            // Limpa o campo de entrada de texto
            document.getElementById('nome').value = '';
        } else {
            // Exibe uma mensagem de erro se o nome já foi cadastrado
            document.getElementById('mensagem-erro').textContent = 'Esse nome já foi cadastrado. Por favor, insira um nome diferente.';
            return false; // Impede o envio automático do formulário
        }
    } else {
        // Exibe uma mensagem de erro se o nome for vazio
        document.getElementById('mensagem-erro').textContent = 'Por favor, insira um nome válido.';
        return false; // Impede o envio automático do formulário
    }
}

// Função para realizar o sorteio e exibir o resultado
function realizarSorteio() {
    // Verifica se há participantes suficientes para realizar o sorteio
    if (participantes.length > 0) {
        // Salva a lista original antes do primeiro sorteio
        listaOriginal = participantes.slice();

        // Gera um índice aleatório para selecionar um vencedor
        var indiceVencedor = Math.floor(Math.random() * participantes.length);
        // Obtém o nome do vencedor com base no índice gerado
        var vencedor = participantes[indiceVencedor];

        // Remove o nome do vencedor da lista
        participantes.splice(indiceVencedor, 1);

        // Chama a função para exibir o resultado no modal
        exibirResultado(vencedor);
    } else {
        // Exibe uma mensagem de erro se não houver participantes suficientes
        alert('Não há participantes suficientes para realizar o sorteio.');
    }
}

// Função para exibir o resultado do sorteio no modal
function exibirResultado(vencedor) {
    // Define o conteúdo do parágrafo no modal com o nome do vencedor
    document.getElementById('resultado').innerHTML = 'O vencedor é: ' + vencedor;
    // Exibe o modal definindo o estilo de exibição como 'flex'
    document.getElementById('modalResultado').style.display = 'flex';
}

// Função para fechar o modal de resultado
function fecharModal() {
    // Define o estilo de exibição do modal como 'none' para escondê-lo
    document.getElementById('modalResultado').style.display = 'none';
}

// Função para mostrar a lista de concorrentes cadastrados
function mostrarConcorrentes() {
    // Preenche dinamicamente a tabela de concorrentes
    var tabelaConcorrentes = document.getElementById('tabelaConcorrentes');
    tabelaConcorrentes.innerHTML = ''; // Limpa o conteúdo atual da tabela

    // Adiciona cada concorrente à tabela
    for (var i = 0; i < participantes.length; i++) {
        var row = tabelaConcorrentes.insertRow(i);
        var cell = row.insertCell(0);
        cell.innerHTML = participantes[i];
    }

    // Exibe o modal de concorrentes definindo o estilo de exibição como 'flex'
    document.getElementById('modalConcorrentes').style.display = 'flex';
}

// Função para fechar o modal de concorrentes
function fecharModalConcorrentes() {
    // Define o estilo de exibição do modal como 'none' para escondê-lo
    document.getElementById('modalConcorrentes').style.display = 'none';
}

// Função para atualizar a lista de concorrentes na tabela
function atualizarListaConcorrentes() {
    // Preenche dinamicamente a tabela de concorrentes
    var tabelaConcorrentes = document.getElementById('tabelaConcorrentes');
    tabelaConcorrentes.innerHTML = ''; // Limpa o conteúdo atual da tabela

    // Adiciona cada concorrente à tabela
    for (var i = 0; i < participantes.length; i++) {
        var row = tabelaConcorrentes.insertRow(i);
        var cell = row.insertCell(0);
        cell.innerHTML = participantes[i];
    }
}

// Função para salvar a lista no navegador e no dispositivo como um arquivo Excel
function salvarListaLocalmente() {
    // Pedir ao usuário para nomear a lista
    var nomeLista = prompt('Digite um nome para a lista:');

    // Verificar se o nome da lista é válido
    if (!nomeLista) {
        alert('Nome da lista inválido.');
        return;
    }

    // Criar um workbook do Excel
    var workbook = XLSX.utils.book_new();

    // Converter a lista de participantes em uma matriz de nomes
    var data = participantes.map(function (nome) {
        return [nome];
    });

    // Criar uma planilha Excel com a matriz de nomes a partir da linha 2 da coluna A
    var worksheet = XLSX.utils.aoa_to_sheet([['Nomes'], ...participantes.map(function (nome) { return [nome]; })]);


    // Adicionar a planilha ao workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Participantes');

    // Salvar o workbook como um arquivo Excel
    XLSX.writeFile(workbook, nomeLista + '.xlsx');

    // Converter a lista de participantes para uma string JSON
    var listaString = JSON.stringify(participantes);

    // Salvar a lista no localStorage do navegador
    localStorage.setItem('listaConcorrentes_' + nomeLista, listaString);
}
// Função para carregar a lista de concorrentes salva localmente
function carregarListaLocalmente() {
    // Obtém todas as chaves do armazenamento local
    var todasAsChaves = Object.keys(localStorage);

    // Filtra as chaves que começam com 'listaConcorrentes_'
    var chavesListas = todasAsChaves.filter(function (chave) {
        return chave.startsWith('listaConcorrentes_');
    });

    // Verifica se há listas salvas
    if (chavesListas.length === 0) {
        alert('Nenhuma lista de concorrentes salva localmente.');
        return;
    }

    // Pergunta ao usuário qual lista carregar
    var escolhaLista = prompt('Escolha uma lista para carregar:\n' + chavesListas.join('\n'));

    // Verifica se a escolha é válida
    if (!escolhaLista || !localStorage.getItem(escolhaLista)) {
        alert('Escolha inválida.');
        return;
    }

    // Obtém a string JSON armazenada localmente
    var listaString = localStorage.getItem(escolhaLista);

    // Converte a string JSON de volta para um array
    participantes = JSON.parse(listaString);

    // Atualiza a lista de concorrentes na tabela
    atualizarListaConcorrentes();

    // Exibe uma mensagem indicando que a lista foi carregada
    alert('Lista de concorrentes carregada localmente: ' + escolhaLista);
}

// Função para carregar uma lista de concorrentes do dispositivo (Excel)
function carregarListaDoDispositivo() {
    // Solicita ao usuário para selecionar um arquivo local
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';

    // Adiciona um ouvinte de eventos para quando o arquivo é selecionado
    input.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        // Define a função a ser executada após a leitura do arquivo
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);

            // Converte o conteúdo do Excel em um objeto de planilha
            var workbook = XLSX.read(data, { type: 'array' });

            // Obtém a primeira planilha do Excel
            var sheetName = workbook.SheetNames[0];
            var sheet = workbook.Sheets[sheetName];

            // Obtém as células da coluna A, começando da linha 2
            var rowIndex = 2;
            var cellValue;

            while (true) {
                // Obtém o valor da célula na coluna A e na linha especificada
                var cellAddress = 'A' + rowIndex;
                cellValue = sheet[cellAddress] ? sheet[cellAddress].v : undefined;

                // Se a célula estiver vazia, interrompe o loop
                if (!cellValue) {
                    break;
                }

                // Adiciona o valor ao array de participantes
                participantes.push(cellValue.trim());

                // Incrementa o índice da linha
                rowIndex++;
            }

            // Exibe uma mensagem de sucesso ao usuário
            alert('Lista de nomes do Excel (a partir da coluna A, linha 2) adicionada ao sorteio, boa sorte!');
            // Atualiza a lista de concorrentes na tabela
            atualizarListaConcorrentes();
        };

        // Lê o conteúdo do arquivo como um ArrayBuffer
        reader.readAsArrayBuffer(file);
    });

    // Simula o clique no botão de seleção de arquivo
    input.click();
}


// Função para carregar uma lista de concorrentes de um arquivo CSV
function carregarListaCSV() {
    var inputCSV = document.getElementById('inputCSV');
    if (inputCSV.files.length > 0) {
        var file = inputCSV.files[0];
        var reader = new FileReader();

        // Define a função a ser executada após a leitura do arquivo
        reader.onload = function (e) {
            // Obtém o conteúdo do arquivo (assumindo que é um CSV)
            var csvContent = e.target.result;

            // Converte o conteúdo do CSV em um array de linhas
            var linhas = csvContent.split('\n');

            // Processa cada linha a partir da segunda linha (índice 1)
            for (var i = 1; i < linhas.length; i++) {
                // Obtém os valores da coluna A (índice 0) a partir da linha 2 (índice 1)
                var valores = linhas[i].split(',')[0]; // Assume que as colunas estão separadas por vírgula

                // Adiciona os valores ao array de participantes, removendo espaços em branco
                participantes.push(valores.trim());
            }

            // Exibe uma mensagem de sucesso ao usuário
            alert('Lista de nomes do arquivo CSV (a partir da coluna A, linha 2) adicionada ao sorteio, boa sorte!');
            // Limpa o campo de entrada de arquivo
            inputCSV.value = '';
            // Atualiza a lista de concorrentes na tabela
            atualizarListaConcorrentes();
        };

        // Lê o conteúdo do arquivo como texto
        reader.readAsText(file);
    } else {
        // Exibe uma mensagem de erro se nenhum arquivo CSV for carregado
        alert('Por favor, carregue um arquivo CSV.');
    }
}
// Função para recuperar a lista original
function recuperarListaOriginal() {
    participantes = listaOriginal.slice(); // Restaura a lista original
    //alert('Lista original recuperada com sucesso!');
}