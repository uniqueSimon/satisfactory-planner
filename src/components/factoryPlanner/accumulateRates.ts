import { Cluster } from "@/interfaces";

export interface RateBalance {
  rateFromOtherClusters: number;
  product: string;
  rate: number;
}
export const accumulateRates = (savedFactories: Cluster[]): RateBalance[][] => {
  const ratesPerCluster: { product: string; rate: number }[][] = [];

  for (const cluster of savedFactories) {
    const accumulatedRates = new Map<string, number>();

    const accumulate = (product: string, rate: number) => {
      const existing = accumulatedRates.get(product);
      accumulatedRates.set(product, (existing ?? 0) + rate);
    };
    for (const factory of cluster.factories) {
      const nodes = factory.productNodes;
      const leaves = nodes.filter(
        (n) => n.children.length === 0 && !n.subRootPointer
      );
      const root = nodes.find((node) => node.type === "ROOT")!;

      accumulate(root.name, root.rate);
      for (const input of leaves) {
        accumulate(input.name, -input.rate);
      }
    }
    const sortedRates = [...accumulatedRates.entries()].sort(
      (a, b) => a[1] - b[1]
    );
    const ret = sortedRates.map((x) => ({ product: x[0], rate: x[1] }));
    ratesPerCluster.push(ret);
  }

  const rateBalance: RateBalance[][] = [];

  ratesPerCluster.forEach((cluster, i) => {
    const rateBalancePerCluster: RateBalance[] = [];

    for (const productRate of cluster) {
      const rateFromOtherClusters = ratesPerCluster
        .filter((_, j) => j !== i)
        .reduce((acc, cluster) => {
          const otherFactory = cluster.find(
            (x) => x.product === productRate.product
          );
          return otherFactory ? acc + otherFactory.rate : acc;
        }, 0);
      rateBalancePerCluster.push({ ...productRate, rateFromOtherClusters });
    }

    rateBalance.push(rateBalancePerCluster);
  });

  return rateBalance;
};
