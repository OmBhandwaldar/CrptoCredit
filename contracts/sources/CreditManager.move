// module CreditManager::CreditManager {
//     use std::signer;
//     use std::error;
//     use std::timestamp;
//     use aptos_framework::coin;
//     use aptos_framework::event;

//     use MockUSDC::MockUSDC::{USDC, Self as MockUSDCModule};

//     const SECONDS_IN_30_DAYS: u64 = 30 * 24 * 60 * 60;


//     struct Config has key {
//         admin: address,
//         default_limit: u64,
//         monthly_rate_bps: u64,    // 200 = 2%
//         grace_period_secs: u64,
//     }

//     struct Account has key {
//         credit_limit: u64,
//         borrowed: u64,
//         due_ts: u64,
//         repaid_count: u64,
//         registered: bool,
//     }

//     /// Events for frontend UI
//     struct Events has key {
//         user_registered: event::EventHandle<address>,
//         credit_limit_set: event::EventHandle<(address, u64)>,
//         disbursed: event::EventHandle<(address, u64)>,
//         repaid: event::EventHandle<(address, u64)>,
//     }

//     /// -------------------
//     /// ERRORS
//     /// -------------------
//     const E_NOT_ADMIN: u64 = 1;
//     const E_ALREADY_REGISTERED: u64 = 2;
//     const E_NOT_REGISTERED: u64 = 3;
//     const E_OVER_LIMIT: u64 = 4;
//     const E_AMOUNT_ZERO: u64 = 5;
//     const E_NOTHING_BORROWED: u64 = 6;

//     /// -------------------
//     /// HELPERS
//     /// -------------------
//     fun cfg(): &Config acquires Config {
//         borrow_global<Config>(@CreditManager)
//     }

//     fun evts(): &mut Events acquires Events {
//         borrow_global_mut<Events>(@CreditManager)
//     }

//     fun assert_admin(admin: &signer) acquires Config {
//         assert!(signer::address_of(admin) == cfg().admin, error::permission_denied(E_NOT_ADMIN));
//     }

//     /// -------------------
//     /// MODULE INIT
//     /// -------------------
//     public entry fun init_module(admin: &signer) {
//         let admin_addr = signer::address_of(admin);

//         move_to(admin, Config {
//             admin: admin_addr,
//             default_limit: 200_000000,     // 200 USDC
//             monthly_rate_bps: 200,        // 2%
//             grace_period_secs: SECONDS_IN_30_DAYS,
//         });

//         move_to(admin, Events {
//             user_registered: event::new_event_handle<address>(admin),
//             credit_limit_set: event::new_event_handle<(address, u64)>(admin),
//             disbursed: event::new_event_handle<(address, u64)>(admin),
//             repaid: event::new_event_handle<(address, u64)>(admin),
//         });
//     }

//     /// -------------------
//     /// USER FUNCTIONS
//     /// -------------------

//     /// Register a new borrower
//     public entry fun register_user(user: &signer) acquires Config, Events {
//         let addr = signer::address_of(user);
//         assert!(!exists<Account>(addr), error::already_exists(E_ALREADY_REGISTERED));

//         let c = cfg();
//         move_to(user, Account {
//             credit_limit: c.default_limit,
//             borrowed: 0,
//             due_ts: 0,
//             repaid_count: 0,
//             registered: true,
//         });

//         let e = evts();
//         event::emit_event(&mut e.user_registered, addr);
//     }

//     /// Borrower repays borrowed USDC
//     public entry fun repay(borrower: &signer, amount: u64) acquires Config, Account, Events {
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));

//         let addr = signer::address_of(borrower);
//         assert!(exists<Account>(addr), error::not_found(E_NOT_REGISTERED));
//         let a = borrow_global_mut<Account>(addr);
//         assert!(a.borrowed > 0, error::invalid_argument(E_NOTHING_BORROWED));

//         let c = cfg();
//         // send repayment to admin
//         //coin::transfer<USDC>(borrower, c.admin, amount);
//         coin::burn_from(borrower, amount);

//         if (amount >= a.borrowed) {
//             a.borrowed = 0;
//             a.due_ts = 0;
//             a.repaid_count = a.repaid_count + 1;
//         } else {
//             a.borrowed = a.borrowed - amount;
//         };

//         let e = evts();
//         event::emit_event(&mut e.repaid, (addr, amount));
//     }

//     /// -------------------
//     /// ADMIN FUNCTIONS
//     /// -------------------

//     /// Set or change credit limit
//     public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
//         acquires Account, Events
//     {
//         assert_admin(admin);
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         a.credit_limit = new_limit;
//         if (a.borrowed > new_limit) {
//             a.borrowed = new_limit;
//         };

//         let e = evts();
//         event::emit_event(&mut e.credit_limit_set, (user, new_limit));
//     }

