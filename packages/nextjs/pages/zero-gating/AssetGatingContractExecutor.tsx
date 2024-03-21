import { useState } from "react";
import { CodeText } from "./CodeText";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAssetGatingProof } from "~~/services/store/asset-gating-proof";
import { notification } from "~~/utils/scaffold-eth";


export const BalloonCount = (props: { count: string | undefined }) => {
  if (props.count) {
    return <p>Asset count: {props.count}</p>;
  }

  return <></>;
};

export const AgeRestrictedContractExecutor = () => {
  const proof = useAssetGatingProof(state => state.proof);
  const setProof = useAssetGatingProof(state => state.setProof);
  const [sender, setSender] = useState("");

  const { data, refetch } = useScaffoldContractRead({
    contractName: "BalloonToken",
    functionName: "balanceOf",
    args: [sender],
  });

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "getFreeToken",
    args: [proof],
    onBlockConfirmation: txnReceipt => {
      if (sender) {
        refetch();
      }

      setSender("0x04cD158190d83Ef7E50d181c44AaFDb181a621b2");
      console.log("📦 Transaction blockHash");
    },
  });

  const handleSubmission = async () => {
    
      notification.success("Successfully Verified the proof");
    
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 3: Getting the Membership 🎈</h1>
        <p>
          The public inputs is part of the information that was used to generate the proof. They are needed to show
          what we are actually proving.
        </p>
        <p>
          Now that <strong>Alice</strong> has received a Membership <strong>token</strong>, she can vote anaomalyally.
        </p>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-300">
          <div className="card-body">
            <BalloonCount count={data?.toString()} />
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your proof of having the required birth year ✅</span>
              </label>
              <input
                type="text"
                placeholder="Proof of required quantity"
                value={proof}
                className="input input-bordered"
                onChange={e => setProof(e.target.value as `0x${string}`)}
              />
            </div>
            <button className="btn btn-primary mt-6" onClick={() => handleSubmission()} disabled={isLoading}>
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
