import { Component } from 'react';
import './ProfileThumb.css';

class ProfileThumb extends Component {
  state = {};
  handleClick = (e) => {
    this.props.onAvatarClick(e);
  };
  render() {
    const { thumbURL, text } = this.props;
    return (
      <div className="profile-thumb" onClick={(e) => this.handleClick(e)}>
        <img className="thumb" src={thumbURL} alt={text} />
      </div>
    );
  }
}

export default ProfileThumb;
