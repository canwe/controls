window.ITFormsData = {
  controls: [
      {
          type: "GridControl",
          label: 'Grid1',
          name: 'grid1',
          required: true,
          display: true ,
          enable: true,
          template: [
              { type: "TextBox", header: 'text box', value: "", required: false  },
              { type: "DropDownList", header: 'drop down', value: "", required: true, values: [ 'a', 'b', 'c']  },
              { type: "TextArea", header: 'text area', value: '"hello, world"', required: false }
          ],
          values: [
              [
                  { type: "TextBox", header: 'text box', value: "x", required: true  },
                  { type: "DropDownList", header: 'drop down', value: "a", required: true, values: [ 'a', 'b', 'c'] } ,
                  { type: "TextArea", header: 'text area', value: '"hello, world"', required: true }
              ],
              [
                  { type: "TextBox", header: 'text box', value: "x", required: true  },
                  { type: "DropDownList", header: 'drop down', value: "a", required: true, values: [ 'a', 'b', 'c'] } ,
                  { type: "TextArea", header: 'text area', value: '"hello, world"', required: true }
              ]

          ]
      },
      {
          type: "GridControl",
          label: 'Grid2',
          name: 'grid2',
          required: false,
          display: true,
          enable: true,
          template: [
              { type: "TextBox", header: 'text box', value: "", required: false  },
              { type: "TextArea", header: 'text area', value: "", required: true },
              { type: "CheckBox", header: 'check box', value: true, required: true },
          ]
      }


  ]
};

