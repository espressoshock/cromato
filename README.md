# Pomodoro-sauce | DA376D VT21 Project
> Pomodoro timer with offline capabilities

## Technologies used / Requirements

### Grade 3

1. Version control: GitHub | `🏷️req 3.1`
2. NodeJS backend | `🏷️req 3.2`
3. Front-end: ReactJS / Vanilla JS (web app) | `🏷️req 3.3`
4. Persistent storage:  PostgreSQL or MySQL or Firebase `🏷️req 3.4`
5. Purpose: time management | `🏷️req 3.5`
6. Documentation: availble on readme file |`🏷️req 3.6`
7. User can auth to store his _tasks_ or (todos) | `🏷️req 3.7`
8. the NodeJS will provide a REST API that serves all the data (todos / user-info etc) `🏷️req 3.8`

### Grade 4

1. Data collection: add tasks (todos)
   1. statistics function: (__ask professor for !clarification__) -> I think: weekly/monthly performances (tasks completed over tsime) | `🏷️req 4.9`
2. Separate view to display monthly performance (display statistics) | `🏷️req 4.10`
3. NodeJS _OPEN REST API_ that provides statistics | `🏷️req 4.11`
4. " Distinctive Cloud Technology ": __need !clarification__ |  `🏷️req 4.12`

### Grade 5

1. Create a deployable docker image |  `🏷️req 5.13`
2. either:  `🏷️req 4.14`
   1. deploy with GH Actions
   2. build/test with GH Actions
3. React Offline capabilities |  `🏷️req 4.15`
   1. You can add/remove/edit tasks (todos) while offline and push them as soon as you go online w/ localstorage
4. Both the REST API (todos/user) and OPEN REST API (statistics) must verify the user identity before serving the request |  `🏷️req 4.16`
5. In-depth documentation on readme with technical explanation |  `🏷️req 4.17`