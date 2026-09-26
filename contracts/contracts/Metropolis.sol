// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title Metropolis
/// @notice A social attention market where culture becomes tradeable momentum.
///         Anyone turns a moment, meme, creator, or idea into a "Signal".
///         The crowd stakes native MON to boost Signals; momentum decays over
///         time so only culture that keeps attention keeps value.
contract Metropolis {
    struct Signal {
        uint256 id;
        address creator;
        string name;
        string uri;
        uint256 pool;               // MON locked in this signal
        uint256 totalShares;        // attention shares outstanding
        uint256 momentum;           // decaying attention score
        uint256 lastUpdated;        // timestamp of last momentum mutation
        uint256 pendingCreatorFees; // MON owed to the creator (boost fees + tips)
        uint256 createdAt;          // timestamp when the signal was minted
        bool active;
    }

    struct SignalSummary {
        uint256 id;
        string name;
        uint256 momentum;
        uint256 pool;
        address creator;
        bool active;
    }

    uint256 public constant SCALE = 1e18;
    uint256 public constant BASIS_POINTS = 10_000;

    uint256 public nextSignalId = 1;
    uint256 public platformFeeBps = 250;        // 2.5% captured by protocol
    uint256 public creatorFeeBps = 500;         // 5.0% paid to signal creator
    uint256 public exitFeeBps = 100;            // 1.0% paid to remaining holders
    uint256 public momentumDecayPerSecond = 2_000_000_000_000; // ~17.3% / day

    uint256 public totalVolume; // gross MON moved through boosts
    uint256 public totalPool;   // MON currently locked across signals
    uint256 public totalTips;   // MON tipped to creators

    mapping(uint256 => Signal) private _signals;
    mapping(uint256 => mapping(address => uint256)) public shares;

    address public owner;

    event SignalCreated(uint256 indexed id, address indexed creator, string name, string uri);
    event Boosted(uint256 indexed id, address indexed user, uint256 amount, uint256 mintedShares, uint256 momentum);
    event Unboosted(uint256 indexed id, address indexed user, uint256 burnedShares, uint256 payout);
    event Tipped(uint256 indexed id, address indexed from, address indexed creator, uint256 amount);
    event CreatorFeesClaimed(uint256 indexed id, address indexed creator, uint256 amount);
    event FeesUpdated(uint256 platformFeeBps, uint256 creatorFeeBps, uint256 exitFeeBps);

    modifier onlyOwner() {
        require(msg.sender == owner, "Metropolis: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createSignal(string calldata name, string calldata uri) external returns (uint256 id) {
        require(bytes(name).length > 0, "Metropolis: name required");
        require(bytes(name).length <= 64, "Metropolis: name too long");
        require(bytes(uri).length <= 256, "Metropolis: uri too long");

        id = nextSignalId++;
        Signal storage s = _signals[id];
        s.id = id;
        s.creator = msg.sender;
        s.name = name;
        s.uri = uri;
        s.active = true;
        s.lastUpdated = block.timestamp;
        s.createdAt = block.timestamp;

        emit SignalCreated(id, msg.sender, name, uri);
    }

    function setFees(uint256 platformFeeBps_, uint256 creatorFeeBps_, uint256 exitFeeBps_) external onlyOwner {
        require(platformFeeBps_ + creatorFeeBps_ <= 1500, "Metropolis: fees too high");
        require(exitFeeBps_ <= 500, "Metropolis: exit fee too high");
        platformFeeBps = platformFeeBps_;
        creatorFeeBps = creatorFeeBps_;
        exitFeeBps = exitFeeBps_;
        emit FeesUpdated(platformFeeBps_, creatorFeeBps_, exitFeeBps_);
    }

    function setMomentumDecayPerSecond(uint256 decay) external onlyOwner {
        require(decay <= 100_000_000_000_000, "Metropolis: decay too fast");
        momentumDecayPerSecond = decay;
    }

    /// @notice Stake native MON to boost a signal and mint attention shares.
    function boost(uint256 id) external payable {
        Signal storage s = _signals[id];
        require(s.active, "Metropolis: signal inactive");
        require(msg.value > 0, "Metropolis: value required");

        _decay(s);

        uint256 platformFee = (msg.value * platformFeeBps) / BASIS_POINTS;
        uint256 creatorFee = (msg.value * creatorFeeBps) / BASIS_POINTS;
        uint256 net = msg.value - platformFee - creatorFee;

        uint256 minted;
        if (s.totalShares == 0 || s.pool == 0) {
            minted = net;
        } else {
            minted = (net * s.totalShares) / s.pool;
        }
        require(minted > 0, "Metropolis: dust boost");

        s.pool += net;
        s.totalShares += minted;
        shares[id][msg.sender] += minted;
        s.momentum += net;
        s.pendingCreatorFees += creatorFee;
        s.lastUpdated = block.timestamp;

        totalVolume += msg.value;
        totalPool += net;

        emit Boosted(id, msg.sender, msg.value, minted, s.momentum);
    }

    /// @notice Burn attention shares and withdraw the proportional MON amount.
    function unboost(uint256 id, uint256 shareAmount) external {
        require(shareAmount > 0, "Metropolis: zero shares");
        uint256 held = shares[id][msg.sender];
        require(held >= shareAmount, "Metropolis: insufficient shares");

        Signal storage s = _signals[id];
        _decay(s);

        uint256 payout = (shareAmount * s.pool) / s.totalShares;
        uint256 exitFee = (payout * exitFeeBps) / BASIS_POINTS;
        uint256 netPayout = payout - exitFee;

        shares[id][msg.sender] = held - shareAmount;
        s.totalShares -= shareAmount;
        s.pool = s.pool - payout + exitFee; // exit fee accrues to remaining holders
        s.lastUpdated = block.timestamp;

        totalPool = totalPool - payout + exitFee;

        (bool ok, ) = payable(msg.sender).call{value: netPayout}("");
        require(ok, "Metropolis: payout failed");

        emit Unboosted(id, msg.sender, shareAmount, netPayout);
    }

    /// @notice Tip a creator directly; no shares are minted. 100% minus platform fee.
    function tip(uint256 id) external payable {
        Signal storage s = _signals[id];
        require(s.active, "Metropolis: signal inactive");
        require(msg.value > 0, "Metropolis: value required");

        uint256 platformFee = (msg.value * platformFeeBps) / BASIS_POINTS;
        uint256 net = msg.value - platformFee;
        s.pendingCreatorFees += net;
        totalTips += net;

        emit Tipped(id, msg.sender, s.creator, net);
    }

    function claimCreatorFees(uint256 id) external {
        Signal storage s = _signals[id];
        require(s.creator == msg.sender, "Metropolis: not creator");
        uint256 amount = s.pendingCreatorFees;
        require(amount > 0, "Metropolis: nothing to claim");
        s.pendingCreatorFees = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Metropolis: fee transfer failed");

        emit CreatorFeesClaimed(id, msg.sender, amount);
    }

    function signal(uint256 id)
        external
        view
        returns (
            uint256,
            address,
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        Signal storage s = _signals[id];
        return (
            s.id,
            s.creator,
            s.name,
            s.uri,
            s.pool,
            s.totalShares,
            previewMomentum(id),
            s.pendingCreatorFees,
            s.active
        );
    }

    function createdAt(uint256 id) external view returns (uint256) {
        return _signals[id].createdAt;
    }

    function previewMomentum(uint256 id) public view returns (uint256) {
        Signal storage s = _signals[id];
        if (s.momentum == 0) return 0;
        uint256 elapsed = block.timestamp - s.lastUpdated;
        if (elapsed == 0) return s.momentum;

        uint256 frac = elapsed * momentumDecayPerSecond;
        if (frac >= SCALE) return 0;
        return (s.momentum * (SCALE - frac)) / SCALE;
    }

    function getShares(uint256 id, address user) external view returns (uint256) {
        return shares[id][user];
    }

    function estimatedPayout(uint256 id, uint256 shareAmount) external view returns (uint256) {
        Signal storage s = _signals[id];
        if (s.totalShares == 0 || shareAmount == 0) return 0;
        uint256 payout = (shareAmount * s.pool) / s.totalShares;
        return payout - (payout * exitFeeBps) / BASIS_POINTS;
    }

    function topSignals(uint256 limit) external view returns (SignalSummary[] memory result) {
        uint256 count = nextSignalId - 1;
        if (limit > count) limit = count;
        result = new SignalSummary[](limit);

        // Simple in-place selection sort over all signals, then truncate.
        uint256[] memory ids = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            ids[i] = i + 1;
        }

        for (uint256 i = 0; i < limit; i++) {
            uint256 best = i;
            uint256 bestMomentum = previewMomentum(ids[i]);
            for (uint256 j = i + 1; j < count; j++) {
                uint256 m = previewMomentum(ids[j]);
                if (m > bestMomentum) {
                    best = j;
                    bestMomentum = m;
                }
            }
            if (best != i) {
                (ids[i], ids[best]) = (ids[best], ids[i]);
            }
            result[i] = _summary(ids[i]);
        }
    }

    function _summary(uint256 id) internal view returns (SignalSummary memory) {
        Signal storage s = _signals[id];
        return
            SignalSummary({
                id: id,
                name: s.name,
                momentum: previewMomentum(id),
                pool: s.pool,
                creator: s.creator,
                active: s.active
            });
    }

    function _decay(Signal storage s) internal {
        if (s.momentum == 0) {
            s.lastUpdated = block.timestamp;
            return;
        }
        uint256 elapsed = block.timestamp - s.lastUpdated;
        if (elapsed == 0) return;

        uint256 frac = elapsed * momentumDecayPerSecond;
        if (frac >= SCALE) {
            s.momentum = 0;
        } else {
            s.momentum = (s.momentum * (SCALE - frac)) / SCALE;
        }
        s.lastUpdated = block.timestamp;
    }

    receive() external payable {
        // Do nothing: boosts must route through boost(). This prevents silent locks.
        revert("Metropolis: use boost()");
    }
}
