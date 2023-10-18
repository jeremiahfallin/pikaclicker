import pokes from "../pokes";

const findIndex = (id) => pokes.findIndex((val) => val.id === id);

export default function Party({ party }) {
  return (
    <div>
      <div>Party</div>
      {party.map((pokemon) => {
        const details = findIndex(pokemon.id);
        return (
          <div key={pokemon.id}>
            <img alt={pokes[details].name} src={pokes[details].image} />
          </div>
        );
      })}
    </div>
  );
}
