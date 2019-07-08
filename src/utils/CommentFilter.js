export function filterComment(stats) {
  const comments = []

  // send audio
  if (stats.send.audio.bitrate !== null && stats.send.audio.bitrate < 10000) {
    comments.push({
      msg: '送信音声のビットレートが低いです。ネットワークを確認し、必要なら映像を切ってください',
      type: 'send'
    })
  }
  //if (stats.send.audio.audioLevel !== null && stats.send.audio.audioLevel === 0) {
  //  comments.push({
  //    msg: '送信音声の音量が0です. マイク入力をご確認ください *ブラウザのバグにより、この値は常に0です*',
  //    type: 'send'
  //  })
  //}
  if (stats.send.audio.jitter !== null && stats.send.audio.jitter > 0.1) {
    comments.push({
      msg: '音声送信の揺らぎが大きく、声が聞こえづらいかもしれません',
      type: 'send'
    })
  }
  if (stats.send.audio.rtt !== null && stats.send.audio.rtt > 0.1) {
    comments.push({
      msg: '音声送信の遅延が著しく大きくなっています。ネットワークをご確認ください',
      type: 'send'
    })
  }

  // send video
  if (stats.send.video.bitrate !== null && stats.send.video.bitrate < 10000) {
    comments.push({
      msg: '送信映像のビットレートが低いです。ネットワークを確認し、必要なら音声を切ってください',
      type: 'send'
    })
  }
  if (stats.send.video.qpValue !== null && stats.send.video.qpValue < 10) {
    comments.push({
      msg: '送信映像の動きが少ないように見えます。正しい状態ですか？',
      type: 'send'
    })
  }
  if (stats.send.video.jitter !== null && stats.send.video.jitter > 0.1) {
    comments.push({
      msg: '映像送信の揺らぎが大きくなっています',
      type: 'send'
    })
  }
  if (stats.send.video.rtt !== null && stats.send.video.rtt > 0.1) {
    comments.push({
      msg: '映像送信の遅延が著しく大きくなっています',
      type: 'send'
    })
  }

  // receive audio
  if (stats.receive.audio.bitrate !== null && stats.receive.audio.bitrate < 10000) {
    comments.push({
      msg: '受信音声のビットレートが低いです。必要なら映像を切ってください',
      type: 'receive'
    })
  }
  if (stats.receive.audio.fractionLost !== null && stats.receive.audio.fractionLost > 0.03) {
    comments.push({
      msg: '受信音声のパケットのロス率が高いです',
      type: 'receive'
    })
  }
  if (stats.receive.audio.audioLevel !== null && stats.receive.audio.audioLevel < 0.1) {
    comments.push({
      msg: '受信音声の音量が小さいです。正しい状態でない場合、相手に伝えるといいかもしれません',
      type: 'receive'
    })
  }
  if (stats.receive.audio.jitterBufferDelay !== null && stats.receive.audio.jitterBufferDelay > 0.5) {
    comments.push({
      msg: '音声再生に必要な情報の受信に大きな遅延が出ています',
      type: 'receive'
    })
  }

  // receive video
  if (stats.receive.video.bitrate !== null && stats.receive.video.bitrate < 10000) {
    comments.push({
      msg: '受信映像のビットレートが低いです。ネットワークを確認し、必要なら音声を切ってください',
      type: 'receive'
    })
  }
  if (stats.receive.video.fractionLost !== null && stats.receive.video.fractionLost > 0.03) {
    comments.push({
      msg: '受信映像パケットのロス率が高いです',
      type: 'receive'
    })
  }
  if (stats.receive.video.qpValue !== null && stats.receive.video.qpValue < 10) {
    comments.push({
      msg: '相手の映像の動きが小さいです',
      type: 'receive'
    })
  }
  if (stats.receive.video.jitterBufferDelay !== null && stats.receive.video.jitterBufferDelay > 0.5) {
    comments.push({
      msg: '映像再生に必要な情報の受信に大きな遅延が出ています',
      type: 'receive'
    })
  }

  // candidate-pair
  if (stats.candidatePair.upstreamBitrate !== null && stats.candidatePair.upstreamBitrate < 500 * 1000) {
    comments.push({
      msg: '上り通信が遅いです',
      type: 'transport'
    })
  }
  if (stats.candidatePair.downstreamBitrate !== null && stats.candidatePair.downstreamBitrate < 500 * 1000) {
    comments.push({
      msg: '下り通信が遅いです',
      type: 'transport'
    })
  }
  if (stats.candidatePair.rtt !== null && stats.candidatePair.rtt > 0.1) {
    comments.push({
      msg: '遅延が大きいです',
      type: 'transport'
    })
  }

  // return warningStatsList
  return comments
}
