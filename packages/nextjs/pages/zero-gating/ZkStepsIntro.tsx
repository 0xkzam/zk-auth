// TODO: rename to requiredQuantity
import { Dispatch, SetStateAction } from "react";

type ZkStepsIntroProps = { setCurrentStep: Dispatch<SetStateAction<number>>; yearTenYearsAgo: number };

export const ZkStepsIntro = ({ setCurrentStep, yearTenYearsAgo }: ZkStepsIntroProps) => {
  return (
    <div className="hero">
      <div className="hero-content text-center">
        <div className="max-w-3xl">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-5xl font-bold">ZK Asset Gating</h1>
            <p className="py-6 text-left">
              Alice has heard that DAO store in town is handing out Voting Roles 🎈 to anyone who hold there 10 token get the membership. 
              However, Alice does not want to share her token holding and wallet address with anyone. Lucky for her, the DAO uses Zk asset gating which has a
              zero knowledge proof solution. This means she can claim her membership 🎈 and only share as little
              information as necessary publicly. Here is how she would go about it...
              <br />
            </p>
            <ol className="list-decimal list-inside text-left">
              {/* When the list is centered it looks weird, but perhaps there is another solution than `text-left`?*/}
              <li>
                First, she needs to get the asset contract address 🏛 that can be used to get his holding signature 📜 that she is
                holds token for memebership eligibility.
              </li>
              <li>
                Then, she needs to generate a zero knowledge proof ✅. It should prove that the signed asset holding is
                greater than or equal to 10 token and that the signature 📜 is done by a known public key.
              </li>
              <li>
                Finally, Alice can call the DAO  Membership restricted contract with her proof ✅ and get a
                Voting role.
              </li>
            </ol>
          </div>
          <button className="btn btn-secondary mt-6" onClick={() => setCurrentStep(currentStep => currentStep + 1)}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
