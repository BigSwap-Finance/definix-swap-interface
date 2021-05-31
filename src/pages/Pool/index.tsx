import ExchangeTab from 'components/ExchangeTab'
import FullPositionCard from 'components/PositionCard'
import Question from 'components/QuestionHelper'
import { StyledInternalLink } from 'components/Shared'
import { Dots } from 'components/swap/styleds'
import TransactionHistoryBox from 'components/TransactionHistoryBox'
import TranslatedText from 'components/TranslatedText'
import { usePairs } from 'data/Reserves'
import { Pair } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { Button, Card, Heading, Text } from 'uikit-dev'
import { LeftPanel, MaxWidthLeft, MaxWidthRight, RightPanel, ShowHideButton } from 'uikit-dev/components/TwoPanelLayout'
import { TranslateString } from 'utils/translateTextHelpers'
import Flip from '../../uikit-dev/components/Flip'
import AppBody from '../AppBody'

const TimerWrapper = ({ isPhrase2, date, children }) => {
  return isPhrase2 ? (
    children
  ) : (
    <>
      <div>
        <br />
        <Flip date={date} />
        <br />
        <br />
        <br />
      </div>
      <div
        tabIndex={0}
        role="button"
        style={{ opacity: 0.4, pointerEvents: 'none' }}
        onClick={(e) => {
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </div>
    </>
  )
}

export default function Pool() {
  const { account } = useActiveWeb3React()
  const [isShowRightPanel, setIsShowRightPanel] = useState(false)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const [isPhrase2, setIsPhrase2] = useState(false)
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  useEffect(() => {
    return () => {
      setIsShowRightPanel(false)
    }
  }, [])

  return (
    <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
      <LeftPanel isShowRightPanel={isShowRightPanel}>
        <MaxWidthLeft>
          <AppBody
            title={
              <Heading as="h1" fontSize="32px !important" className="mb-5" textAlign="left">
                EXCHANGE
              </Heading>
            }
          >
            <ExchangeTab current="/liquidity" />

            <div className="pa-6 bd-b">
              <div className="flex align-center mb-5">
                <Heading>Add liquidity to receive LP tokens</Heading>
                <Question text="" />
              </div>
              <Button id="join-pool-button" as={Link} to="/add/ETH" fullWidth radii="card">
                <TranslatedText translationId={100}>Add Liquidity</TranslatedText>
              </Button>
            </div>

            <div className="pa-6">
              <div className="flex align-center mb-5">
                <Heading fontSize="24px !important">
                  <TranslatedText translationId={102}>Your Liquidity</TranslatedText>
                </Heading>
                <Question
                  text={TranslateString(
                    130,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </div>

              {!account ? (
                <div className="pa-6">
                  <Text color="textSubtle" textAlign="center" fontSize="16px">
                    Connect to a wallet to view your liquidity.
                  </Text>
                </div>
              ) : v2IsLoading ? (
                <div className="pa-6">
                  <Text color="textSubtle" textAlign="center" fontSize="16px">
                    <Dots>Loading</Dots>
                  </Text>
                </div>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <div className="pa-6">
                  <Text color="textSubtle" textAlign="center" fontSize="16px">
                    <TranslatedText translationId={104}>No liquidity found.</TranslatedText>
                  </Text>
                </div>
              )}

              <div className="mt-4">
                <Text className="mb-2">
                  {TranslateString(106, "Don't see a pool you joined?")}{' '}
                  <StyledInternalLink id="import-pool-link" to="/find">
                    {TranslateString(108, 'Import it.')}
                  </StyledInternalLink>
                </Text>
                <Text>Or, if you staked your LP tokens in a farm, unstake them to see them here</Text>
              </div>
            </div>
          </AppBody>
        </MaxWidthLeft>
      </LeftPanel>
      <RightPanel isShowRightPanel={isShowRightPanel}>
        <ShowHideButton
          isShow={isShowRightPanel}
          action={() => {
            setIsShowRightPanel(!isShowRightPanel)
          }}
        />

        {isShowRightPanel && (
          <MaxWidthRight>
            <Heading fontSize="18px !important" className="mb-3">
              LIQUIDITY HISTORY
            </Heading>
            <Card style={{ overflow: 'auto' }}>
              {/* Mockup */}
              <TransactionHistoryBox
                firstCoin={undefined}
                secondCoin={undefined}
                title="Add Liquidity"
                withText="and"
                date="17 Apr 2021, 15:32"
              />
              <TransactionHistoryBox
                firstCoin={undefined}
                secondCoin={undefined}
                title="Remove Liquidity"
                withText="and"
                isFailed
                date="17 Apr 2021, 15:32"
              />
              <TransactionHistoryBox
                firstCoin={undefined}
                secondCoin={undefined}
                title="Remove Liquidity"
                withText="and"
                date="17 Apr 2021, 15:32"
              />
              {/* End Mockup */}
            </Card>
          </MaxWidthRight>
        )}
      </RightPanel>
    </TimerWrapper>
  )
}
