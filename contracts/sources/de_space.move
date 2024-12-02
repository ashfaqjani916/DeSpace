module MeetingGame::de_space {
    use aptos_framework::event;
    use std::signer;
    use aptos_std::table::{Self, Table};
    use aptos_framework::account;
    use std::string::{Self, String};
    use std::vector;

    struct GameHistory has store, drop, copy {
        result: String
    }

    struct PersonList has key {
        persons: Table<u64, Person>,
        meetings: Table<u64, Meeting>,
        set_person_event: event::EventHandle<Person>,
        set_meeting_event: event::EventHandle<Meeting>,
        set_game_event: event::EventHandle<GameHistory>,
        person_counter: u64,
        meeting_counter: u64
    }

    struct Person has store, drop, copy {
        person_id: u64,
        name: String,
        attendance_count: u64,
        meeting_ids: vector<u64>,
        game_history: vector<GameHistory>,
        address: address
    }

    struct Meeting has store, drop, copy {
        meeting_id: u64,
        creator_id: u64,
        attendees: vector<u64>,
        datetime: String
    }

    public entry fun initialize_list(account: &signer) {
        let list_holder = PersonList {
            persons: table::new(),
            meetings: table::new(),
            set_person_event: account::new_event_handle<Person>(account),
            set_meeting_event: account::new_event_handle<Meeting>(account),
            set_game_event: account::new_event_handle<GameHistory>(account),
            person_counter: 0,
            meeting_counter: 0
        };
        move_to(account, list_holder);
    }

    public entry fun create_person(account: &signer, name: String) acquires PersonList {
        let signer_address = signer::address_of(account);

        let person_list = borrow_global_mut<PersonList>(signer_address);
        let counter = person_list.person_counter + 1;
        
        let new_person = Person {
            person_id: counter,
            name,
            attendance_count: 0,
            meeting_ids: vector::empty<u64>(),
            game_history: vector::empty<GameHistory>(),
            address: signer_address
        };

        table::upsert(&mut person_list.persons, counter, new_person);
        person_list.person_counter = counter;
        event::emit_event(&mut person_list.set_person_event, new_person);
    }

    public entry fun create_meeting(account: &signer, creator_id: u64, datetime: String) acquires PersonList {
        let signer_address = signer::address_of(account);

        let person_list = borrow_global_mut<PersonList>(signer_address);

        let counter = person_list.meeting_counter + 1;
        let meeting_id = counter;

        let new_meeting = Meeting {
            meeting_id,
            creator_id,
            attendees: vector::empty<u64>(),
            datetime
        };

        table::upsert(&mut person_list.meetings, meeting_id, new_meeting);
        person_list.meeting_counter = counter;

        let creator = table::borrow_mut(&mut person_list.persons, creator_id);
        vector::push_back(&mut creator.meeting_ids, meeting_id);
        event::emit_event(&mut person_list.set_meeting_event, new_meeting);
    }

    public entry fun join_meeting(account: &signer, person_id: u64, meeting_id: u64) acquires PersonList {
        let signer_address = signer::address_of(account);

        let person_list = borrow_global_mut<PersonList>(signer_address);

        let meeting = table::borrow_mut(&mut person_list.meetings, meeting_id);

        vector::push_back(&mut meeting.attendees, person_id);

        let person = table::borrow_mut(&mut person_list.persons, person_id);
        person.attendance_count = person.attendance_count + 1;
        vector::push_back(&mut person.meeting_ids, meeting_id);
    }

    public entry fun play_spin_wheel(account: &signer, person_id: u64, result: String) acquires PersonList {
        let signer_address = signer::address_of(account);
        
        let person_list = borrow_global_mut<PersonList>(signer_address);

        let person = table::borrow_mut(&mut person_list.persons, person_id);
        let game_result = GameHistory { result };
        
        vector::push_back(&mut person.game_history, game_result);
        event::emit_event(&mut person_list.set_game_event, game_result);
    }

    #[view]
    public fun get_person_info(account_address: address, person_id: u64): (String, u64, vector<u64>, vector<GameHistory>) acquires PersonList {
        let person_list = borrow_global<PersonList>(account_address);
        let person = table::borrow(&person_list.persons, person_id);
        (
            person.name,
            person.attendance_count,
            *&person.meeting_ids,
            *&person.game_history
        )
    }

    #[view]
    public fun get_meeting_info(account_address: address, meeting_id: u64): (u64, vector<u64>, String) acquires PersonList {
        let person_list = borrow_global<PersonList>(account_address);
        let meeting = table::borrow(&person_list.meetings, meeting_id);
        (
            meeting.creator_id,
            *&meeting.attendees,
            *&meeting.datetime
        )
    }

    #[test_only]
    use std::string::utf8;

    #[test(admin = @0x123)]
    public entry fun test_initialization(admin: signer) {
        // Create test account
        account::create_account_for_test(signer::address_of(&admin));
        
        // Initialize list
        initialize_list(&admin);
        
        // Verify initialization
        assert!(exists<PersonList>(signer::address_of(&admin)), 0);
    }

    #[test(admin = @0x123)]
    public entry fun test_create_person(admin: signer) acquires PersonList {
        // Setup
        account::create_account_for_test(signer::address_of(&admin));
        initialize_list(&admin);
        
        // Create person
        let name = string::utf8(b"Alice");
        create_person(&admin, name);
        
        // Verify person creation
        let (person_name, attendance_count, meeting_ids, game_history) = get_person_info(signer::address_of(&admin), 1);
        assert!(string::bytes(&person_name) == b"Alice", 1);
        assert!(attendance_count == 0, 2); // attendance_count
        assert!(vector::length(&meeting_ids) == 0, 3); // meeting_ids
        assert!(vector::length(&game_history) == 0, 4); // game_history
    }

    #[test(admin = @0x123)]
    public entry fun test_create_meeting(admin: signer) acquires PersonList {
        // Setup
        account::create_account_for_test(signer::address_of(&admin));
        initialize_list(&admin);
        create_person(&admin, string::utf8(b"Alice"));
        
        // Create meeting
        let datetime = string::utf8(b"2024-12-01 10:00:00");
        create_meeting(&admin, 1, datetime);
        
        // Verify meeting creation
        let (creator_id, attendees, meeting_datetime) = get_meeting_info(signer::address_of(&admin), 1);
        assert!(creator_id == 1, 1); // creator_id
        assert!(vector::length(&attendees) == 0, 2); // attendees
        assert!(string::bytes(&meeting_datetime) == b"2024-12-01 10:00:00", 3);
    }

    #[test(admin = @0x123)]
    public entry fun test_join_meeting(admin: signer) acquires PersonList {
        // Setup
        account::create_account_for_test(signer::address_of(&admin));
        initialize_list(&admin);
        create_person(&admin, string::utf8(b"Alice")); // person_id: 1
        create_person(&admin, string::utf8(b"Bob")); // person_id: 2
        create_meeting(&admin, 1, string::utf8(b"2024-12-01 10:00:00")); // meeting_id: 1
        
        // Join meeting
        join_meeting(&admin, 2, 1); // Bob joins Alice's meeting
        
        // Verify meeting attendance
        let (_, attendees, _) = get_meeting_info(signer::address_of(&admin), 1);
        assert!(vector::length(&attendees) == 1, 1);
        assert!(*vector::borrow(&attendees, 0) == 2, 2);
        
        // Verify person's attendance count
        let (_, attendance_count, meeting_ids, _) = get_person_info(signer::address_of(&admin), 2);
        assert!(attendance_count == 1, 3);
        assert!(vector::length(&meeting_ids) == 1, 4);
    }

    #[test(admin = @0x123)]
    #[expected_failure(abort_code = E_CREATOR_CANT_JOIN)]
    public entry fun test_creator_cant_join_own_meeting(admin: signer) acquires PersonList {
        // Setup
        account::create_account_for_test(signer::address_of(&admin));
        initialize_list(&admin);
        create_person(&admin, string::utf8(b"Alice"));
        create_meeting(&admin, 1, string::utf8(b"2024-12-01 10:00:00"));
        
        // Try to join own meeting (should fail)
        join_meeting(&admin, 1, 1);
    }

    #[test(admin = @0x123)]
    public entry fun test_play_spin_wheel(admin: signer) acquires PersonList {
        // Setup
        account::create_account_for_test(signer::address_of(&admin));
        initialize_list(&admin);
        create_person(&admin, string::utf8(b"Alice"));
        
        // Play spin wheel
        play_spin_wheel(&admin, 1, string::utf8(b"WIN"));
        
        // Verify game history
        let (_, _, _, game_histories) = get_person_info(signer::address_of(&admin), 1);
        assert!(vector::length(&game_histories) == 1, 1);
        let game_history = vector::borrow(&game_histories, 0);
        assert!(string::bytes(&game_history.result) == b"WIN", 2);
    }
}