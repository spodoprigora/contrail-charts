/* global cc, describe, it, expect, beforeEach afterEach */
describe('Navigation', () => {
  let config
  let chart
  let data
  let container = document.querySelector('#chart')

  beforeEach(() => {
    config = {
      id: 'chart',
      components: [{
        id: 'compositey-chart-id',
        type: 'CompositeY',
        config: {
          duration: 0,
          margin: {
            left: 16,
            right: 20,
          },
          height: 400,
          chartTypes: {
            y1: ['Line'],
          },
          plot: {
            x: {
              accessor: 'x',
              labelFormatter: 'X Values',
              axis: 'x',
            },
            y: [
              {
                accessor: 'y',
                labelFormatter: 'Label Y',
                color: '#d62728',
                chart: 'Line',
                axis: 'y1',
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
              domain: [0, 2],
            }
          },
        },
      }, {
        id: 'nav',
        type: 'Navigation',
        duration: 0,
        config: {
          duration: 0,
          margin: {
            left: 16,
          },
          height: 200,
          update: ['compositey-chart-id'],
          plot: {
            x: {
              accessor: 'x',
              labelFormatter: 'X Values',
            },
            y: [
              {
                accessor: 'y',
                labelFormatter: 'Label Y',
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
      }]
    }
    data = [
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 2},

    ]
  })

  afterEach(() => {
    while (container.firstChild) { container.firstChild.remove() }
  })

  describe('Render with minimal config.', () => {
    // TODO
    xit('should show half line', (done) => {
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let navClipPath = container.querySelector('#nav clipPath rect')
      let navWidth = navClipPath.getBoundingClientRect().width
      let brush = chart.composite._components[1]._brush
      brush.config.set('selection', [navWidth / 2, navWidth])
      let line = container.querySelector('#compositey-chart-id-y1-y path.line')

      setTimeout(() => {
        let d = line.getAttribute('d')
        let lineStartPoint = getPathStartPoint(d)
        let lineEndPoint = getPathEndPoint(d)
        expect(Math.abs(lineStartPoint.split(',')[0])).toBe(+lineEndPoint.split(',')[0])
        done()
      }, 0)
    })
  })

  describe('Render with non-default config.', () => {
    it('should show half line with selection in config', (done) => {
      config.components[1].config.selection = [50, 100]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let line = container.querySelector('#compositey-chart-id-y1-y path.line')

      setTimeout(() => {
        let d = line.getAttribute('d')
        let lineStartPoint = getPathStartPoint(d)
        let lineEndPoint = getPathEndPoint(d)
        expect(Math.abs(lineStartPoint.split(',')[0])).toBe(+lineEndPoint.split(',')[0])
        done()
      }, 0)
    })

    it('should show full line with selection in config', (done) => {
      config.components[1].config.selection = [0, 100]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let line = container.querySelector('#compositey-chart-id-y1-y path.line')

      setTimeout(() => {
        let d = line.getAttribute('d')
        let lineStartPoint = getPathStartPoint(d)
        let lineEndPoint = getPathEndPoint(d)
        let chartClipPath = container.querySelector('#compositey-chart-id clipPath rect')
        let chartWidth = chartClipPath.getBoundingClientRect().width
        expect(lineStartPoint.split(',')[0]).toBe('0')
        expect(+lineEndPoint.split(',')[0]).toBe(chartWidth)
        done()
      }, 0)
    })

    it('should show full line after changing the selection', (done) => {
      config.components[1].config.selection = [50, 100]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let line = container.querySelector('#compositey-chart-id-y1-y path.line')
      let navClipPath = container.querySelector('#nav clipPath rect')
      let navWidth = navClipPath.getBoundingClientRect().width
      let brush = chart.composite._components[1]._brush
      brush.config.set('selection', [0, navWidth])

      setTimeout(() => {
        let d = line.getAttribute('d')
        let lineStartPoint = getPathStartPoint(d)
        let lineEndPoint = getPathEndPoint(d)
        let chartClipPath = container.querySelector('#compositey-chart-id clipPath rect')
        let chartWidth = chartClipPath.getBoundingClientRect().width
        expect(lineStartPoint.split(',')[0]).toBe('0')
        expect(+lineEndPoint.split(',')[0]).toBe(chartWidth)
        done()
      }, 0)
    })

    it('reset navigation selection after click on chart', (done) => {
      config = {
        id: 'chart',
        components: [{
          id: 'multishape-bubble-chart',
          type: 'CompositeY',
          config: {
            bucket: 'bucket-id',
            update: ['navigation-id'],
            height: 450,
            plot: {
              x: {
                accessor: 'x',
                axis: 'x',
              },
              y: [
                {
                  accessor: 'y',
                  label: 'Data 1',
                  chart: 'ScatterPlot',
                  size: {
                    accessor: 'size1',
                    range: [100, 1000],
                  },
                  shape: 'Y',
                  color: d => 'red',
                  axis: 'y1'
                }
              ]
            },
            axes: {
              x: {},
              y1: {
                position: 'left',
                label: 'Y value of circles',
              }
            },
          }
        }, {
          id: 'bucket-id',
          type: 'Bucket',
          config: {
            range: [500, 800],
            shape: 'X',
          }
        }, {
          id: 'navigation-id',
          type: 'Navigation',
          config: {
            height: 200,
            selection: [50, 100],
            update: ['multishape-bubble-chart'],
            plot: {
              x: {
                accessor: 'x',
              },
              y: [
                {
                  accessor: 'y',
                  chart: 'Line',
                  color: 'grey',
                }
              ]
            },
            axes: {
              x: {},
              y: {
                ticks: 6,
              },
            }
          }
        }]
      }
      data = [
        {x: 0, y: 0, size1: 1},
        {x: 1, y: 1, size1: 2},
        {x: 2, y: 2, size1: 3}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)

      setTimeout(() => {
        let svg = container.querySelector('svg')
        let event = new Event('click', {bubbles: true})
        svg.dispatchEvent(event)
        let selection = container.querySelector('rect.selection')
        let display = selection.style.display
        expect(display).toBe('none')
        done()
      }, 0)
    })
  })
})