//     /// Disburse tokens (admin sends USDC to user)
//     public entry fun disburse(admin: &signer, user: address, amount: u64)
//         acquires Config, Account, Events
//     {
//         assert_admin(admin);
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         let avail = if (a.borrowed >= a.credit_limit) 0 else {a.credit_limit - a.borrowed};
//         //let avail = if (a.borrowed >= a.credit_limit) 0 else (a.credit_limit - a.borrowed);
//         assert!(amount <= avail, error::out_of_range(E_OVER_LIMIT));

//         a.borrowed = a.borrowed + amount;
//         let c = cfg();
//         a.due_ts = timestamp::now_seconds() + c.grace_period_secs;

//         // mint USDC to borrower
//         MockUSDCModule::mint(admin, user, amount);

//         let e = evts();
//         event::emit_event(&mut e.disbursed, (user, amount));
//     }


//     /// -------------------
//     /// VIEW FUNCTIONS
//     /// -------------------

//     /// View: system settings
//     public fun params(): (address, u64, u64, u64) acquires Config {
//         let c = cfg();
//         (c.admin, c.default_limit, c.monthly_rate_bps, c.grace_period_secs)
//     }

//     /// View: full account data
//     public fun get_account(user: address): (u64, u64, u64, u64, bool) acquires Account {
//         if (!exists<Account>(user)) {
//             return (0, 0, 0, 0, false);
//         };
//         let a = borrow_global<Account>(user);
//         (a.credit_limit, a.borrowed, a.due_ts, a.repaid_count, a.registered)
//     }

//     /// View: available credit left
//     public fun available_credit(user: address): u64 acquires Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed >= a.credit_limit) 0 else {a.credit_limit - a.borrowed}
//     }

//     /// View: compute simple overdue interest
//     public fun compute_interest(user: address): u64 acquires Config, Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed == 0 || a.due_ts == 0) return 0;

//         let now = timestamp::now_seconds();
//         if (now <= a.due_ts) return 0;

//         let c = cfg();
//         let overdue_secs = now - a.due_ts;
//         let months = overdue_secs / c.grace_period_secs;
//         let interest = a.borrowed * c.monthly_rate_bps * months / 10_000;
//         interest
//     }
// }


// module CreditManager::CreditManager {
//     use std::signer;
//     use std::error;
//     use std::timestamp;
//     use aptos_framework::coin;
//     use aptos_framework::event;
//     use aptos_framework::guid;

//     use MockUSDC::MockUSDC::{USDC, Self as MockUSDCModule};

//     const SECONDS_IN_30_DAYS: u64 = 30 * 24 * 60 * 60;

//     //
//     // Storage
//     //
//     struct Config has key {
//         admin: address,
//         default_limit: u64,
//         monthly_rate_bps: u64,    // 200 = 2%
//         grace_period_secs: u64,
//     }

//     struct Account has key {
//         credit_limit: u64,
//         borrowed: u64,
//         due_ts: u64,
//         repaid_count: u64,
//         registered: bool,
//     }

//     //
//     // Event payloads (structs only; tuples aren’t allowed)
//     //
//     struct UserRegisteredEvent has drop, store {
//         user: address,
//     }

//     struct CreditLimitEvent has drop, store {
//         user: address,
//         new_limit: u64,
//     }

//     struct DisbursedEvent has drop, store {
//         user: address,
//         amount: u64,
//     }

//     struct RepaidEvent has drop, store {
//         user: address,
//         amount: u64,
//     }

//     struct Events has key {
//         user_registered: event::EventHandle<UserRegisteredEvent>,
//         credit_limit_set: event::EventHandle<CreditLimitEvent>,
//         disbursed: event::EventHandle<DisbursedEvent>,
//         repaid: event::EventHandle<RepaidEvent>,
//     }

//     //
//     // Errors
//     //
//     const E_NOT_ADMIN: u64 = 1;
//     const E_ALREADY_REGISTERED: u64 = 2;
//     const E_NOT_REGISTERED: u64 = 3;
//     const E_OVER_LIMIT: u64 = 4;
//     const E_AMOUNT_ZERO: u64 = 5;
//     const E_NOTHING_BORROWED: u64 = 6;

//     //
//     // Helpers
//     //
//     fun cfg(): &Config acquires Config {
//         borrow_global<Config>(@CreditManager)
//     }

//     fun evts(): &mut Events acquires Events {
//         borrow_global_mut<Events>(@CreditManager)
//     }

//     fun assert_admin(admin: &signer) acquires Config {
//         assert!(signer::address_of(admin) == cfg().admin, error::permission_denied(E_NOT_ADMIN));
//     }

//     //
//     // Init (call once by deployer)
//     //
//     public entry fun init_module(admin: &signer) {
//         let admin_addr = signer::address_of(admin);

