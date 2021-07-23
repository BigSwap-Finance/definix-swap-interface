import React from 'react'
import Lottie from 'react-lottie'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text } from 'uikit-dev'
import loading from 'uikit-dev/animation/loading.json'

const TextCenter = styled(Text)`
  position: absolute;
  bottom: calc(50% - 48px);
  left: 50%;
  transform: translate(-50%, 0);
`

const ConfirmationPendingContent = ({ pendingIcon }) => {
  const options = {
    loop: true,
    autoplay: true,
    animationData: pendingIcon || loading,
  }
  const { t } = useTranslation()
  return (
    <div className="flex align-center justify-center pa-6" style={{ position: 'relative', height: '400px' }}>
      <Lottie options={options} height={120} width={120} />
      {pendingIcon && <TextCenter color="textSubtle">{t('Progressing')}…</TextCenter>}
    </div>
  )
}

export default ConfirmationPendingContent
