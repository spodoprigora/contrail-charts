/* global cc, describe, it, expect, beforeEach afterEach */

describe('Grouped Bar chart view', () => {
  let config
  let chart
  let data
  let container = document.querySelector('#chart')

  beforeEach(() => {
    config = {
      margin: {
        top: 10,
      },
      x: {
        accessor: 'x',
        labelFormatter: 'Value',
      },
      y: [
        {
          accessor: 'a',
          labelFormatter: 'Label Group.A',
        }, {
          accessor: 'b',
          labelFormatter: 'Label B',
          color: d => d.a > 50 ? 'red' : undefined
        }
      ]
    }
    data = [
      { x: 0, a: 0, b: 0 },
      { x: 1, a: 2, b: 4 },
      { x: 2, a: 4, b: 8 },
      { x: 3, a: 6, b: 12 },
      { x: 4, a: 8, b: 16 },
    ]
    chart = new cc.components.GroupedBarView({config, container})
  })

  afterEach(() => {
    while (container.firstChild) { container.firstChild.remove() }
  })

  it('Grouped Bar chart should be rendered', () => {
    chart.setData(data)
    debugger
    expect(chart.el.querySelectorAll('.bar').length).toEqual(data)
  })


})

