import { Currency } from 'definixswap-sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  margin-right: ${({ sizeraw, margin }) => margin && `${(sizeraw / 3 + 8).toString()  }px`};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      {currency0 && <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{zIndex: 2, marginRight: `${size / 1.5}px`}} />}
      {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} style={{position: 'absolute', left: `${size / 1.5}px`}}/>}
    </Wrapper>
  )
}
