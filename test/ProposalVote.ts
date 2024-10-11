import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";


describe("ProposalVote Test", function () {
    async function deployProposalVoteFixture() {
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const ProposalVote = await hre.ethers.getContractFactory("ProposalVote");
      const proposalVote = await ProposalVote.deploy();
  
      return { proposalVote, owner, otherAccount };
    }
  
    describe("Deployment", () => {
      it("Should check if it deployed", async function () {
        const { proposalVote, owner } = await loadFixture(deployProposalVoteFixture);
  
        expect(await proposalVote.getAllProposals());
      });
    });


    it("Should be able to create proposal", async function () {
        const { proposalVote, owner } = await loadFixture(deployProposalVoteFixture);
        const name1 = "Hello Web3 Peeps!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 1;
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
    
        expect(await proposalVote.getAProposal(0)).to.be.deep.equal([name1, description1, 0,[], quorum1, 1]);
    
        
    });
    
    it("Should be able to vote on a proposal", async function () {
        const { proposalVote, owner, otherAccount } = await loadFixture(deployProposalVoteFixture);
        
        const name1 = "Hello Web3 Peeps!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 1;
        
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
        await proposalVote.connect(otherAccount).voteOnProposal(0);
        const proposal = await proposalVote.getAProposal(0);
        
        expect(proposal[2]).to.equal(1);
        expect(proposal[3]).to.include(otherAccount.address);  
        expect(proposal[5]).to.equal(3);  
    });

    it("Should revert when voting on non-existent proposal", async function() {
        const { proposalVote, owner } = await loadFixture(deployProposalVoteFixture);
        await expect(proposalVote.connect(owner).voteOnProposal(0)).to.be.revertedWith("index is out-of-bound");
    });


     
    it("Should not be allowed to vote twice", async function () {
        const { proposalVote, owner, otherAccount } = await loadFixture(deployProposalVoteFixture);
        const name1 = "DLT team!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 2;

        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
        await proposalVote.connect(owner).voteOnProposal(0);

        await expect(proposalVote.connect(owner).voteOnProposal(0)).to.be.revertedWith("You've voted already");
    });


    it("Should change status to Accepted when quorum is reached", async function () {
        const { proposalVote, owner, otherAccount } = await loadFixture(deployProposalVoteFixture);
    
        const name1 = "My team!";
        const description1 = "The team is here";
        const quorum1 = 2;
    
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
    
        await proposalVote.connect(owner).voteOnProposal(0);
        await proposalVote.connect(otherAccount).voteOnProposal(0); 
    
        const proposal = await proposalVote.getAProposal(0);
    
        expect(proposal[5]).to.equal(3); 
    
        await expect(proposalVote.connect(owner).voteOnProposal(0)).to.be.revertedWith("You've voted already");
    
        await expect(proposalVote.connect(otherAccount).voteOnProposal(0)).to.be.revertedWith("You've voted already");
    });
    
    it("Should keep the proposal in Pending status if quorum is not reached", async function () {
        const { proposalVote, owner } = await loadFixture(deployProposalVoteFixture);
        
        const name1 = "Hello Web3 Peeps!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 2;
    
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
        await proposalVote.connect(owner).voteOnProposal(0);
    
        const proposal = await proposalVote.getAProposal(0);
        expect(proposal[5]).to.equal(2); 
    });


    it("Should record voters addresses", async function () {
        const { proposalVote, owner, otherAccount } = await loadFixture(deployProposalVoteFixture);
    
        const name1 = "Hello Web3 Peeps!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 2;
    
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
    
        await proposalVote.connect(owner).voteOnProposal(0);
        await proposalVote.connect(otherAccount).voteOnProposal(0);
    
        const proposal = await proposalVote.getAProposal(0);
    
        expect(proposal[3]).to.include(owner.address);
        expect(proposal[3]).to.include(otherAccount.address);
    });
    
    
    it("Should return all proposals", async function () {
        const { proposalVote, owner } = await loadFixture(deployProposalVoteFixture);
    
        const name1 = "Hello Web3 Peeps!";
        const description1 = "From DLT Africa Team";
        const quorum1 = 2;
    
        const name2 = "Web3 Developer";
        const description2 = "From DLT Africa Team";
        const quorum2 = 3;
    
        await proposalVote.connect(owner).createProposal(name1, description1, quorum1);
        await proposalVote.connect(owner).createProposal(name2, description2, quorum2);
    
        const allProposals = await proposalVote.getAllProposals();
    
        expect(allProposals.length).to.equal(2);
    
        expect(allProposals[0]).to.deep.equal([  name1, description1, 0,[ ], quorum1, 1 ]);
        expect(allProposals[1]).to.deep.equal([ name2, description2, 0, [], quorum2,1  ]);
    });
    
    
}) ;