//         move_to(admin, Config {
//             admin: admin_addr,
//             default_limit: 200_000000,     // 200 USDC (6 decimals)
//             monthly_rate_bps: 200,        // 2% monthly
//             grace_period_secs: SECONDS_IN_30_DAYS,
//         });

//         // Create a GUID generator for event handles
//         // let gen = guid::create_generator(admin);

//         // move_to(admin, Events {
//         //     user_registered: event::new_event_handle<UserRegisteredEvent>(&gen),
//         //     credit_limit_set: event::new_event_handle<CreditLimitEvent>(&gen),
//         //     disbursed: event::new_event_handle<DisbursedEvent>(&gen),
//         //     repaid: event::new_event_handle<RepaidEvent>(&gen),
//         // });
//         move_to(admin, Events {
//             user_registered: event::new_event_handle<UserRegisteredEvent>(admin),
//             credit_limit_set: event::new_event_handle<CreditLimitEvent>(admin),
//             disbursed: event::new_event_handle<DisbursedEvent>(admin),
//             repaid: event::new_event_handle<RepaidEvent>(admin),
//         });

//     }

//     //
//     // User functions
//     //
//     public entry fun register_user(user: &signer) acquires Config, Events {
//         let addr = signer::address_of(user);
//         assert!(!exists<Account>(addr), error::already_exists(E_ALREADY_REGISTERED));

//         let c = cfg();
//         move_to(user, Account {
//             credit_limit: c.default_limit,
//             borrowed: 0,
//             due_ts: 0,
//             repaid_count: 0,
//             registered: true,
//         });

//         let e = evts();
//         event::emit_event(&mut e.user_registered, UserRegisteredEvent { user: addr });
//     }

//     /// Repay — transfers USDC from borrower to admin (ensure admin registered CoinStore<USDC>!)
//     public entry fun repay(borrower: &signer, amount: u64) acquires Config, Account, Events {
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));

//         let addr = signer::address_of(borrower);
//         assert!(exists<Account>(addr), error::not_found(E_NOT_REGISTERED));
//         let a = borrow_global_mut<Account>(addr);
//         assert!(a.borrowed > 0, error::invalid_argument(E_NOTHING_BORROWED));

//         // send repayment to admin’s address
//         let c = cfg();
//         coin::transfer<USDC>(borrower, c.admin, amount);

//         if (amount >= a.borrowed) {
//             a.borrowed = 0;
//             a.due_ts = 0;
//             a.repaid_count = a.repaid_count + 1;
//         } else {
//             a.borrowed = a.borrowed - amount;
//         };

//         let e = evts();
//         event::emit_event(&mut e.repaid, RepaidEvent { user: addr, amount });
//     }

//     //
//     // Admin functions
//     //
//     public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
//         acquires Account, Events
//     {
//         assert_admin(admin);
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         a.credit_limit = new_limit;
//         if (a.borrowed > new_limit) {
//             a.borrowed = new_limit;
//         };

//         let e = evts();
//         event::emit_event(&mut e.credit_limit_set, CreditLimitEvent { user, new_limit });
//     }

//     /// MVP disbursement: admin mints USDC to the user (devnet)
//     public entry fun disburse(admin: &signer, user: address, amount: u64)
//         acquires Config, Account, Events
//     {
//         assert_admin(admin);
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         let avail = if (a.borrowed >= a.credit_limit) { 0 } else { a.credit_limit - a.borrowed };
//         assert!(amount <= avail, error::out_of_range(E_OVER_LIMIT));

//         a.borrowed = a.borrowed + amount;
//         let c = cfg();
//         a.due_ts = timestamp::now_seconds() + c.grace_period_secs;

//         // mint USDC to borrower (devnet). For testnet/mainnet, replace with transfer from treasury.
//         MockUSDCModule::mint(admin, user, amount);

//         let e = evts();
//         event::emit_event(&mut e.disbursed, DisbursedEvent { user, amount });
//     }

//     //
//     // Views
//     //
//     public fun params(): (address, u64, u64, u64) acquires Config {
//         let c = cfg();
//         (c.admin, c.default_limit, c.monthly_rate_bps, c.grace_period_secs)
//     }

//     public fun get_account(user: address): (u64, u64, u64, u64, bool) acquires Account {
//         if (!exists<Account>(user)) { return (0, 0, 0, 0, false); };
//         let a = borrow_global<Account>(user);
//         (a.credit_limit, a.borrowed, a.due_ts, a.repaid_count, a.registered)
//     }

//     public fun available_credit(user: address): u64 acquires Account {
//         if (!exists<Account>(user)) { return 0; };
//         let a = borrow_global<Account>(user);
//         if (a.borrowed >= a.credit_limit) { 0 } else { a.credit_limit - a.borrowed }
//     }

