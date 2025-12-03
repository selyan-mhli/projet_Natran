import { runQuery } from "./db";

const globalForSim = globalThis as typeof globalThis & {
  _natranSimulator?: boolean;
};

if (!globalForSim._natranSimulator) {
  globalForSim._natranSimulator = true;
  startSimulator();
}

function startSimulator() {
  setInterval(() => {
    const tempBase = 870;
    const newTemp = tempBase + (Math.random() - 0.5) * 10;

    const flowBase = 1.2;
    const newFlow = flowBase + (Math.random() - 0.5) * 0.2;

    void runQuery("INSERT INTO reactor (temperature) VALUES (?)", [newTemp]);
    void runQuery("INSERT INTO flow (debit) VALUES (?)", [newFlow]);
  }, 10000);
}
