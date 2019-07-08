import React from 'react'
import './App.css'
import Comment from './Comment'
import { filterComment } from '../utils/CommentFilter';
import { RTCStatsMoment } from "rtcstats-wrapper";

export default class CommentList extends React.Component {
  constructor(props) {
    super(props)
    this.moment = new RTCStatsMoment();
    this.state = {
      comments: [],
      statsStr: '',
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.mediaConnection !== prevProps.mediaConnection) {
      if (this.props.mediaConnection) {
        this.intervalId = setInterval(() => {this.updateComment()}, 1000)
      } else {
        clearInterval(this.intervalId)
        this.clearComment()
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
    this.clearComment()
  }

  async updateComment() {
    const pc = this.props.mediaConnection.getPeerConnection();
    const report = await pc.getStats();
    this.moment.update(report);
    const stats = this.moment.report();

    this.state.statsStr = JSON.stringify(stats, null, 4);

    const filteredComments = filterComment(stats)
    this.setState({
      comments: filteredComments,
    })
  }
  
  clearComment() {
    this.setState({
      comments: [],
    })
  }

  render() {
    const commentItems = this.state.comments.map((comment) => (
      <Comment key={comment.msg} message={comment.msg} type={comment.type} />
    ))
    return (
      <div>
        <div className="Comment-list">{commentItems}</div>
        <pre className="stats-dump">{this.state.statsStr}</pre>
      </div>
    )  
  }
}
