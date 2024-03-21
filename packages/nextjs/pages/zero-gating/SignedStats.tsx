import Stat from "./Stat";
import type { NextPage } from "next";
import { useAssetGatingProof } from "~~/services/store/asset-gating-proof";

const SignedStats: NextPage = () => {
  const signedBirthYear = useAssetGatingProof(state => state.signedBirthYear);
  const signerPublicKey = useAssetGatingProof(state => state.signerPublicKey);
  const proof = useAssetGatingProof(state => state.proof);

  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow mb-8">
      {signerPublicKey && <Stat title="Signers public key 🏛" stat={signerPublicKey} />}
      {signedBirthYear && <Stat title="Signed birth year 📜" stat={signedBirthYear} />}
      {proof && proof.length > 2 && <Stat title="Proof of valid age ✅" stat={proof} />}
    </div>
  );
};

export default SignedStats;
