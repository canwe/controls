var controldata = [
    {
        name: 'test1',
        _value: {},
        type: 'UnitTestControl',
        display: true,
        enabled: true
    },
    {
        name: 'grid',
        required: true,
        startwithsinglerow: true,
        showaddbutton: true,
        showremovebuttons: true,
        showgridlineshorizontal: true,
        template: [
            { type: 'textbox', title: 'TextBox', placeholder: 'enter text', required: false, enabled: true },
            { type: 'checkbox', title: 'CheckBox', value: true, required: true, enabled: true },
            { type: 'date', title: 'Date', placeholder: 'enter text', required: true, enabled: true },
            { type: 'paragraph', title: 'Paragraph', value: '<h3>hello</h3>', required: true, enabled: true },
            { type: 'textarea', title: 'TextArea', value: 'Hello', placeholder: 'enter text', required: true, enabled: true },
            { type: 'dropdownlist', title: 'Dropdownlist', value: 'c',  values: [ 'a', 'b', 'c' ], placeholder: 'enter text', required: true, enabled: false }
        ],
        values: [
//            [ { value: 'a1', type: 'textarea' }, { value: 'a2', type: 'textbox' }, { value: true, type: 'checkbox' }],
//            [ { value: 'a1', type: 'date' }, { value: 'a2', type: 'textbox' }, { value: 'a3', type: 'textbox' }],
//            [ { value: true, type: 'checkbox' }, { value: 'a2', type: 'textbox' }, { value: 'a3', type: 'textbox' }],
//            [ { value: 'a1', type: 'paragraph' }, { value: 'a2', type: 'textbox' }, { value: 'a3', type: 'textbox' }]
        ],
        type: 'GridControl',
        label: 'Grid',
        display: true,
        enabled: true,
        readonly: false
    },
    {
        name: 'selectc',
        label: 'Columns',
        columncount: 6,
        values: [
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'c', checked: true },
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true },
            { value: 'a', checked: true }
        ],
        type: 'MultiSelectControl',
        style: 'columns',
        display: true,
        enabled: true
    },
    {
        name: 'selecta',
        label: 'One Per Line',
        values: [
            { value: 'a', checked: true },
            { value: 'b', checked: false },
            { value: 'c', checked: true }
        ],
        type: 'MultiSelectControl',
        style: 'oneperline',
        display: true,
        enabled: true
    },
    {
        name: 'selectb',
        label: 'Compact',
        values: [
            { value: '1', checked: true },
            { value: '2', checked: false },
            { value: '3', checked: true }
        ],
        type: 'MultiSelectControl',
        style: 'compact',
        display: true,
        enabled: true
    },
    {
        name: 'girls',
        values: ['Tamsin', 'Bridget', 'hide'],
        type: 'ListControl',
        display: true,
        enabled: true
    },
    {
        name: 'boys',
        values: ['Jacob', 'Alex', 'Henry'],
            type: 'ListControl',
        display: true,
        enabled: true
    },
    {
        name: 'isrequired',
        _value: true,
        type: 'CheckboxControl',
        display: true,
        enabled: true,
        required: true
    },
    {
        name: 'isrequired2',
        _value: false,
        type: 'CheckboxControl',
        display: true,
        enabled: true
    }
];

ITForms.FormData = {
    formdata: { teamslug: 'demo', formslug: 'demo', requestid: 0 },
    controldata: controldata,
    csbdata: [
        {
          //  format:'{0}',
            conditions: [
                { evaluator: 'control', object: 'isrequired', member: 'value', operator: 'equals', value: true }
            ],
            actions: [
                { target: 'isrequired2', whentrue: 'show', whenfalse: 'hide' }
            ]
        },
        {
            format: '{0} && {1}',
            conditions: [
                { evaluator: 'control', object: 'isrequired2', member: 'value', operator: 'equals', value: true },
                { evaluator: 'control', object: 'isrequired2', member: 'display', operator: 'equals', value: true }
            ],
            actions: [
                { target: 'girls', whentrue: 'show', whenfalse: 'hide' }
            ]
        },
        {
            format: '{0} && {1}',
            conditions: [
                { evaluator: 'control', object: 'girls', member: 'value', operator: 'contains', value: 'dis'},
                { evaluator: 'control', object: 'girls', member: 'value', operator: 'contains', value: 'able'}
            ],
            actions: [
                { target: 'boys', whentrue: 'disable', whenfalse: 'enable' }
            ]
        },
        {
            format: '{0}',
            conditions: [
                { evaluator: 'control', object: 'girls', member: 'value', operator: 'contains', value: 'hide'}
            ],
            actions: [
                { target: 'boys', whentrue: 'hide', whenfalse: 'show' }
            ]
        },
        {
            conditions: [
                { evaluator: 'control', object: 'isrequired2', member: 'display', operator: 'equals', value: true },
                { evaluator: 'control', object: 'boys', member: 'display', operator: 'equals', value: true }
            ],
            actions: [
                { target: 'test1', whentrue: 'pass', whenfalse: 'fail'},
                { target: 'test1', whentrue: '[test1].label=\'Test1 passed\'', whenfalse: '[test1].label=\'Test1 failed\''}
            ]
        },
        {
            triggers: [ { object: '*', member: 'enabled'} ],
            executeonpageload: false,
            conditions: [   { evaluator: 'javascript' }],
            actions: [
              //  { whentrue: 'alert(\'enabled changed\');' }
            ]

        }
    ]
};
