import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ProposalVoteContractModule = buildModule("ProposalVoteContractModule", (m) => {
  const proposeVoteFactory = m.contract("ProposalVote");

  


  return { proposeVoteFactory };
});

export default ProposalVoteContractModule;