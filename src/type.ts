export type ItemListProps = {
  keyItem: string;
  font: any;
  onNavigateToItem: ((key: string) => void) | any;
};

export type DataWatch = {
  openPrice: number;
  price3: number;
  price2: number;
  price1: number;
  kl3: number;
  kl2: number;
  kl1: number;
};
