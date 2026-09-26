// Deployed on Monad Testnet. Run `npm run deploy` inside /contracts to redeploy and update.
export const METROPOLIS_ADDRESS: string = "0xc2B8675EEFeDF74C8f7b2292731d0AF0B6BC741c";

// Human-readable ABI keeps the frontend independent of the Hardhat build output.
export const METROPOLIS_ABI: any[] = [
  "function createSignal(string name, string uri) external returns (uint256 id)",
  "function boost(uint256 id) external payable",
  "function unboost(uint256 id, uint256 shareAmount) external",
  "function tip(uint256 id) external payable",
  "function claimCreatorFees(uint256 id) external",
  "function signal(uint256 id) view returns (uint256 id, address creator, string name, string uri, uint256 pool, uint256 totalShares, uint256 momentum, uint256 pendingCreatorFees, bool active)",
  "function createdAt(uint256 id) view returns (uint256)",
  "function previewMomentum(uint256 id) view returns (uint256)",
  "function getShares(uint256 id, address user) view returns (uint256)",
  "function estimatedPayout(uint256 id, uint256 shareAmount) view returns (uint256)",
  "function topSignals(uint256 limit) view returns (tuple(uint256 id, string name, uint256 momentum, uint256 pool, address creator, bool active)[] result)",
  "function nextSignalId() view returns (uint256)",
  "function totalVolume() view returns (uint256)",
  "function totalPool() view returns (uint256)",
  "function totalTips() view returns (uint256)",
  "function platformFeeBps() view returns (uint256)",
  "function creatorFeeBps() view returns (uint256)",
  "function exitFeeBps() view returns (uint256)",
  "event SignalCreated(uint256 indexed id, address indexed creator, string name, string uri)",
  "event Boosted(uint256 indexed id, address indexed user, uint256 amount, uint256 mintedShares, uint256 momentum)",
  "event Unboosted(uint256 indexed id, address indexed user, uint256 burnedShares, uint256 payout)",
  "event Tipped(uint256 indexed id, address indexed from, address indexed creator, uint256 amount)",
  "event CreatorFeesClaimed(uint256 indexed id, address indexed creator, uint256 amount)",
];

