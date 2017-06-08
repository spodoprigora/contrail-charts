/* global cc, describe, it, expect, beforeEach afterEach */

describe('Tooltip', () => {
  let config
  let chart
  let data
  let container = document.querySelector('#chart')

  beforeEach(() => {
    config = {
      id: 'chart',
      components: [{
        id: 'legend-id',
        type: 'LegendPanel',
        config: {
          editable: {
            color: true,
            chart: true,
          },
        },
      }, {
        id: 'compositey-chart-id',
        type: 'CompositeY',
        config: {
          update: ['navigation'],
          legend: 'legend-id',
          crosshair: 'crosshair-id',
          margin: {
            left: 16,
            right: 20,
          },
          height: 400,
          chartTypes: {
            y1: ['GroupedBar', 'StackedBar'],
            y2: ['Line'],
          },
          plot: {
            x: {
              accessor: 'x',
              labelFormatter: 'X Values',
              axis: 'x',
            },
            y: [
              {
                accessor: 'a',
                labelFormatter: 'Label A',
                chart: 'GroupedBar',
                axis: 'y1',
                tooltip: 'default-tooltip',
              }, {
                accessor: 'b',
                labelFormatter: 'Label B',
                chart: 'GroupedBar',
                axis: 'y1',
                tooltip: 'default-tooltip',
              }, {
                accessor: 'c',
                labelFormatter: 'Label C',
                disabled: true,
                chart: 'GroupedBar',
                axis: 'y1',
                tooltip: 'default-tooltip',
              }, {
                accessor: 'd',
                labelFormatter: 'Label D',
                color: '#d62728',
                chart: 'Line',
                axis: 'y2',
                tooltip: 'default-tooltip',
              }, {
                accessor: 'e',
                labelFormatter: 'Label E',
                color: '#9467bd',
                chart: 'Line',
                axis: 'y2',
                tooltip: 'default-tooltip',
              }
            ]
          },
          axes: {
            x: {
              scale: 'scaleLinear',
              label: 'X',
            },
            y1: {
              position: 'left',

              domain: [-10, undefined],
            },
            y2: {
              position: 'right',

            }
          },
        },
      }, {
        type: 'Navigation',
        config: {
          id: 'navigation',
          margin: {
            left: 16,
          },
          height: 200,
          selection: [75, 100],
          update: ['compositey-chart-id'],
          plot: {
            x: {
              accessor: 'x',
              labelFormatter: 'X Values',
            },
            y: [
              {
                accessor: 'a',
                labelFormatter: 'Label A',
                chart: 'StackedBar',
              }, {
                accessor: 'b',
                labelFormatter: 'Label B',
                chart: 'StackedBar',
              }, {
                accessor: 'd',
                labelFormatter: 'Label D',
                chart: 'Line',
              }
            ]
          },
          axis: {
            x: {
              scale: 'scaleLinear',
            },
            y: {

              ticks: 5,
            },
          }
        },
      }, {
        id: 'default-tooltip',
        type: 'Tooltip',
        config: {
          title: {
            accessor: 'x',
          },
          dataConfig: [
            {
              accessor: 'a',
              labelFormatter: 'Label A',

            }, {
              accessor: 'b',
              labelFormatter: 'Label B',

            }, {
              accessor: 'c',
              labelFormatter: 'Label C',

            }, {
              accessor: 'd',
              labelFormatter: 'Label D',

            }, {
              accessor: 'e',
              labelFormatter: 'Label E',

            }
          ]
        },
      }, {
        id: 'message-id',
        type: 'Message',
        config: {
        }
      }, {
        id: 'crosshair-id',
        type: 'Crosshair',
        config: {
          tooltip: 'default-tooltip',
        }
      }]}
    data = [
      {x: 0, a: 2, b: 1, c: 2, d: 1, e: 3},
      {x: 1, a: 3, b: 3, c: 4, d: 1, e: 4},
      {x: 2, a: 5, b: 4, c: 1, d: 2, e: 5},
      {x: 3, a: 1, b: 6, c: 2, d: 3, e: 2},
      {x: 4, a: 2, b: 0, c: 2, d: 4, e: 1},
      {x: 5, a: 0, b: 3, c: 0, d: 5, e: 1}
    ]
  })

  afterEach(() => {
    //while (container.firstChild) { container.firstChild.remove() }
  })

  describe('Render with minimal config.', () => {
    fit('123', () => {
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
    })
  })
})
