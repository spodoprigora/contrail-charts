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
        id: 'compositey-chart-id',
        type: 'CompositeY',
        config: {
          duration: 0,
          chartTypes: {
            y1: ['Line']
          },
          plot: {
            x: {
              accessor: 'x'
            },
            y: [
              {
                accessor: 'a',
                chart: 'GroupedBar',
                axis: 'y1',
                tooltip: 'default-tooltip',
              }
            ]
          },
          axes: {
            x: {},
            y1: {}
          },
        },
      }, {
        id: 'default-tooltip',
        type: 'Tooltip',
        config: {
          title: {accessor: 'x'},
          dataConfig: [{accessor: 'a'}]
        }
      }]}
    data = [
      {x: 0, a: 2},
      {x: 1, a: 3},
      {x: 2, a: 5},
      {x: 3, a: 1},
      {x: 4, a: 2}
    ]
  })

  afterEach(() => {
    while (container.firstChild) { container.firstChild.remove() }
  })

  describe('Render with minimal config.', () => {
    it('show tooltip on mousemove over bars', (done) => {
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let bar = container.querySelector('rect.bar')

      observe('attr', bar, 'height', () => {
        let barRect = bar.getBoundingClientRect()
        let eventPoint = {x: Math.ceil(barRect.left), y: Math.ceil(barRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        bar.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip.active')
        expect(tooltip).not.toBeNull()
        done()
      })
    })
  })

  describe('cheking correctnes tooltip position for Grouped Bar', () => {
    it('vertical top', (done) => {
      // vertical is default position
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let firstBar = container.querySelector('rect.bar')

      observe('attr', firstBar, 'height', () => {
        let firstBarRect = firstBar.getBoundingClientRect()
        let eventPoint = {x: Math.ceil(firstBarRect.left), y: Math.ceil(firstBarRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        firstBar.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height - margin)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })

    it('vertical bottom', (done) => {
      // tooltip for higest bar
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let higestBar = container.querySelectorAll('rect.bar')[2]

      observe('attr', higestBar, 'height', () => {
        let higestBarRect = higestBar.getBoundingClientRect()
        let eventPoint = {x: Math.ceil(higestBarRect.left), y: Math.ceil(higestBarRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        higestBar.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY + margin)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })

    it('vertical center', (done) => {
      config.components[0].config.height = 150
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let firstBar = container.querySelector('rect.bar')

      observe('attr', firstBar, 'height', () => {
        let firstBarRect = firstBar.getBoundingClientRect()
        let eventPoint = {x: Math.ceil(firstBarRect.left), y: Math.ceil(firstBarRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        firstBar.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })
  })
})
