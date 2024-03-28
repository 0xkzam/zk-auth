import { useState } from "react";
import { CodeText } from "./CodeText";
import { ethers } from "ethers";
import secp256k1 from "secp256k1";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAssetGatingProof } from "~~/services/store/asset-gating-proof";
import { notification } from "~~/utils/scaffold-eth";

// Hardcoded Trusted Third Party(TTP) private key
const THIRD_PARTY_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

type TForm = {
  personEthereumAddress: string;
  quantity: number;
  AssetAddress: string;
};

const getInitialFormState = (aliceDefaultAge: number): TForm => ({
  personEthereumAddress: "",
  quantity: aliceDefaultAge,
  AssetAddress: THIRD_PARTY_PRIVATE_KEY,
});

// This function is called when the TTP 🏛 generates the signature 📜
export const signBirthYear = async (form: TForm) => {
  const { personEthereumAddress, quantity, AssetAddress } = form;
  const claimHash = ethers.utils.solidityKeccak256(["address", "uint16"], [personEthereumAddress, quantity]);

  const privateKey = ethers.utils.arrayify(AssetAddress);
  const sigObj = secp256k1.ecdsaSign(ethers.utils.arrayify(claimHash), privateKey);

  const publicKey = secp256k1.publicKeyCreate(privateKey, false);

  return {
    signedMessage: ethers.utils.hexlify(sigObj.signature),
    signerPublicKey: ethers.utils.hexlify(publicKey),
  };
};

export const BirthDateSignature = ({ aliceDefaultAge }: { aliceDefaultAge: number }) => {
  const [form, setForm] = useState<TForm>(() => getInitialFormState(aliceDefaultAge));
  const ethereumAddress = useAssetGatingProof(state => state.ethereumAddress);
  const setEthereumAddress = useAssetGatingProof(state => state.setEthereumAddress);
  const quantity = useAssetGatingProof(state => state.quantity);
  const setAssetQuantity = useAssetGatingProof(state => state.setAssetQuantity);
  const setSignedBirthYear = useAssetGatingProof(state => state.setSignedBirthYear);
  const setSignerPublicKey = useAssetGatingProof(state => state.setSignerPublicKey);

  const { data, refetch } = useScaffoldContractRead({
    contractName: "BalloonToken",
    functionName: "balanceOf",
    args: [ethereumAddress],
  });

  const handleSubmission = async () => {
    try {
      const { signedMessage, signerPublicKey } = await signBirthYear({
        ...form,
        personEthereumAddress: ethereumAddress,
        quantity,
      });
      setSignedBirthYear(signedMessage);
      setSignerPublicKey(signerPublicKey);
      notification.success("Successfully signed asset holdings");
    } catch (e) {
      notification.error("Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 1</h1>
        <h1 className="text-3xl font-bold">Sign your Asset Holdings</h1>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-300">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your Ethereum address</span>
              </label>
              <AddressInput
                value={ethereumAddress}
                name="personEthereumAddress"
                placeholder="Ethereum address"
                onChange={(value: string) => setEthereumAddress(value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your Asset Quantity</span>
              </label>
              <input
                // type="number"
                placeholder="Asset Quantity"
                className="input input-bordered"
                value={Math.floor(Number(data) / 10 ** 18)?.toString()}
                onChange={e => {
                  setAssetQuantity(Math.floor(Number(data) / 10 ** 18)?.toString() || "");
                }}
              />
            </div>
            {/* <div className="form-control">
              <label className="label">
                <span className="label-text">Asset Collection &apos;s 🏛 address signing</span>
              </label>
              <input
                type="text"
                placeholder="Super secret key"
                value={form.AssetAddress}
                className="input input-bordered"
                onChange={e => setForm({ ...form, AssetAddress: e.target.value })}
              />
            </div> */}
            <div className="form-control">
              <button className="btn btn-primary mt-6" onClick={handleSubmission}>
                Sign Asset Holding 📜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
