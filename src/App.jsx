import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pokemones, setPokemones] = useState([]);

  useEffect(() => {
    // 1. Traer los primeros 10 Pokémon (solo nombres y URLs)
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then(res => res.json())
      .then(async data => {
        // 2. Para cada Pokémon, pedimos su info detallada
        const detalles = await Promise.all(
          data.results.map(p =>
            fetch(p.url).then(res => res.json())
          )
        );
        setPokemones(detalles); // 3. Guardamos todos los datos en el estado
      })
      .catch(err => console.error('Error al obtener Pokémon:', err));
  }, []);

  return (
    <div className="app-container">
      <h1>Pokémon desde la API</h1>
      <div className="cards-container">
        {pokemones.map(pokemon => (
          <div className={`card ${getTypeColor(pokemon.types[0].type.name)}`}>

            <h2 className="card-title">{pokemon.name}</h2>
            <img
              className="card-image"
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <div className="card-info">
              <p><strong>Altura:</strong> {pokemon.height}</p>
              <p><strong>Peso:</strong> {pokemon.weight}</p>
              <p>
                <strong>Tipos:</strong>{' '}
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
