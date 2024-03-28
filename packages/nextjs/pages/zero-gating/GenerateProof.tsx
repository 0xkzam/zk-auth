import { useState } from "react";
import { CodeText } from "./CodeText";
import { ethers } from "ethers";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { ParsedArgs, generateProof } from "~~/hooks/noir/useProofGenerator";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAssetGatingProof } from "~~/services/store/asset-gating-proof";
import { notification } from "~~/utils/scaffold-eth";

type TForm = {
  quantity: number;
  requiredQuantity: number;
  proofOfBirthYearSignedMessage: string;
  proofOfBirthYearPublicKey: string;
  personEthereumAddress: string;
};

const getInitialFormState = ({
  requiredQuantity,
  signedBirthYear,
  signerPublicKey,
}: {
  requiredQuantity: number;
  signedBirthYear: string;
  signerPublicKey: string;
}): TForm => ({
  quantity: requiredQuantity + 1,
  requiredQuantity,
  proofOfBirthYearSignedMessage: signedBirthYear || "",
  proofOfBirthYearPublicKey: signerPublicKey || "",
  personEthereumAddress: "",
});

const buildNoirIntArray = (hexString: string) => {
  const trimmedHexString = hexString.replace("0x", "");
  return trimmedHexString
    .split("")
    .reduce((resultArray: string[], letter: string, index: number) => {
      if (index % 2 === 0) {
        resultArray.push("0x" + letter);
      } else {
        resultArray[resultArray.length - 1] += letter;
      }
      return resultArray;
    }, [])
    .map(hex => ethers.utils.hexZeroPad(hex, 32));
};

export const parseForm = (form: TForm) => {
  const pub_key_array = buildNoirIntArray(form.proofOfBirthYearPublicKey);
  const issuer_public_key_x = pub_key_array.slice(1, Math.round(pub_key_array.length / 2));
  const issuer_public_key_y = pub_key_array.slice(Math.round(pub_key_array.length / 2));
  return {
    required_balance: form.requiredQuantity,
    subject_balance: form.quantity,
    issuer_public_key_x,
    issuer_public_key_y,
    subject_eth_address: buildNoirIntArray(form.personEthereumAddress),
    issuer_signed_message: buildNoirIntArray(form.proofOfBirthYearSignedMessage),
  };
};

export const GenerateProof = ({ requiredQuantity }: { requiredQuantity: number }) => {
  const ethereumAddress = useAssetGatingProof(state => state.ethereumAddress);
  const setEthereumAddress = useAssetGatingProof(state => state.setEthereumAddress);
  const quantity = useAssetGatingProof(state => state.quantity);
  const setAssetQuantity = useAssetGatingProof(state => state.setAssetQuantity);
  const setProof = useAssetGatingProof(state => state.setProof);
  const signedBirthYear = useAssetGatingProof(state => state.signedBirthYear);
  const signerPublicKey = useAssetGatingProof(state => state.signerPublicKey);
  const [form, setForm] = useState<TForm>(() =>
    getInitialFormState({ requiredQuantity, signedBirthYear, signerPublicKey }),
  );
  const [isProofRunning, setIsProofRunning] = useState(false);

  const { data, refetch } = useScaffoldContractRead({
    contractName: "BalloonToken",
    functionName: "balanceOf",
    args: [ethereumAddress],
  });

  const handleSubmission = async () => {
    setIsProofRunning(true);
    const notifcationId = notification.loading("Generating proof...");
    try {
      const parsedForm = parseForm({ ...form, personEthereumAddress: ethereumAddress, quantity });
      const { proof } = await generateProof("AssetGating", parsedForm as ParsedArgs);
      setProof(`0x${proof}`);
      notification.success("Proof generated");
    } catch (e: any) {
      console.error(e.stack);
      notification.error("Proof generation failed");
    } finally {
      notification.remove(notifcationId);
      setIsProofRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 2</h1>
        <h1 className="text-3xl font-bold">Generate the proof ✅</h1>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-300">
          <div className="card-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">*Signed Asset Amount</span>
                </label>
                <input
                  // type="number"
                  placeholder="Signed birth year"
                  className="input input-bordered"
                  value={quantity}
                  onChange={e => setAssetQuantity(Math.floor(Number(data) / 10 ** 18)?.toString() || "")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">*Minimum Required Quantity</span>
                </label>
                <input
                  // type="number"
                  placeholder="Required Quantity"
                  className="input input-bordered"
                  value={form.requiredQuantity}
                  // onChange={e => setForm({ ...form, requiredQuantity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Singed Asset Holding 📜</span>
                </label>
                <input
                  type="text"
                  placeholder="Asset Holding signature"
                  className="input input-bordered"
                  value={form.proofOfBirthYearSignedMessage}
                  onChange={e => setForm({ ...form, proofOfBirthYearSignedMessage: e.target.value })}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Signer&lsquo;s public key 🏛</span>
                </label>
                <input
                  type="text"
                  placeholder="Signer's public key"
                  className="input input-bordered"
                  value={form.proofOfBirthYearPublicKey}
                  onChange={e => setForm({ ...form, proofOfBirthYearPublicKey: e.target.value })}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">*Signed User address</span>
              </label>
              <AddressInput
                value={ethereumAddress}
                name="personEthereumAddress"
                placeholder="Ethereum address in signature"
                onChange={(value: string) => setEthereumAddress(value)}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" onClick={handleSubmission} disabled={isProofRunning}>
                Generate proof ✅
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
