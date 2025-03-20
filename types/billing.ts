export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
};

export const CreditPack: CreditPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999, //$9.9
  },

  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999, //$39.9
  },

  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999, //$69.9
  },
];

export const getCreditsPack = (id: PackId) =>
  CreditPack.find((p) => p.id === id);
