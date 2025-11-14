<?php

return [
    'modules' => [
        'Cases' => [
            'label' => 'Support Cases',
            'read_only' => false,
            'list_fields' => ['case_number', 'name', 'status', 'priority', 'date_entered'],
            'detail_fields' => ['case_number', 'name', 'status', 'priority', 'description', 'date_entered', 'date_modified'],
            'editable_fields' => ['status', 'priority', 'description'],
            'filters' => [
                'contacts.id' => 'contact_id_session',
            ],
        ],
        'Notes' => [
            'label' => 'Notes',
            'read_only' => false,
            'list_fields' => ['name', 'contact_name', 'date_entered'],
            'detail_fields' => ['name', 'description', 'date_entered', 'date_modified'],
            'editable_fields' => ['name', 'description'],
            'filters' => [
                'contact_id' => 'contact_id_session',
            ],
        ],
    ],
];