//     public fun compute_interest(user: address): u64 acquires Config, Account {
//         if (!exists<Account>(user)) { return 0; };
//         let a = borrow_global<Account>(user);
//         if (a.borrowed == 0 || a.due_ts == 0) { return 0; };

//         let now = timestamp::now_seconds();
//         if (now <= a.due_ts) { return 0; };

//         let c = cfg();
//         let overdue_secs = now - a.due_ts;
//         let months = overdue_secs / c.grace_period_secs;
//         let interest = a.borrowed * c.monthly_rate_bps * months / 10_000;
//         interest
//     }
// }















// module CreditManager::CreditManager {
//     use std::signer;
//     use std::error;
//     use std::timestamp;
//     use aptos_framework::coin;
//     use aptos_framework::event;
//     use aptos_framework::guid;

//     use MockUSDC::MockUSDC::{USDC, Self as MockUSDCModule};

//     const SECONDS_IN_30_DAYS: u64 = 30 * 24 * 60 * 60;

//     /// -------------------
//     /// CONFIG + STORAGE
//     /// -------------------
//     struct Config has key {
//         admin: address,
//         default_limit: u64,
//         monthly_rate_bps: u64,    // 200 = 2%
//         grace_period_secs: u64,
//     }

//     struct Account has key {
//         credit_limit: u64,
//         borrowed: u64,
//         due_ts: u64,
//         repaid_count: u64,
//         registered: bool,
//     }

//     /// Events for frontend UI
//     struct UserRegisteredEvent has drop, store { user: address }
//     struct CreditLimitEvent has drop, store { user: address, new_limit: u64 }
//     struct DisbursedEvent has drop, store { user: address, amount: u64 }
//     struct RepaidEvent has drop, store { user: address, amount: u64 }

//     struct Events has key {
//         user_registered: event::EventHandle<UserRegisteredEvent>,
//         credit_limit_set: event::EventHandle<CreditLimitEvent>,
//         disbursed: event::EventHandle<DisbursedEvent>,
//         repaid: event::EventHandle<RepaidEvent>,
//     }

//     /// -------------------
//     /// ERRORS
//     /// -------------------
//     const E_NOT_ADMIN: u64 = 1;
//     const E_ALREADY_REGISTERED: u64 = 2;
//     const E_NOT_REGISTERED: u64 = 3;
//     const E_OVER_LIMIT: u64 = 4;
//     const E_AMOUNT_ZERO: u64 = 5;
//     const E_NOTHING_BORROWED: u64 = 6;

//     /// -------------------
//     /// HELPERS
//     /// -------------------
//     fun cfg(): &Config acquires Config {
//         borrow_global<Config>(@CreditManager)
//     }

//     fun evts(): &mut Events acquires Events {
//         borrow_global_mut<Events>(@CreditManager)
//     }

//     fun assert_admin(admin: &signer) acquires Config {
//         assert!(signer::address_of(admin) == cfg().admin, error::permission_denied(E_NOT_ADMIN));
//     }

//     /// -------------------
//     /// MODULE INIT
//     /// -------------------
//     public entry fun init_module(admin: &signer) {
//         let admin_addr = signer::address_of(admin);

//         move_to(admin, Config {
//             admin: admin_addr,
//             default_limit: 200_000000,     // 200 USDC
//             monthly_rate_bps: 200,        // 2%
//             grace_period_secs: SECONDS_IN_30_DAYS,
//         });

//         // Create GUID generator for event handles
//         let gen = guid::create_generator(admin);

//         move_to(admin, Events {
//             user_registered: event::new_event_handle<UserRegisteredEvent>(&mut gen),
//             credit_limit_set: event::new_event_handle<CreditLimitEvent>(&mut gen),
//             disbursed: event::new_event_handle<DisbursedEvent>(&mut gen),
//             repaid: event::new_event_handle<RepaidEvent>(&mut gen),
//         });
//     }

//     /// -------------------
//     /// USER FUNCTIONS
//     /// -------------------
//     public entry fun register_user(user: &signer) acquires Config, Events {
//         let addr = signer::address_of(user);
//         assert!(!exists<Account>(addr), error::already_exists(E_ALREADY_REGISTERED));

//         let c = cfg();
//         move_to(user, Account {
//             credit_limit: c.default_limit,
//             borrowed: 0,
//             due_ts: 0,
//             repaid_count: 0,
//             registered: true,
//         });

//         let e = evts();
//         event::emit_event(&mut e.user_registered, UserRegisteredEvent { user: addr });
//     }

//     public entry fun repay(borrower: &signer, amount: u64) acquires Config, Account, Events {
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));

//         let addr = signer::address_of(borrower);
//         assert!(exists<Account>(addr), error::not_found(E_NOT_REGISTERED));
//         let a = borrow_global_mut<Account>(addr);
//         assert!(a.borrowed > 0, error::invalid_argument(E_NOTHING_BORROWED));

