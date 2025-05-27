import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemones, setPokemones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5; // cantidad por página

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50') // cargamos 50 en total
      .then(res => res.json())
      .then(async data => {
        const detalles = await Promise.all(
          data.results.map(p => fetch(p.url).then(res => res.json()))
        );
        setPokemones(detalles);
      })
      .catch(err => console.error('Error al obtener Pokémon:', err));
  }, []);

  // paginación
  const totalPages = Math.ceil(pokemones.length / perPage);
  const indexStart = (currentPage - 1) * perPage;
  const indexEnd = indexStart + perPage;
  const pokemonesPagina = pokemones.slice(indexStart, indexEnd);

  const handlePageChange = (nueva) => {
    if (nueva >= 1 && nueva <= totalPages) setCurrentPage(nueva);
  };

  return (
    <div className="app-container">
      <h1>Pokémon desde la API</h1>
      <div className="cards-container">
        {pokemonesPagina.map(pokemon => (
          <div key={pokemon.id} className={`card ${getTypeColor(pokemon.types[0].type.name)}`}>
            <h2 className="card-title">{pokemon.name}</h2>
            <img className="card-image" src={pokemon.sprites.front_default} alt={pokemon.name} />
            <div className="card-info">
              <p><strong>Altura:</strong> {pokemon.height}</p>
              <p><strong>Peso:</strong> {pokemon.weight}</p>
              <p><strong>Tipos:</strong>{' '}
                {pokemon.types.map(({ type }) => (
                  <span key={type.name} className={`type-badge ${getTypeColor(type.name)}`}>
                    {type.name}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ◀
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          ▶
        </button>
      </div>
    </div>
  );
}



export default App;

// colores por tipos

function getTypeColor(type) {
  const colors = {
    fire: 'bg-fire',
    water: 'bg-water',
    grass: 'bg-grass',
    electric: 'bg-electric',
    psychic: 'bg-psychic',
    rock: 'bg-rock',
    ground: 'bg-ground',
    bug: 'bg-bug',
    ghost: 'bg-ghost',
    dragon: 'bg-dragon',
    ice: 'bg-ice',
    fighting: 'bg-fighting',
    normal: 'bg-normal',
    poison: 'bg-poison',
    fairy: 'bg-fairy',
    dark: 'bg-dark',
    steel: 'bg-steel',
    flying: 'bg-flying'
  };

  return colors[type] || 'bg-default';
}
