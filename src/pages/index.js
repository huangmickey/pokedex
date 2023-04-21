import { useGlobalContext } from "@/context/global"

export default function Home() {
  const { g, allPokemonData } = useGlobalContext()
  console.log(allPokemonData);
  return (<main>
    <div className="pokemon-grid">
      {allPokemonData ? (allPokemonData.map((pokemon) => {
        return (
          <div key={pokemon.id} className="pokemon-card">
            <div className="pokemon-card-image">
              <img
                src={pokemon.sprites.other.home.front_shiny}
                alt={pokemon.name}>
              </img>
            </div>
            <div className="pokemon-card-body">
              <h3>{pokemon.name}</h3>
              <p>More Details &nbsp; &rarr;</p>
            </div>
          </div>
        );
      })
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  </main>
  );
}
