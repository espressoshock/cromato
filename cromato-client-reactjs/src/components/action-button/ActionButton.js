import { Component } from 'react';
import './ActionButton.css';

class ActionButton extends Component {
  state = {};
  getSize = (size) => {
    switch (size) {
      case 'm':
        return 'size-medium';
      default:
        return 'size-large';
    }
  };
  onButtonClicked = (e) => {
    this.props.onButtonClicked(e);
  };
  render() {
    const { text, icon, size } = this.props;
    return (
      <div
        className={`action-button ${this.getSize(size)}`}
        onClick={(e) => {
          this.onButtonClicked(e);
        }}
      >
        <img className="icon" src={icon} alt={text} />
        <div className="label">{text}</div>
      </div>
    );
  }
}

export default ActionButton;
