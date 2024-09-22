import { Card } from "./components";

const details = {
  name: "Şeyma",
  cards: [
    { color: "bg-blue-500" },
    { color: "bg-green-500" },
    { color: "bg-red-500" },
    { color: "bg-orange-500" },
  ],
  balance: "100.500,00",
  availableBalance: "120,000,00 USD",
  cardNumber: "TR37 1234 7653 1234",
};

function App() {
  return <Card details={details} />;
}

export default App;
