import { Component } from 'react';
import './ProfileThumb.css';

class ProfileThumb extends Component {
  state = {};
  render() {
    const { thumbURL, text } = this.props;
    return (
      <div className="profile-thumb">
        <img className="thumb" src={thumbURL} alt={text} />
      </div>
    );
  }
}

export default ProfileThumb;
