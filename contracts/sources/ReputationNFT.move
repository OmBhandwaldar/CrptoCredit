module reputation::ReputationNFT {
    use std::signer;
    use aptos_framework::table::{Self, Table};

    /// NFT struct that stores the owner's reputation level
    struct ReputationNFT has key, store {
        owner: address,
        level: u64, // 1 = Bronze, 2 = Silver, 3 = Gold
    }

    /// Resource to store mapping from address → NFT
    struct ReputationStore has key {
        nfts: Table<address, ReputationNFT>,
    }

    /// Initialize storage under deployer
    entry fun init_module(account: &signer) {
        let addr = signer::address_of(account);
        if (!exists<ReputationStore>(addr)) {
            move_to(account, ReputationStore { nfts: table::new<address, ReputationNFT>() });
        }
    }

    /// Mint a Bronze NFT for new user
    public entry fun mint(account: &signer) acquires ReputationStore {
        let user = signer::address_of(account);
        let store = borrow_global_mut<ReputationStore>(@0x4d870c631f2a8e3b4108ff61d1a5eb5824ef06e54b9d020a004a8fdd9f0846cd);
        table::add(&mut store.nfts, user, ReputationNFT { owner: user, level: 1 });
    }

    /// Upgrade to Silver after 1 repayment
    public entry fun upgrade_to_silver(account: &signer, user: address)
    acquires ReputationStore {
        let store = borrow_global_mut<ReputationStore>(signer::address_of(account));
        let nft = table::borrow_mut(&mut store.nfts, user);
        nft.level = 2;
    }

    /// Upgrade to Gold after 3 repayments
    public entry fun upgrade_to_gold(account: &signer, user: address)
    acquires ReputationStore {
        let store = borrow_global_mut<ReputationStore>(signer::address_of(account));
        let nft = table::borrow_mut(&mut store.nfts, user);
        nft.level = 3;
    }

    /// Public view: get reputation level
    public fun get(addr: address, user: address): u64 acquires ReputationStore {
        let store = borrow_global<ReputationStore>(addr);
        let nft = table::borrow(&store.nfts, user);
        nft.level
    }
}
