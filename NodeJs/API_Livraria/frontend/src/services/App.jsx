import { useEffect, useState } from "react";
import { livrosService } from "./services/livrosService";
import { Link } from "react-router-dom";

export default function App() {
  const [livros, setLivros] = useState([]);

  const carregarLivros = async () => {
    const resposta = await livrosService.listar();
    setLivros(resposta);
  };

  useEffect(() => {
    carregarLivros();
  }, []);

  return (
    <div>
      <h1>Lista de Livros</h1>
      <ul>
        {livros.map((livro) => (
          <li key={livro.id}>
            <Link to={`/livro/${livro.id}`}>
              {livro.titulo} - {livro.autor}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}