//         // burn repayment (in real USDC you’d transfer to admin instead)
//         coin::burn_from<USDC>(borrower, amount);

//         if (amount >= a.borrowed) {
//             a.borrowed = 0;
//             a.due_ts = 0;
//             a.repaid_count = a.repaid_count + 1;
//         } else {
//             a.borrowed = a.borrowed - amount;
//         };

//         let e = evts();
//         event::emit_event(&mut e.repaid, RepaidEvent { user: addr, amount });
//     }

//     /// -------------------
//     /// ADMIN FUNCTIONS
//     /// -------------------
//     public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
//         acquires Account, Events, Config
//     {
//         assert_admin(admin);
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         a.credit_limit = new_limit;
//         if (a.borrowed > new_limit) {
//             a.borrowed = new_limit;
//         };

//         let e = evts();
//         event::emit_event(&mut e.credit_limit_set, CreditLimitEvent { user, new_limit });
//     }

//     public entry fun disburse(admin: &signer, user: address, amount: u64)
//         acquires Config, Account, Events
//     {
//         assert_admin(admin);
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         let avail = if (a.borrowed >= a.credit_limit) 0 else {a.credit_limit - a.borrowed};
//         assert!(amount <= avail, error::out_of_range(E_OVER_LIMIT));

//         a.borrowed = a.borrowed + amount;
//         let c = cfg();
//         a.due_ts = timestamp::now_seconds() + c.grace_period_secs;

//         // Mint USDC to borrower
//         MockUSDCModule::mint(admin, user, amount);

//         let e = evts();
//         event::emit_event(&mut e.disbursed, DisbursedEvent { user, amount });
//     }

//     /// -------------------
//     /// VIEW FUNCTIONS
//     /// -------------------
//     public fun params(): (address, u64, u64, u64) acquires Config {
//         let c = cfg();
//         (c.admin, c.default_limit, c.monthly_rate_bps, c.grace_period_secs)
//     }

//     public fun get_account(user: address): (u64, u64, u64, u64, bool) acquires Account {
//         if (!exists<Account>(user)) {
//             return (0, 0, 0, 0, false);
//         };
//         let a = borrow_global<Account>(user);
//         (a.credit_limit, a.borrowed, a.due_ts, a.repaid_count, a.registered)
//     }

//     public fun available_credit(user: address): u64 acquires Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed >= a.credit_limit) 0 else {a.credit_limit - a.borrowed}
//     }

//     public fun compute_interest(user: address): u64 acquires Config, Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed == 0 || a.due_ts == 0) return 0;

//         let now = timestamp::now_seconds();
//         if (now <= a.due_ts) return 0;

//         let c = cfg();
//         let overdue_secs = now - a.due_ts;
//         let months = overdue_secs / c.grace_period_secs;
//         let interest = a.borrowed * c.monthly_rate_bps * months / 10_000;
//         interest
//     }
// }











// module CreditManager::CreditManager {
//     use std::signer;
//     use std::error;
//     use std::timestamp;

//     use aptos_framework::coin;
//     use aptos_framework::event;
//     use aptos_framework::account;

//     // Import your USDC type + mint entry from MockUSDC
//     use MockUSDC::MockUSDC::{USDC, Self as MockUSDCModule};

//     const SECONDS_IN_30_DAYS: u64 = 30 * 24 * 60 * 60;

//     /// Global configuration
//     struct Config has key {
//         admin: address,
//         default_limit: u64,        // e.g., 200_000000 = 200 USDC (6 dp)
//         monthly_rate_bps: u64,     // e.g., 200 = 2% per month
//         grace_period_secs: u64,    // due date offset for each disbursement
//     }

//     /// Per-user account state
//     struct Account has key {
//         credit_limit: u64,
//         borrowed: u64,
//         due_ts: u64,
//         repaid_count: u64,
//         registered: bool,
//     }

//     /// Event payloads (avoid tuples; each must have drop+store)
//     struct UserRegisteredEvent has drop, store { user: address }
//     struct CreditLimitEvent     has drop, store { user: address, new_limit: u64 }
//     struct DisbursedEvent       has drop, store { user: address, amount: u64 }
//     struct RepaidEvent          has drop, store { user: address, amount: u64 }

//     /// Event handles resource (one per module account)
//     struct Events has key {
//         user_registered: event::EventHandle<UserRegisteredEvent>,
//         credit_limit_set: event::EventHandle<CreditLimitEvent>,
//         disbursed: event::EventHandle<DisbursedEvent>,
//         repaid: event::EventHandle<RepaidEvent>,
//     }

