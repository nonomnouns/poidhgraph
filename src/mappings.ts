import { BigInt } from "@graphprotocol/graph-ts";
import {
  BountyCreated,
  BountyCancelled,
  BountyJoined,
  WithdrawFromOpenBounty,
  ClaimCreated,
  ClaimAccepted,
  ResetVotingPeriod,
  ClaimSubmittedForVote,
  VoteClaim,
} from "../generated/PoidhContract/PoidhContract";
import { Bounty, Claim, User, ParticipationBounty } from "../generated/schema";

export function handleBountyCreated(event: BountyCreated): void {
  let user = User.load(event.params.issuer.toHexString());
  if (!user) {
    user = new User(event.params.issuer.toHexString());
    user.address = event.params.issuer.toHexString();
    user.save();
  }

  const bounty = new Bounty(event.params.id.toString());
  bounty.chainId = 42161; // Arbitrum chain ID
  bounty.title = event.params.name;
  bounty.description = event.params.description;
  bounty.amount = event.params.amount.toString();
  bounty.issuer = user.id;
  bounty.inProgress = true;
  bounty.isJoinedBounty = false;
  bounty.isCanceled = false;
  bounty.isBanned = false;
  bounty.isVoting = false;
  bounty.createdAt = event.params.createdAt;
  bounty.save();

  const participation = new ParticipationBounty(
    event.params.issuer.toHexString() + "-" + event.params.id.toString()
  );
  participation.user = user.id;
  participation.bounty = bounty.id;
  participation.chainId = 8453; 
  participation.amount = event.params.amount.toString();
  participation.save();
}

export function handleBountyCancelled(event: BountyCancelled): void {
  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.isCanceled = true;
  bounty.inProgress = false;
  bounty.save();
}

export function handleBountyJoined(event: BountyJoined): void {
  let user = User.load(event.params.participant.toHexString());
  if (!user) {
    user = new User(event.params.participant.toHexString());
    user.address = event.params.participant.toHexString();
    user.save();
  }

  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.amount = (BigInt.fromString(bounty.amount).plus(event.params.amount)).toString();
  bounty.isJoinedBounty = true;
  bounty.save();

  const participation = new ParticipationBounty(
    event.params.participant.toHexString() + "-" + event.params.bountyId.toString()
  );
  participation.user = user.id;
  participation.bounty = bounty.id;
  participation.chainId = 8453;  
  participation.amount = event.params.amount.toString();
  participation.save();
}

export function handleWithdrawFromOpenBounty(event: WithdrawFromOpenBounty): void {
  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.amount = (BigInt.fromString(bounty.amount).minus(event.params.amount)).toString();
  bounty.save();

  const participationId = event.params.participant.toHexString() + "-" + event.params.bountyId.toString();
  const participation = ParticipationBounty.load(participationId);
  if (participation) {
    participation.save();
  }
}

export function handleClaimCreated(event: ClaimCreated): void {
  let user = User.load(event.params.issuer.toHexString());
  if (!user) {
    user = new User(event.params.issuer.toHexString());
    user.address = event.params.issuer.toHexString();
    user.save();
  }

  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  const claim = new Claim(event.params.id.toString());
  claim.chainId = 666666666; 
  claim.title = event.params.name;
  claim.description = event.params.description;
  claim.url = "";
  claim.issuer = user.id;
  claim.bounty = bounty.id;
  claim.owner = user.id;
  claim.isBanned = false;
  claim.isAccepted = false;
  claim.save();
}

export function handleClaimAccepted(event: ClaimAccepted): void {
  const claim = Claim.load(event.params.claimId.toString());
  if (!claim) return;

  claim.isAccepted = true;
  claim.save();

  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.inProgress = false;
  bounty.save();
}

export function handleResetVotingPeriod(event: ResetVotingPeriod): void {
  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.deadline = event.block.timestamp;
  bounty.isVoting = false;
  bounty.inProgress = false;
  bounty.save();
}

export function handleClaimSubmittedForVote(event: ClaimSubmittedForVote): void {
  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.isVoting = true;
  bounty.deadline = event.block.timestamp;
  bounty.save();
}

export function handleVoteClaim(event: VoteClaim): void {
  const bounty = Bounty.load(event.params.bountyId.toString());
  if (!bounty) return;

  bounty.deadline = event.block.timestamp;
  bounty.save();
}
