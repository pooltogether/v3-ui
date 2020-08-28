import React, { useContext, useState } from 'react'
import { letterFrequency } from '@vx/mock-data'
import { Group } from '@vx/group'
import * as allCurves from '@vx/curve'
import { LinePath } from '@vx/shape'
import generateDateValue, { DateValue } from '@vx/mock-data/lib/generators/genDateValue'
// import { scaleLinear, scaleBand } from '@vx/scale'
import ParentSize from '@vx/responsive/lib/components/ParentSize'
import { scaleTime, scaleLinear } from '@vx/scale'
import { extent, max } from 'd3-array'
import { LinearGradient } from '@vx/gradient'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'


// const curveTypes = Object.keys(allCurves)
// const lineCount = 1

export const gradientColor1 = '#ec4b5f'
export const gradientColor2 = '#4f0000' // '#b2305b'

// data accessors
const getX = (d) => d.date
const getY = (d) => d.value


const height = 200
const lineHeight = 100
const margin = {
  top: 20,
  bottom: 0,
  left: 20,
  right: 0,
}

export const Chart = (props) => {
  // const series = new Array(lineCount)
  //   .fill(null)
  //   .map(_ => generateDateValue(4))
  //   .map(line => {
  //     return [
  //       {
  //         date: new Date(98, 1),
  //         value: 100,
  //       },
  //       {
  //         date: new Date(),
  //         value: 400,
  //       }
  //     ]
  //   })

  const series = [
    [
      {
        date: new Date(98, 1),
        value: 100,
      },
      {
        date: new Date(2001, 1),
        value: 400,
      },
      {
        date: new Date(),
        value: 200,
      }
    ]
  ]

  // const hi = generateDateValue(25)
  // console.log(hi)

  console.log(series)
  const allData = series.reduce((rec, d) => rec.concat(d), [])

  


  // const curveType = 'curveBasisOpen'



  const themeContext = useContext(ThemeContext)
  const theme = themeContext.theme

  const foreColor = theme === 'light' ? '#BBB2CE' : '#f5f5f5'

  return <>
    <ParentSize className="graph-container" debounceTime={10}>
      {({ width }) => {
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
        // yScale.range([lineHeight - 2, 0])
        // xScale.range([0, width])

        return <>
          
          
          <svg width={width} height={height}>
            {/* <LinearGradient
              id="vx-curves-demo"
              from={gradientColor1}
              to={gradientColor2}
              rotate="-45"
            /> */}

            {/* <rect width={width} height={height} fill="url(#vx-curves-demo)" rx={14} ry={14} /> */}
            {width > 8 && series.map((lineData, i) => (
              <Group key={`lines-${i}`} top={i * lineHeight + margin.top}>
                <defs>
                  <LinearGradient
                    id="vx-gradient"
                    vertical={false} 
                  >
                    <stop offset="0%" stopColor="#ff9304"></stop>
                    <stop offset="10%" stopColor="#ff04ea"></stop>
                    <stop offset="20%" stopColor="#9b4beb"></stop>
                    <stop offset="30%" stopColor="#0e8dd6"></stop>
                    <stop offset="40%" stopColor="#3be8ff"></stop>
                    <stop offset="50%" stopColor="#07d464"></stop>
                    <stop offset="60%" stopColor="#ebf831"></stop>
                    <stop offset="78%" stopColor="#ff04ab"></stop>
                    <stop offset="90%" stopColor="#8933eb"></stop>
                    <stop offset="100%" stopColor="#3b89ff"></stop>
                  </LinearGradient>
                </defs>
{/* 

                <LinearGradient
                  from='#fbc2eb'
                  to='#a6c1ee'
                  id='vx-gradient'
                  vertical={false} 
                /> */}
                {lineData.map((d, j) => {
                  return <>
                    {/* <circle
                      key={i + j}
                      r={4}
                      cx={xScale(getX(d))}
                      cy={yScale(getY(d))}
                      // stroke="rgba(255,255,255,0.5)"
                      fill="red"
                    /> */}

                    <LinePath
                      // curve={allCurves[curveType]}
                      data={lineData}
                      x={d => xScale(getX(d))}
                      y={d => yScale(getY(d))}
                      stroke={"url(#vx-gradient)"}
                      // stroke={foreColor}
                      strokeWidth={3}
                      // shapeRendering="geometricPrecision"
                    />
                  </>
                })}
              </Group>
            ))}
          </svg>
        </>
      }}
    </ParentSize>
  </>
}
