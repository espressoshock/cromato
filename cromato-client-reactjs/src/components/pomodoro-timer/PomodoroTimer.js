import { Component } from 'react';
import './PomodoroTimer.css';

class PomodoroTimer extends Component {
  state = {
    states: ['idle', 'ready', 'active', 'task-expanded', 'break'],
    cState: undefined,
  };
  componentDidMount() {
    this.setState({ cState: 0 });
  }

  getTimerState = () => {
    return this.state.states[this.state.cState];
  };
  onMouseEnter = (e) => {
    this.setState({ cState: 1 });
  };
  onMouseLeave = (e) => {
    this.setState({ cState: 0 });
  };

  //states: idle, ready, active, task-expanded, break
  render() {
    return (
      <div className={`pomodoro-timer ${this.getTimerState()}`}>
        <div
          className="svg-wrapper"
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className="inner-panel"></div>
          <svg xmlns="http://www.w3.org/2000/svg" width="807px" height="740px">
            <g className="top-sect">
              <g className="top-sect-anim">
                <path
                  fill-rule="evenodd"
                  fill="rgb(133, 17, 44)"
                  d="M781.813,367.793 L788.980,365.164 C788.980,365.164 787.061,369.967 785.226,377.148 C781.108,383.419 774.016,387.563 765.953,387.563 L40.766,387.563 C32.680,387.563 25.572,383.395 21.458,377.095 C19.722,370.306 17.916,365.662 17.736,365.204 C17.736,365.193 17.736,365.181 17.735,365.169 L24.647,367.705 L24.647,348.050 C28.803,343.981 34.490,341.469 40.766,341.469 L765.953,341.469 C772.100,341.469 777.681,343.880 781.813,347.803 L781.813,367.793 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(192, 34, 67)"
                  d="M803.434,316.483 C802.509,324.314 799.120,348.285 790.901,363.242 C786.308,371.601 783.864,377.414 772.965,377.414 L703.782,377.414 L703.782,377.335 L403.350,377.335 L102.917,377.335 L102.917,377.414 L33.735,377.414 C22.835,377.414 20.392,371.601 15.798,363.242 C7.580,348.285 4.191,324.314 3.266,316.483 C-2.687,287.758 -0.609,249.996 24.767,205.659 C84.217,101.784 169.661,107.010 188.755,107.010 C207.849,107.010 403.350,107.010 403.350,107.010 C403.350,107.010 598.850,107.010 617.944,107.010 C637.039,107.010 722.482,101.784 781.933,205.659 C807.308,249.996 809.386,287.758 803.434,316.483 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(227, 56, 62)"
                  d="M444.347,375.413 C425.619,375.413 405.373,376.156 384.207,377.335 L102.917,377.335 L102.917,377.414 L33.735,377.414 C22.835,377.414 20.392,371.601 15.798,363.242 C7.580,348.285 4.191,324.314 3.266,316.483 C-2.687,287.758 -0.609,249.996 24.767,205.659 C84.217,101.784 169.661,107.010 188.755,107.010 C201.844,107.010 297.816,107.010 356.896,107.010 C373.688,119.582 384.132,139.724 384.132,172.349 C384.132,231.388 411.132,222.314 434.738,222.314 C449.902,222.314 473.305,199.214 489.188,176.192 C505.070,153.171 554.019,114.657 573.104,202.456 C592.189,290.256 600.781,375.413 444.347,375.413 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(251, 112, 109)"
                  d="M91.387,240.251 C91.387,240.251 78.067,347.188 147.118,333.135 C216.168,319.082 260.633,274.162 264.344,235.767 C268.055,197.371 239.494,179.356 197.723,180.677 C155.953,181.997 93.898,206.757 91.387,240.251 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(255, 196, 182)"
                  d="M85.622,237.688 C85.622,237.688 90.238,276.724 136.228,261.390 C182.217,246.055 192.091,226.759 175.944,201.816 C159.797,176.873 118.979,177.930 97.152,201.816 C81.988,218.410 85.622,237.688 85.622,237.688 Z"
                />
              </g>
            </g>
            <g className="bottom-sect">
              <g className="bottom-sect-anim">
                <path
                  fill-rule="evenodd"
                  fill="rgb(156, 31, 65)"
                  d="M789.060,457.677 C789.033,457.801 789.008,457.922 788.980,458.048 C788.353,460.764 788.122,462.776 788.208,464.196 C752.614,721.508 511.707,740.810 430.224,739.874 L430.254,739.904 L382.851,739.904 L382.967,739.752 C308.713,741.708 55.087,728.747 18.492,464.196 C18.578,462.776 18.347,460.764 17.720,458.048 C17.691,457.922 17.667,457.801 17.639,457.677 C17.293,454.862 16.972,452.019 16.675,449.148 C16.941,432.554 31.813,431.144 31.813,431.144 L403.350,431.144 L774.887,431.144 C774.887,431.144 789.759,432.554 790.025,449.148 C789.727,452.019 789.406,454.862 789.060,457.677 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(192, 34, 67)"
                  d="M493.031,683.533 C484.381,668.547 504.684,608.772 553.246,617.553 C601.808,626.333 615.504,677.955 575.026,695.063 C534.547,712.171 505.426,705.007 493.031,683.533 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(255, 196, 182)"
                  d="M564.776,672.002 C564.776,672.002 545.726,649.841 583.353,638.692 C604.648,632.382 605.936,650.809 605.133,654.706 C604.329,658.604 589.594,707.386 564.776,672.002 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(191, 33, 66)"
                  d="M567.339,597.695 C480.808,597.695 477.017,484.953 477.017,484.953 C477.017,484.953 532.116,461.836 596.377,434.144 L774.887,434.144 C774.887,434.144 786.185,432.219 789.261,443.487 C763.752,611.334 643.274,597.695 567.339,597.695 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(227, 56, 62)"
                  d="M753.747,496.483 C708.904,496.483 575.025,496.483 575.025,496.483 C575.025,496.483 522.226,493.135 492.391,553.495 C462.555,613.854 349.929,660.472 246.407,660.472 C171.934,660.472 86.892,645.159 43.383,556.237 C31.922,529.564 23.316,499.073 18.491,464.196 C18.578,462.776 18.347,460.764 17.720,458.048 C17.691,457.922 17.667,457.801 17.639,457.676 C17.293,454.862 16.972,452.019 16.675,449.148 C16.941,432.554 31.813,433.144 31.813,433.144 L403.350,433.144 L774.887,433.144 C774.887,433.144 789.759,432.554 790.025,449.148 C789.727,452.019 789.406,454.862 789.060,457.676 C789.033,457.801 789.008,457.922 788.980,458.048 C788.353,460.764 788.122,462.776 788.208,464.196 C787.802,467.129 787.361,470.020 786.903,472.892 C781.740,485.695 771.980,496.483 753.747,496.483 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(155, 21, 49)"
                  d="M790.025,449.148 C789.983,449.551 789.932,449.942 789.889,450.344 L16.810,450.344 C16.768,449.942 16.717,449.551 16.675,449.148 C16.720,446.333 17.193,443.963 17.935,441.955 L17.720,442.034 C17.720,442.034 24.766,424.412 24.766,406.161 C24.766,388.343 46.132,429.196 47.146,431.144 L403.350,431.144 L759.554,431.144 C760.567,429.196 781.933,388.343 781.933,406.161 C781.933,424.412 788.980,442.034 788.980,442.034 L788.765,441.955 C789.507,443.963 789.979,446.333 790.025,449.148 Z"
                />
                <path
                  fill-rule="evenodd"
                  opacity="0.541"
                  fill="rgb(133, 17, 44)"
                  d="M18.720,442.034 C18.720,442.034 18.721,442.031 18.721,442.031 L18.727,442.031 L18.720,442.034 ZM789.973,442.031 L789.979,442.031 C789.979,442.031 789.980,442.034 789.980,442.034 L789.973,442.031 ZM17.675,449.148 C17.720,446.367 18.184,444.024 18.910,442.031 L789.789,442.031 C790.516,444.024 790.980,446.367 791.025,449.148 C790.983,449.551 790.932,449.942 790.889,450.344 L17.810,450.344 C17.768,449.942 17.717,449.551 17.675,449.148 Z"
                ></path>
              </g>
            </g>
            <g className="controls">
              <g className="controls-anim">
                <path
                  className="shelf-arrow-control"
                  fill-rule="evenodd"
                  d="M373.883,321.604 C376.804,317.612 392.179,291.801 396.303,285.091 C400.428,278.381 407.660,279.523 410.396,283.810 C413.133,288.097 430.852,317.236 433.457,321.604 C436.062,325.973 434.436,334.416 428.333,334.416 C420.261,334.416 384.947,334.416 379.648,334.416 C374.349,334.416 369.305,327.862 373.883,321.604 Z"
                />
              </g>
            </g>
            <g className="peduncle-sect">
              <g className="peeduncle-sect-anim">
                <path
                  fill-rule="evenodd"
                  fill="rgb(69, 95, 108)"
                  d="M403.350,64.731 L567.979,35.265 C567.979,35.265 587.729,29.232 619.866,49.358 C652.003,69.483 694.814,97.401 694.814,97.401 C694.814,97.401 699.510,107.010 685.846,107.010 C672.182,107.010 403.350,107.010 403.350,107.010 L403.350,64.731 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(81, 128, 108)"
                  d="M403.350,64.731 L238.721,35.265 C238.721,35.265 218.971,29.232 186.834,49.358 C154.696,69.483 111.886,97.401 111.886,97.401 C111.886,97.401 107.189,107.010 120.854,107.010 C134.518,107.010 403.350,107.010 403.350,107.010 L403.350,64.731 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(130, 170, 81)"
                  d="M111.886,97.401 C111.886,97.401 154.696,69.483 186.834,49.358 C218.971,29.232 238.721,35.265 238.721,35.265 L274.262,41.626 C293.608,54.954 305.371,74.355 302.397,107.010 C224.570,107.010 128.864,107.010 120.854,107.010 C107.189,107.010 111.886,97.401 111.886,97.401 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(72, 122, 113)"
                  d="M685.846,107.010 C678.360,107.010 594.296,107.010 519.802,107.010 C514.337,106.514 510.036,106.466 507.138,107.010 C505.863,107.010 504.598,107.010 503.332,107.010 C503.687,98.724 506.558,65.263 529.605,42.133 L567.979,35.265 C567.979,35.265 587.729,29.232 619.866,49.358 C652.003,69.483 694.814,97.401 694.814,97.401 C694.814,97.401 699.510,107.010 685.846,107.010 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(72, 122, 113)"
                  d="M403.350,115.978 L338.651,115.978 C338.651,115.978 353.385,35.324 353.385,16.688 C353.385,-1.948 364.915,0.673 364.915,0.673 L403.350,0.673 L441.785,0.673 C441.785,0.673 453.315,-1.948 453.315,16.688 C453.315,35.324 468.048,115.978 468.048,115.978 L403.350,115.978 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(102, 148, 94)"
                  d="M379.008,28.859 C379.008,58.943 382.354,92.667 373.052,115.978 L346.609,115.978 C344.679,111.706 342.875,106.724 341.275,101.250 C345.511,77.079 353.385,30.312 353.385,16.688 C353.385,-1.948 364.915,0.673 364.915,0.673 L403.350,0.673 L406.382,0.673 C392.293,4.214 379.008,12.018 379.008,28.859 Z"
                />
                <path
                  fill-rule="evenodd"
                  fill="rgb(130, 170, 81)"
                  d="M480.860,127.508 C480.860,127.508 412.667,221.112 409.756,225.517 C406.844,229.923 403.350,229.653 403.350,229.653 C403.350,229.653 399.856,229.923 396.944,225.517 C394.032,221.112 325.840,127.508 325.840,127.508 C325.840,127.508 310.665,91.656 366.837,86.511 C384.080,84.932 403.350,83.949 403.350,83.949 C403.350,83.949 422.620,84.932 439.863,86.511 C496.035,91.656 480.860,127.508 480.860,127.508 Z"
                />
              </g>
            </g>
          </svg>
          <div className="interactive-controls">
            <div className="lx-group">
              <div className="checkbox">
                <div className="icon"></div>
              </div>
              <input
                type="text"
                className="task-name"
                value={'Type to add a task...'}
              />
            </div>
            <div className="task-completion">
              <div className="c-pomodoro">1</div>
              <div className="separator">/</div>
              <div className="a-pomodoro">3</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PomodoroTimer;
