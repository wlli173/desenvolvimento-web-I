import React, { useState } from 'react';

// Componente Mensagem que recebe uma prop 'nome' e exibe uma saudação
function Mensagem({ nome }) {
  return <h2>Bem-vindo(a), {nome}!</h2>;
}

function App() {
  // Estado para o nome do usuário
  const [nome, setNome] = useState('Willighan');

  // Estado para o contador
  const [contador, setContador] = useState(0);

  // Estado para o texto digitado pelo usuário
  const [texto, setTexto] = useState('');

  // Lista de livros
  const livros = [
    { id: 1, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien' },
    { id: 2, titulo: '1984', autor: 'George Orwell' },
    { id: 3, titulo: 'Dom Quixote', autor: 'Miguel de Cervantes' }
  ];

  // Função para manipular o texto digitado
  const handleChange = (event) => {
    setTexto(event.target.value);
  };

  return (
    <div className="App">
      {/* 2. Mensagem de boas-vindas */}
      <Mensagem nome={nome} />

      {/* 3. Contador */}
      <div>
        <p>Contador: {contador}</p>
        <button onClick={() => setContador(contador + 1)}>Incrementar</button>
        <button onClick={() => setContador(contador - 1)}>Decrementar</button>
      </div>

      {/* 4. Lista de livros */}
      <div>
        <h3>Livros:</h3>
        <ul>
          {livros.map((livro) => (
            <li key={livro.id}>
              {livro.titulo} - {livro.autor}
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Campo de texto para digitação */}
      <div>
        <input
          type="text"
          value={texto}
          onChange={handleChange}
          placeholder="Digite algo"
        />
        <p>Você digitou: {texto}</p>
      </div>
    </div>
  );
}

export default App;