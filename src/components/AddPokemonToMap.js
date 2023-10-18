const updatePokeData = (cell, pokemon, pokemonData, setPokemonData) => {
  const idx = pokemonData.findIndex(
    (pokeData) =>
      pokeData.q === cell.q && pokeData.r === cell.r && pokeData.s === cell.s
  );
  if (idx !== -1) {
    setPokemonData((prevState) => {
      const newData = [...prevState];
      let newPokemon = new Set([...newData[idx].pokemon]);
      newPokemon.add(pokemon);
      newData[idx] = { ...cell, pokemon: [...newPokemon] };

      return newData;
    });
  } else {
    setPokemonData((prevState) => [
      ...prevState,
      { ...cell, pokemon: [pokemon] },
    ]);
  }
};

export default function AddPokemonToMap({
  pokes,
  selectedPokemon,
  setSelectedPokemon,
  pokemonData,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        overflowY: "scroll",
        maxHeight: "900px",
      }}
    >
      {pokes.map((poke) => {
        return (
          <div
            key={poke.id}
            onClick={() => setSelectedPokemon(poke.id)}
            style={{
              display: "flex",
              flexDirection: "row",
              border: selectedPokemon === poke.id ? "1px solid red" : "",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div>{poke.name}</div>
              <div>
                <img
                  style={{ display: "block" }}
                  alt={poke.name}
                  src={poke.image}
                />
              </div>
            </div>
            <div>
              Locations:{" "}
              {pokemonData
                .filter((entry) => entry.pokemon.includes(poke.id))
                .map((val) => {
                  return (
                    <>
                      <span>
                        ({val.q} {val.r} {val.s}),
                      </span>
                    </>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