//     /// Error codes
//     const E_NOT_ADMIN: u64          = 1;
//     const E_ALREADY_REGISTERED: u64 = 2;
//     const E_NOT_REGISTERED: u64     = 3;
//     const E_OVER_LIMIT: u64         = 4;
//     const E_AMOUNT_ZERO: u64        = 5;
//     const E_NOTHING_BORROWED: u64   = 6;

//     /// -------------------
//     /// Helpers
//     /// -------------------
//     fun cfg(): &Config acquires Config {
//         borrow_global<Config>(@CreditManager)
//     }

//     fun evts(): &mut Events acquires Events {
//         borrow_global_mut<Events>(@CreditManager)
//     }

//     fun assert_admin(a: &signer) acquires Config {
//         assert!(
//             signer::address_of(a) == cfg().admin,
//             error::permission_denied(E_NOT_ADMIN)
//         );
//     }

//     /// -------------------
//     /// Module init
//     /// Publish this module from the admin address and call once.
//     /// -------------------
//     public entry fun init_module(admin: &signer) {
//         let admin_addr = signer::address_of(admin);

//         move_to(admin, Config {
//             admin: admin_addr,
//             default_limit: 200_000000,    // 200 USDC (6 decimals)
//             monthly_rate_bps: 200,        // 2% per month
//             grace_period_secs: SECONDS_IN_30_DAYS,
//         });

//         // Create event handles using the account helper (works on current frameworks)
//         move_to(admin, Events {
//             user_registered: account::new_event_handle<UserRegisteredEvent>(admin),
//             credit_limit_set: account::new_event_handle<CreditLimitEvent>(admin),
//             disbursed: account::new_event_handle<DisbursedEvent>(admin),
//             repaid: account::new_event_handle<RepaidEvent>(admin),
//         });
//     }

//     /// -------------------
//     /// User functions
//     /// -------------------

//     /// User registers; gets default credit limit
//     public entry fun register_user(user: &signer) acquires Config, Events {
//         let addr = signer::address_of(user);
//         assert!(!exists<Account>(addr), error::already_exists(E_ALREADY_REGISTERED));

//         let c = cfg();
//         move_to(user, Account {
//             credit_limit: c.default_limit,
//             borrowed: 0,
//             due_ts: 0,
//             repaid_count: 0,
//             registered: true,
//         });

//         let e = evts();
//         event::emit_event(&mut e.user_registered, UserRegisteredEvent { user: addr });
//     }

//     /// User repays borrowed USDC — tokens are transferred to admin
//     public entry fun repay(borrower: &signer, amount: u64)
//         acquires Config, Account, Events
//     {
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));

//         let addr = signer::address_of(borrower);
//         assert!(exists<Account>(addr), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(addr);
//         assert!(a.borrowed > 0, error::invalid_argument(E_NOTHING_BORROWED));

//         let c = cfg();

//         // Transfer back to admin (simple and works on all nets)
//         coin::transfer<USDC>(borrower, c.admin, amount);

//         if (amount >= a.borrowed) {
//             a.borrowed = 0;
//             a.due_ts = 0;
//             a.repaid_count = a.repaid_count + 1;
//         } else {
//             a.borrowed = a.borrowed - amount;
//         };

//         let e2 = evts();
//         event::emit_event(&mut e2.repaid, RepaidEvent { user: addr, amount });
//     }

//     /// -------------------
//     /// Admin functions
//     /// -------------------

//     /// Admin updates a user's credit limit
//     public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
//         acquires Config, Account, Events
//     // public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
//     //     acquires Account, Events
//     {
//         assert_admin(admin);
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         a.credit_limit = new_limit;
//         if (a.borrowed > new_limit) {
//             // keep state consistent (can't exceed new limit)
//             a.borrowed = new_limit;
//         };

//         let e = evts();
//         event::emit_event(&mut e.credit_limit_set, CreditLimitEvent { user, new_limit });
//     }

//     /// Admin disburses (mints) USDC to user in MVP
//     public entry fun disburse(admin: &signer, user: address, amount: u64)
//         acquires Config, Account, Events
//     {
//         assert_admin(admin);
//         assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));
//         assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

//         let a = borrow_global_mut<Account>(user);
//         let avail =
//             if (a.borrowed >= a.credit_limit) 0
//             else (a.credit_limit - a.borrowed);
//         assert!(amount <= avail, error::out_of_range(E_OVER_LIMIT));

//         a.borrowed = a.borrowed + amount;
//         let c = cfg();
//         a.due_ts = timestamp::now_seconds() + c.grace_period_secs;

//         // Mint USDC to the borrower (MVP/devnet). Swap to transfer-from-treasury on testnet/mainnet.
//         MockUSDCModule::mint(admin, user, amount);

//         let e = evts();
//         event::emit_event(&mut e.disbursed, DisbursedEvent { user, amount });
//     }

//     /// -------------------
//     /// View functions
//     /// -------------------

