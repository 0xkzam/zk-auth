# Zero Gate

ZKP Asset Gating for DAO Memberships

# Running the project
1. Run `yarn && yarn chain` in terminal 1 to start the hardhat chain locally
2. Run `yarn deploy --reset` in terminal 2 to deploy the contracts
3. Run `yarn start` in terminal 3 to run the UI at http://localhost:3000 

# Prerequisites
- requires [nargo](https://noir-lang.org/docs/getting_started/installation/) (tested with v0.18.0)
  - Also tested with v0.25.0
  - NOTE: you need to change compiler_version in Nargo.toml if you're using a different version of Nargo. 
- requires [node](https://nodejs.org/en) (tested with v18.8.0)
- requires [yarn](https://yarnpkg.com/getting-started/install) (tested with 3.2.3)

# Workflow - Story

Alice has heard that DAO store in town is handing out Voting Roles to anyone who hold there 10 token get the membership. However, Alice does not want to share her token holding and wallet address with anyone. Lucky for her, the DAO uses Zk asset gating which has a zero knowledge proof solution. This means she can claim her membership and only share as little information as necessary publicly. Here is how she would go about it...

First, she needs to get the asset contract address 🏛 that can be used to get his holding signature 📜 that she is holds token for memebership eligibility.
Then, she needs to generate a zero knowledge proof ✅. It should prove that the signed asset holding is greater than or equal to 10 token and that the signature 📜 is done by a known public key.
Finally, Alice can call the DAO Membership restricted contract with her proof ✅ and get a Voting role.


### Step 1: User 🏛 signs 📜 the Asset Holding data with collection address
Alice and the Asset DAO need to agree on who to trust in order to certify Alice' Membership. In this example the Asset Contract acts as a trusted third party, but in a different set-up the certifying entity could be completely different. The only requirement is that both Alice & the DAO trust the signature.

The DAO has implemented the same claim format as the Asset Contract, this enables the proof verification on a later step.

### Step 2: Generating the proof ✅
In order for Alice to really know that she's not sharing any private information with the DAO two things should be possible:
1. The code that generates the the proof should be open source for Alice to review
2. The proof generation should happen in an environment trusted byAlice (ex: locally in her laptop or phone)

A circuit written in Noir is used for generating the proof and for generating a proof-verifier. The DAO will use the proof as input to execute the verifier contract on-chain.

### Step 3: Getting the Membership 🎈
The public inputs is part of the information that was used to generate the proof. They are needed to show what we are actually proving.

Now that Alice has received a Membership token, she can vote anaomalyally.