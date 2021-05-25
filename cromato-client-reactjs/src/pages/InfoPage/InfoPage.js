import { Component } from 'react';
import './InfoPage.css';

class InfoPage extends Component {
  state = {};
  render() {
    return (
      <div className="info-page">
        <div className="wrapper">
          <div class="header1">
            <header>
              <h1>An online Pomodoro Timer to boost your productivity</h1>
            </header>
          </div>
          <div class="header2">
            <header>
              <h1>What is Pomofocus?</h1>
            </header>
            <p>
              Pomofocus is a customizable pomodoro timer that works on desktop &
              mobile browser. The aim of this app is to help you focus on any
              task you are working on, such as study, writing, or coding. This
              app is inspired by Pomodoro Technique which is a time management
              method developed by Francesco Cirillo.
            </p>
          </div>
          <div class="header3">
            <header>
              <h1>What is Pomodoro Technique?</h1>
            </header>
            <p>
              The Pomodoro Technique is created by Francesco Cirillo for a more
              productive way to work and study. The technique uses a timer to
              break down work into intervals, traditionally 25 minutes in
              length, separated by short breaks. Each interval is known as a
              pomodoro, from the Italian word for 'tomato', after the
              tomato-shaped kitchen timer that Cirillo used as a university
              student. - Wikipedia
            </p>
          </div>
          <div class="list1">
            <header>
              <h1>How to use the Pomodoro Timer?</h1>
            </header>
            <ol>
              <li>Add tasks to work on today</li>
              <li>Set estimate pomodoros (1 = 25min of work) for each tasks</li>
              <li>Select a task to work on</li>
              <li>Start timer and focus on the task for 25 minutes</li>
              <li>Take a break for 5 minutes when the alarm ring</li>
              <li>Iterate 3-5 until you finish the tasks</li>
            </ol>
          </div>
          <div class="list2">
            <header>
              <h1>Features</h1>
            </header>
            <ul>
              <li>Responsive design that works with desktop and mobile</li>
              <li>
                Color transition to switch moods between work time and rest time
              </li>
              <li>Audio notification at the end of a timer period</li>
              <li> Customizable timer intervals to suit your preference</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default InfoPage;
