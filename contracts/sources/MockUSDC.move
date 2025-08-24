module MockUSDC::MockUSDC {

    use aptos_framework::managed_coin;

    /// Define the USDC struct as our coin type
    struct USDC has store, drop, key {}

    /// Initialize the coin — auto-called on publish
    fun init_module(account: &signer) {
        managed_coin::initialize<USDC>(
            account,
            b"Mock USD Coin",   // name
            b"USDC",            // symbol
            6,                  // decimals
            true                // monitor_supply
        );
    }

    /// Register coin for a user
    public entry fun register(account: &signer) {
        managed_coin::register<USDC>(account);
    }

    /// Mint coins to a user (only deployer can call)
    public entry fun mint(account: &signer, recipient: address, amount: u64) {
        managed_coin::mint<USDC>(account, recipient, amount);
    }

    /// Burn coins from the caller
    public entry fun burn(account: &signer, amount: u64) {
        managed_coin::burn<USDC>(account, amount);
    }
}
