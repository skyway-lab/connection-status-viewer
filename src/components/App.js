import React from 'react';
import './App.css';
import CommentList from './CommentList'
import MediaHandler from '../utils/MediaHandler'
import VolumeBar from './VolumeBar'
import Peer from 'skyway-js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      peer: {},
      remoteId: '',
      localId: '',
      localStream: null,
      remoteStream: null,
      mediaConnection: null
    }
    this.input = React.createRef()
    this.localVideo = React.createRef()
    this.remoteVideo = React.createRef()

    this.MediaHandler = new MediaHandler()
    this.onCall = this.onCall.bind(this)
    this.onClose = this.onClose.bind(this)
    this.renderVolumeBar = this.renderVolumeBar.bind(this)
  }

  componentDidMount() {
    this.MediaHandler.getPermissions()
      .then(stream => {
        this.setState({localStream: stream})
        try {
          this.localVideo.muted = true
          this.localVideo.srcObject = stream
        } catch(e) {
          console.error(e)
          this.localVideo.src = URL.createObjectURL(stream)
        }
        this.localVideo.play()
      })
    this.startPeer()
  }

  startPeer() {
    const url = new URL(window.location.href);
    const peerId = url.searchParams.get('peerId');

    let peer;
    const pcConfig = {
      key: '<YOUR APIKEY>',
      debug: 3,
    };

    if (peerId) {
      peer = new Peer(peerId, pcConfig)
    } else {
      peer = new Peer(pcConfig)
    }

    peer.on('error', error => {
      console.error(`${error.type}: ${error.message}`)
      throw new Error();
    })

    peer.once('open', localId => {
      this.setState({
        peer,
        localId
      }) 
    })

    // --- Callee side ---- //
    peer.on('call', mediaConnection => {
      mediaConnection.answer(this.state.localStream)
      mediaConnection.on('stream', async stream => {
        this.setState({
          remoteStream: stream,
          mediaConnection,
          remoteId: mediaConnection.remoteId,
        })

        try {
          this.remoteVideo.srcObject = stream
        } catch (e) {
          console.error(e)
          this.remoteVideo.src = URL.createObjectURL(stream)
        }
        this.remoteVideo.play()
      })

      // close
      mediaConnection.once('close', () => {
        this.remoteVideo.srcObject.getTracks().forEach(track => { track.stop() });
        this.remoteVideo.srcObjcect = null
        this.setState({
          remoteStream: null,
          remoteId: '',
          mediaConnection: null
        })
      })
    })
  }

  // --- Caller side --- //
  onCall(e) {
    const { peer, localStream } = this.state
    const url = new URL(window.location.href);
    const remoteId = url.searchParams.get('remoteId') || this.input.current.value
    const mediaConnection = peer.call(remoteId, localStream)

    mediaConnection.on('stream', async stream => {
      this.setState({
        remoteStream: stream,
        mediaConnection,
        remoteId
      })

      try {
        this.remoteVideo.srcObject = stream
      } catch (e) {
        console.error(e)
        this.remoteVideo.src = URL.createObjectURL(stream)
      }
      this.remoteVideo.play()
    })

    // close
    mediaConnection.once('close', () => {
      this.remoteVideo.srcObject.getTracks().forEach(track => { track.stop() });
      this.remoteVideo.srcObjcect = null
      this.setState({
        remoteStream: null,
        remoteId: '',
        mediaConnection: null
      })
    })
  }

  // Caller & Callee close
  onClose(e) {
    if (!this.state.mediaConnection) {
      throw new Error('Error: Connection has not established yet!')
    }

    this.state.mediaConnection.close(true)
    this.setState({
      remoteId: '',
      mediaConnection: null
    })
  }

  renderVolumeBar(stream) {
    if (!stream) return
    return (
      <VolumeBar stream={stream} />
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Connection Status API showcase</p>
        </header>
        <div className="App-main">
          <div className="Video-container">
            <div>
              <p>Local ID: {this.state.peer.id}</p>
              <video className="video" ref={(ref) => {this.localVideo = ref}} />
              {this.renderVolumeBar(this.state.localStream)}
            </div>
            <div>
              <p>Type remote ID.</p>
              <input type="text" ref={this.input} />
              <button className="Call-trigger" onClick={this.onCall}>Connect</button>
              <button className="Close-trigger" onClick={this.onClose}>Close</button>
            </div>
            <div>
              <p>Remote ID: {this.state.remoteId}</p>
              <video className="video" ref={(ref) => {this.remoteVideo = ref}} />
              {this.renderVolumeBar(this.state.remoteStream)}
            </div>
          </div>
          <CommentList mediaConnection={this.state.mediaConnection} />
        </div>
      </div>
    )
  }
}
