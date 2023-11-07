import { Button, Flex } from "@chakra-ui/react";

const shopItems = [
  {
    name: "Pokeball",
    price: 100,
  },
  {
    name: "Great Ball",
    price: 200,
  },
  {
    name: "Ultra Ball",
    price: 1000,
  },
];

export default function Shop({ coins, updateCoins, playerItems, updateItems }) {
  return (
    <div>
      <h1>Shop</h1>
      <h2>Coins: {coins}</h2>
      <Flex direction="row" gap={4}>
        {shopItems.map((item, idx) => {
          return (
            <div key={`${item.name}-${idx}`}>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Cost: {item.price}</p>
              <Button
                onClick={() => {
                  if (coins >= item.price) {
                    updateCoins(coins - item.price);
                    const itemIndex = playerItems.findIndex(
                      (i) => i.name === item.name
                    );
                    if (itemIndex !== -1) {
                      const newItems = [...playerItems];
                      newItems[itemIndex].quantity += 1;
                      updateItems(newItems);
                    } else {
                      updateItems([...playerItems, { ...item, quantity: 1 }]);
                    }
                  }
                }}
              >
                Buy
              </Button>
            </div>
          );
        })}
      </Flex>
    </div>
  );
}
