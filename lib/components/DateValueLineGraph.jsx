import React, { useContext } from 'react'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { Group } from '@vx/group'
import { LinePath } from '@vx/shape'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@vx/tooltip';
import { scaleTime, scaleLinear } from '@vx/scale'
import { extent, max } from 'd3-array'
import { LinearGradient } from '@vx/gradient'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'
import { formatDate } from 'lib/utils/formatDate'

// data accessors
const getX = (d) => d.date
const getY = (d) => d.value

// const height = 200
const margin = {
  top: 20,
  bottom: 0,
  left: 20,
  right: 20,
}

export const DateValueLineGraph = (props) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip()

  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme

  const circleColor = theme === 'light' ? '#401C94' : '#ffffff'

  const series = props.data
  const allData = series.reduce((rec, d) => rec.concat(d), [])

  return <>
    <div className='h-32 sm:h-20'>
      <ParentSize className='graph-container' debounceTime={10}>
        {({ height, width }) => {
          const xMax = width - margin.left - margin.right
          const yMax = height - margin.top - margin.bottom

          // scales
          const xScale = scaleTime({
            range: [0, xMax],
            domain: extent(allData, getX),
          })
          const yScale = scaleLinear({
            range: [yMax, 0],
            domain: [0, max(allData, getY)],
          })

          return <>
            {tooltipOpen && tooltipData && <>
              <TooltipWithBounds
                key={Math.random()}
                top={tooltipTop}
                left={tooltipLeft}
                className='vx-chart-tooltip'
              >
                {props.valueLabel || 'Value'}: <strong>{tooltipData.value}</strong>
                <span className='block mt-2'>
                  Date: <strong>{formatDate(
                    Date.parse(tooltipData.date),
                    {
                      short: true
                    }
                  )}
                  </strong>
                </span>
              </TooltipWithBounds>
            </>}

            <svg width={width} height={height}>
              {width > 8 && series.map((lineData, i) => (
                <Group
                  key={`lines-${i}`}
                  left={margin.left}
                  right={margin.right}
                  top={margin.top}
                >
                    <LinearGradient
                      id='vx-gradient'
                      vertical={false} 
                    >
                      <stop offset='0%' stopColor='#ff9304'></stop>
                      <stop offset='10%' stopColor='#ff04ea'></stop>
                      <stop offset='20%' stopColor='#9b4beb'></stop>
                      <stop offset='30%' stopColor='#0e8dd6'></stop>
                      <stop offset='40%' stopColor='#3be8ff'></stop>
                      <stop offset='50%' stopColor='#07d464'></stop>
                      <stop offset='60%' stopColor='#ebf831'></stop>
                      <stop offset='78%' stopColor='#ff04ab'></stop>
                      <stop offset='90%' stopColor='#8933eb'></stop>
                      <stop offset='100%' stopColor='#3b89ff'></stop>
                    </LinearGradient>


                  {lineData.map((data, j) => {
                    return <>
                      <LinePath
                        data={lineData}
                        x={d => xScale(getX(d))}
                        y={d => yScale(getY(d))}
                        stroke={'url(#vx-gradient)'}
                        strokeWidth={3}
                      />
                    </>
                  })}

                  {lineData.map((data, j) => {
                    return <>
                      <circle
                        key={i + j}
                        r={4}
                        cx={xScale(getX(data))}
                        cy={yScale(getY(data))}
                        stroke={circleColor}
                        fill={circleColor}
                        className='cursor-pointer'
                        onMouseLeave={hideTooltip}
                        onMouseMove={(event) => {
                          showTooltip({
                            tooltipLeft: event.clientX - 50,
                            tooltipTop: event.clientY - 150,
                            tooltipData: data
                          })
                        }}
                      />
                    </>
                  })}

                </Group>
              ))}
            </svg>
          </>
        }}
      </ParentSize>
    </div>
  </>
}