//     public fun params(): (address, u64, u64, u64) acquires Config {
//         let c = cfg();
//         (c.admin, c.default_limit, c.monthly_rate_bps, c.grace_period_secs)
//     }

//     public fun get_account(user: address): (u64, u64, u64, u64, bool) acquires Account {
//         if (!exists<Account>(user)) {
//             return (0, 0, 0, 0, false);
//         };
//         let a = borrow_global<Account>(user);
//         (a.credit_limit, a.borrowed, a.due_ts, a.repaid_count, a.registered)
//     }

//     public fun available_credit(user: address): u64 acquires Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed >= a.credit_limit) 0 else (a.credit_limit - a.borrowed)
//     }

//     public fun compute_interest(user: address): u64 acquires Config, Account {
//         if (!exists<Account>(user)) return 0;
//         let a = borrow_global<Account>(user);
//         if (a.borrowed == 0 || a.due_ts == 0) return 0;

//         let now = timestamp::now_seconds();
//         if (now <= a.due_ts) return 0;

//         let c = cfg();
//         let overdue_secs = now - a.due_ts;
//         let months = overdue_secs / c.grace_period_secs;
//         a.borrowed * c.monthly_rate_bps * months / 10_000
//     }
// }


module CreditManager::CreditManager {
    use std::error;
    use std::signer;
    use std::timestamp;

    use aptos_framework::coin;
    use aptos_framework::event;
    use aptos_framework::account;

    // Import your mock USDC type and mint function
    use MockUSDC::MockUSDC::{USDC, Self as MockUSDCModule};

    /// ~30 days
    const SECONDS_IN_30_DAYS: u64 = 30 * 24 * 60 * 60;

    /// -------------------
    /// STORAGE
    /// -------------------

    struct Config has key {
        admin: address,
        default_limit: u64,      // in USDC base units (6 decimals)
        monthly_rate_bps: u64,   // 200 = 2%
        grace_period_secs: u64,  // repayment window for "no interest"
    }

    struct Account has key {
        credit_limit: u64,   // current credit limit
        borrowed: u64,       // current outstanding principal
        due_ts: u64,         // next due timestamp (unix seconds), 0 if not set
        repaid_count: u64,   // how many times fully repaid
        registered: bool,
    }

    // Event payload structs (must have drop + store)
    struct UserRegisteredEvent has drop, store { user: address }
    struct CreditLimitEvent   has drop, store { user: address, new_limit: u64 }
    struct DisbursedEvent     has drop, store { user: address, amount: u64 }
    struct RepaidEvent        has drop, store { user: address, payer: address, amount: u64 }

    struct Events has key {
        user_registered: event::EventHandle<UserRegisteredEvent>,
        credit_limit_set: event::EventHandle<CreditLimitEvent>,
        disbursed: event::EventHandle<DisbursedEvent>,
        repaid: event::EventHandle<RepaidEvent>,
    }

    /// -------------------
    /// ERRORS
    /// -------------------
    const E_NOT_ADMIN: u64           = 1;
    const E_ALREADY_REGISTERED: u64  = 2;
    const E_NOT_REGISTERED: u64      = 3;
    const E_OVER_LIMIT: u64          = 4;
    const E_AMOUNT_ZERO: u64         = 5;
    const E_NOTHING_BORROWED: u64    = 6;

    /// -------------------
    /// INIT
    /// -------------------

    // Publish-time initializer (call once from the deployer address)
    fun init_module(admin: &signer) {
        let admin_addr = signer::address_of(admin);


        // Config
        
        move_to(admin, Config {
            admin: admin_addr,
            default_limit: 200_000000,     // 200 USDC (6 decimals)
            monthly_rate_bps: 200,         // 2% per 30 days (MVP)
            grace_period_secs: SECONDS_IN_30_DAYS,
        });

        // Events: create one GUID per handle
        move_to(admin, Events {
            user_registered: account::new_event_handle<UserRegisteredEvent>(admin),
            credit_limit_set: account::new_event_handle<CreditLimitEvent>(admin),
            disbursed: account::new_event_handle<DisbursedEvent>(admin),
            repaid: account::new_event_handle<RepaidEvent>(admin),
        });
    }

    /// -------------------
    /// INTERNAL ASSERTS
    /// -------------------

    fun assert_admin(admin: &signer) acquires Config {
        let c = borrow_global<Config>(@CreditManager);
        assert!(signer::address_of(admin) == c.admin, error::permission_denied(E_NOT_ADMIN));
    }

    /// -------------------
    /// USER FLOWS
    /// -------------------

