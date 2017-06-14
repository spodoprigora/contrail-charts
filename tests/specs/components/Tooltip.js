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
      {x: 0, a: 2.5},
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

    it('checking the title of the tooltip', (done) => {
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let bars = container.querySelectorAll('rect.bar')

      observe('attr', bars[bars.length - 1], 'height', () => {
        let barRect = bars[0].getBoundingClientRect()
        let eventPoint = {x: Math.ceil(barRect.left), y: Math.ceil(barRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        bars[0].dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip')
        let tooltipTitle = tooltip.querySelector('.cc-title').textContent
        expect(+tooltipTitle).toBe(data[0].x)
        done()
      })
    })

    it('checking the value of the tooltip', (done) => {
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let bars = container.querySelectorAll('rect.bar')

      observe('attr', bars[bars.length - 1], 'height', () => {
        let barRect = bars[0].getBoundingClientRect()
        let eventPoint = {x: Math.ceil(barRect.left), y: Math.ceil(barRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        bars[0].dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip .tooltip-item')
        let tooltipLabel = tooltip.querySelector('.tooltip-item-label').textContent
        let tooltipValue = tooltip.querySelector('.tooltip-item-value').textContent

        expect(tooltipLabel).toBe(config.components[1].config.dataConfig[0].accessor)
        expect(+tooltipValue).toBe(data[0].a)
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

    it('horizontal right', (done) => {
      config.components[1].config.placement = 'horizontal'
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

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX + margin)
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

    it('horizontal left', (done) => {
      config.components[1].config.placement = 'horizontal'
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let bars = container.querySelectorAll('rect.bar')
      let lastBar = bars[bars.length - 1]

      observe('attr', lastBar, 'height', () => {
        let lastBarRect = lastBar.getBoundingClientRect()
        let eventPoint = {x: Math.ceil(lastBarRect.left), y: Math.ceil(lastBarRect.top)}
        let event = new MouseEvent('mousemove', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        lastBar.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width - margin)
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

    it('horizontal center', (done) => {
      container.style.width = '250px'
      config.components[1].config.placement = 'horizontal'
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

  describe('cheking correctnes tooltip position for Line', () => {
    it('vertical top', (done) => {
      config.components[0].config.plot.y[0].chart = 'Line'
      data = [
        {x: 0, a: 0},
        {x: 1, a: 1},
        {x: 2, a: 2}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let eventPoint = {x: lineRect.left, y: lineRect.bottom}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height - margin)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })

    it('horizontal right', (done) => {
      config.components[1].config.placement = 'horizontal'
      config.components[0].config.plot.y[0].chart = 'Line'
      data = [
        {x: 0, a: 0},
        {x: 1, a: 1},
        {x: 2, a: 2}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let eventPoint = {x: lineRect.left, y: lineRect.bottom}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX + margin)
        done()
      })
    })

    it('vertical bottom', (done) => {
      config.components[0].config.plot.y[0].chart = 'Line'
      data = [
        {x: 0, a: 0},
        {x: 1, a: 1},
        {x: 2, a: 2}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let eventPoint = {x: lineRect.right, y: lineRect.top}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY + margin)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })

    it('horizontal left', (done) => {
      config.components[1].config.placement = 'horizontal'
      config.components[0].config.plot.y[0].chart = 'Line'
      data = [
        {x: 0, a: 0},
        {x: 1, a: 1},
        {x: 2, a: 2}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let margin = 10
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let eventPoint = {x: lineRect.right, y: lineRect.top}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width - margin)
        done()
      })
    })

    it('vertical center', (done) => {
      config.components[0].config.plot.y[0].chart = 'Line'
      config.components[0].config.height = 120
      data = [
        {x: 0, a: 1},
        {x: 1, a: 2},
        {x: 2, a: 0}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let lineD = line.getAttribute('d')
        let startLinePoint = getPathStartPoint(lineD).split(',')

        let eventPoint = {x: lineRect.left, y: lineRect.top + +startLinePoint[1] + 8}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })

    it('horizontal center', (done) => {
      container.style.width = '250px'
      config.components[1].config.placement = 'horizontal'
      config.components[0].config.plot.y[0].chart = 'Line'
      config.components[0].config.height = 120
      data = [
        {x: 0, a: 1},
        {x: 1, a: 2},
        {x: 2, a: 0}
      ]
      chart = new cc.composites.CompositeView({config, container})
      chart.setData(data)
      let line = container.querySelector('path.line')

      observe('attr', line, 'd', () => {
        let lineRect = line.getBoundingClientRect()
        let lineD = line.getAttribute('d')
        let startLinePoint = getPathStartPoint(lineD).split(',')

        let eventPoint = {x: lineRect.left, y: lineRect.top + +startLinePoint[1] + 8}
        let event = new MouseEvent('mouseover', {
          bubbles: true,
          clientX: eventPoint.x,
          clientY: eventPoint.y
        })
        line.dispatchEvent(event)
        let tooltip = container.querySelector('.tooltip-content')
        let tooltipRect = tooltip.getBoundingClientRect()

        expect(tooltipRect.top).toBeCloseTo(event.offsetY - tooltipRect.height / 2)
        expect(tooltipRect.left).toBeCloseTo(event.offsetX - tooltipRect.width / 2)
        done()
      })
    })
  })
})
