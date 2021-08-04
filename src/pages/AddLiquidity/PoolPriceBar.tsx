import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Currency, Percent, Price } from 'definixswap-sdk'
import { Text } from 'uikit-dev'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const { t } = useTranslation()
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text fontWeight="bold">{price?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {currencies[Field.CURRENCY_B]?.symbol} {t('per')} {currencies[Field.CURRENCY_A]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text fontWeight="bold">{price?.invert()?.toSignificant(6) ?? '-'}</Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {currencies[Field.CURRENCY_A]?.symbol} {t('per')} {currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text fontWeight="bold" color="success">
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            {t('Share of Pool')}
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
