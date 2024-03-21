import { create } from "zustand";
import { HexString } from "~~/hooks/noir/useProofGenerator";

type AssetGatingProof = {
  ethereumAddress: string;
  quantity: number;
  signedBirthYear: string;
  signerPublicKey: string;
  proof: HexString;
  setEthereumAddress: (input: string) => void;
  setAssetQuantity: (input: string) => void;
  setSignedBirthYear: (input: string) => void;
  setSignerPublicKey: (input: string) => void;
  setProof: (input: HexString) => void;
};

export const useAssetGatingProof = create<AssetGatingProof>(set => ({
  ethereumAddress: "",
  quantity: 1,
  signedBirthYear: "",
  signerPublicKey: "",
  proof: "0x",
  setEthereumAddress: (input: string) => set({ ethereumAddress: input }),
  setAssetQuantity: (input: string) => set({ quantity: Number(input) }),
  setSignedBirthYear: (input: string) => set({ signedBirthYear: input }),
  setSignerPublicKey: (input: string) => set({ signerPublicKey: input }),
  setProof: (input: HexString) => set({ proof: input }),
}));
