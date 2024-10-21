import hre from "hardhat";

async function main() {

    const DEPLOYED_CONTRACT_ADDRESS = "0xf5025e9a87108388a9B624CB1BB3EE54904f5cb6";

    const signerAccount = "0xdf3A9C7bed041f90c51452a2B03cE44b80aF2E2F"

    

    const proposal1 = {
        name: "SoliuProposal",
        description: "Proposal on eviction test",
        quorum: 1
    }

    const proposal2 = {
        name: "FoodProposal",
        description: "Proposal on free breakfast",
        quorum: 1
    }

    const signer = await hre.ethers.getSigner(signerAccount);

    const proposalContractInstance = await hre.ethers.getContractAt("ProposalVote", DEPLOYED_CONTRACT_ADDRESS);

     //Beginning

     console.log("######### creating proposal #######");

    const createProposalTx1 =  await proposalContractInstance.connect(signer).createProposal(proposal1.name, proposal1.description, proposal1.quorum);

    createProposalTx1.wait();

    console.log({"Second proposal tx reciept": createProposalTx1})


    const createProposalTx2 =  await proposalContractInstance.connect(signer).createProposal(proposal2.name, proposal2.description, proposal2.quorum);

    createProposalTx2.wait();

    console.log({"Second proposal tx reciept": createProposalTx2})





    console.log("########## get all proposals #########");

    const allProposals = await proposalContractInstance.getAllProposals();

    console.table(allProposals);

    console.log("####### get a proposal ######");

    const firstProposal = await proposalContractInstance.getAProposal(0);
    const secondProposal = await proposalContractInstance.getAProposal(1);

    console.log({"First proposal":firstProposal, "Second proposal":  secondProposal});


    console.log("############ voting on first proposal ########");

    await proposalContractInstance.connect(signer).voteOnProposal(0)
    await proposalContractInstance.connect(signer).voteOnProposal(0)
    await proposalContractInstance.connect(signer).voteOnProposal(0)

    console.log("###### voting on the second proposal ########")


    await proposalContractInstance.connect(signer).voteOnProposal(1)
    await proposalContractInstance.connect(signer).voteOnProposal(1)
    await proposalContractInstance.connect(signer).voteOnProposal(1)


    
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})