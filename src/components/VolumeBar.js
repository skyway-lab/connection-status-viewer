import React from 'react'
import { VolumeIndicator } from '../utils/Volumeindicator'

export default class VolumeBar extends React.Component {
  componentDidMount() {
    if (!this.props.stream) {
      return
    }
    const stream = this.props.stream
    const canvas = this.refs.canvas
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const audioCtx = new AudioContext()

    // create indicator
    const indicator = new VolumeIndicator(audioCtx, canvas)

    // connect to audio context
    const source = audioCtx.createMediaStreamSource(stream)
    source.connect(indicator.node)
  }

  render() {
    return (
      <div>
        <canvas
          ref="canvas"
          style={style}>
        </canvas>
      </div>
    )
  }
}


const style = {
  width: 300,
  height: 30,
};