    /// User registers as a borrower. Gets default limit.
    public entry fun register_user(user: &signer) acquires Config, Events {
        let addr = signer::address_of(user);
        assert!(!exists<Account>(addr), error::already_exists(E_ALREADY_REGISTERED));

        let c = borrow_global<Config>(@CreditManager);
        move_to(user, Account {
            credit_limit: c.default_limit,
            borrowed: 0,
            due_ts: 0,
            repaid_count: 0,
            registered: true,
        });

        let ev = borrow_global_mut<Events>(@CreditManager);
        event::emit_event(&mut ev.user_registered, UserRegisteredEvent { user: addr });
    }

    /// Borrower repays some/all of the outstanding principal.
    /// MVP: send USDC back to admin treasury (admin address).
    public entry fun repay(borrower: &signer, amount: u64)
        acquires Config, Account, Events
    {
        assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));

        let addr = signer::address_of(borrower);
        assert!(exists<Account>(addr), error::not_found(E_NOT_REGISTERED));

        let a = borrow_global_mut<Account>(addr);
        assert!(a.borrowed > 0, error::invalid_argument(E_NOTHING_BORROWED));

        let c = borrow_global<Config>(@CreditManager);

        // Transfer tokens from user back to admin (treasury)
        coin::transfer<USDC>(borrower, c.admin, amount);

        // Update accounting
        if (amount >= a.borrowed) {
            a.borrowed = 0;
            a.due_ts = 0;
            a.repaid_count = a.repaid_count + 1;
        } else {
            a.borrowed = a.borrowed - amount;
        };

        let ev = borrow_global_mut<Events>(@CreditManager);
        event::emit_event(&mut ev.repaid, RepaidEvent { payer: addr, amount, user: addr });
    }

    /// -------------------
    /// ADMIN FLOWS
    /// -------------------

    /// Admin sets/changes a user's credit limit.
    public entry fun set_credit_limit(admin: &signer, user: address, new_limit: u64)
        acquires Config, Account, Events
    {
        assert_admin(admin);
        assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

        let a = borrow_global_mut<Account>(user);
        a.credit_limit = new_limit;
        if (a.borrowed > new_limit) {
            // Safety: clamp borrowed down if somehow above limit
            a.borrowed = new_limit;
        };

        let ev = borrow_global_mut<Events>(@CreditManager);
        event::emit_event(&mut ev.credit_limit_set, CreditLimitEvent { user, new_limit });
    }

    /// Admin disburses tokens to a user (MVP: we mint to user).
    public entry fun disburse(admin: &signer, user: address, amount: u64)
        acquires Config, Account, Events
    {
        assert_admin(admin);
        assert!(amount > 0, error::invalid_argument(E_AMOUNT_ZERO));
        assert!(exists<Account>(user), error::not_found(E_NOT_REGISTERED));

        let a = borrow_global_mut<Account>(user);
        let avail = if (a.borrowed >= a.credit_limit) 0 else (a.credit_limit - a.borrowed);
        assert!(amount <= avail, error::out_of_range(E_OVER_LIMIT));

        a.borrowed = a.borrowed + amount;

        let c = borrow_global<Config>(@CreditManager);
        a.due_ts = timestamp::now_seconds() + c.grace_period_secs;

        // MVP: mint USDC to the user (works on devnet/testnet with your mint-cap)
        MockUSDCModule::mint(admin, user, amount);

        let ev = borrow_global_mut<Events>(@CreditManager);
        event::emit_event(&mut ev.disbursed, DisbursedEvent { user, amount });
    }


    #[view]
    public fun params(): (address, u64, u64, u64) acquires Config {
        let c = borrow_global<Config>(@CreditManager);
        (c.admin, c.default_limit, c.monthly_rate_bps, c.grace_period_secs)
    }

    #[view]
    public fun get_account(user: address): (u64, u64, u64, u64, bool) acquires Account {
        if (!exists<Account>(user)) {
            return (0, 0, 0, 0, false);
        };
        let a = borrow_global<Account>(user);
        (a.credit_limit, a.borrowed, a.due_ts, a.repaid_count, a.registered)
    }

    /// Available credit
    public fun available_credit(user: address): u64 acquires Account {
        if (!exists<Account>(user)) {
            return 0;
        };
        let a = borrow_global<Account>(user);
        if (a.borrowed >= a.credit_limit) 0 else (a.credit_limit - a.borrowed)
    }

    /// Simple overdue interest (integer months past due * monthly_rate_bps)
    public fun compute_interest(user: address): u64 acquires Config, Account {
        if (!exists<Account>(user)) return 0;

        let a = borrow_global<Account>(user);
        if (a.borrowed == 0 || a.due_ts == 0) return 0;

        let now = timestamp::now_seconds();
        if (now <= a.due_ts) return 0;

        let c = borrow_global<Config>(@CreditManager);
        let overdue_secs = now - a.due_ts;
        let months = overdue_secs / c.grace_period_secs; // integer months
        a.borrowed * c.monthly_rate_bps * months / 10_000
    }
}
