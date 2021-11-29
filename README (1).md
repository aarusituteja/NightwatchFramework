# End-to-end testing with Nightwatch and Cucumber JS

## Setup

1. Clone this repository

```bash
git clone git@github.com:dpc-sdp/sdp-nightwatch.git
cd sdp-nightwatch
```

2. Install dependencies

```bash
npm install
```

## Run tests

### Configuration

Configure the target environment by environment variables.

Rename `.env.example` to `.env` in your local. Then configure it for your testing.

### To run tests by group

```bash
# Run core tests from backend to frontend
npm run cucumber:all -- -- --tags "@core"

# Run core tests for backend only
npm run cucumber:backend -- -- --tags "@core"

# Run core tests for frontend only, must use `fixture` as `TESTID` value.
# This may fail if the fixture content is not exist. Check the next command to create the fixture.
TESTID=fixture npm run cucumber:frontend -- -- --tags "@core"

# If above fixture content is not exist, then create by below first then try above again.
TESTID=fixture npm run cucumber:backend -- -- --tags "@core"

# Run test for particular project, if there is any custom tests.
PROJECT=content-vic npm run cucumber:backend -- -- --tags "@content-vic"
PROJECT=vic-gov-au TESTID=fixture npm run cucumber:frontend -- -- --tags "@vic-gov-au"
```

### To run single feature file

```bash
npm run cucumber -- features/<filename>.feature

# eg
npm run cucumber -- features/backend/createLandingPage.feature
```

### To run tests for particular project

Some projects has custom logics which override the core logic. To work with that, use `PROJECT` env var. The value should be Lagoon project name.

```bash
# Eaxmple for Vic Police
PROJECT=vicpol-vic-gov-au
```

Please be aware that `PROJECT` is different with `tags`. `--tags "@vic-gov-au"` will run custom features tagged by `@vic-gov-au`. But `PROJECT=vic-gov-au` will help e2e to deal with customized core features. We should use both together.

If BrowserStack is used, add `PROJECT` will also group sessions in to the right project in dashboard.

### To run test in Chrome mode(not headless)

By default, cucumber will run in Chrome headless mode.

You can add `NIGHTWATCH_ENV` to switch to different test environment. Check `nightwatch.conf.js` to find all supported browser environments.

```bash
# Run Chrome browser mode
NIGHTWATCH_ENV=chrome npm run cucumber:all -- -- --tags "@core"
```

### To run test in BrowserStack Automate

To run your tests on the browserStack environment, you will need to get the values of the username and the associated key of the browserStack account and store them in the .env file.

```bash
BROWSERSTACK_USER="<the user>"
BROWSERSTACK_KEY="<the access key>"
```

Once the details have been added, we can then run the tests using the commands below.

```bash
BROWSERSTACK=true NIGHTWATCH_ENV=ie11 npm run cucumber:all -- -- --tags "@core"
```

### To run test in CircleCI dashboard manually

In CircleCI sdp-nightwatch project, switch to `master` branch and click `Run Pipeline` button on the top right.

Add below parameters(parameter type is always `string`) before run.

| parameter type | name        | value |
|----------------|-------------|-------|
| string         | be_url      | Same as `BE_BASE_URL`      |
| string         | fe_url      | Same as `FE_BASE_URL`      |
| string         | app         | Which app test to run. Can be `backend`, `frontend` or `all` |
| string         | test_id     | Unique id for your test, only support letters, numbers and dash. Example `1234`, `Abc123` or `Abc-123-e29` |

### To run test in CI

In CircleCI, use the docker image from our repo on [docker hub](https://hub.docker.com/repository/docker/sdptestautomation/e2e/general). For how to use it, please find a example from our custom project CircleCI config file.

### To run test in Docker container locally

To run CircleCI same environment locally, install [remote containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode extension.

In VSCode command palette, select `Remote-Containers: Reopen in Container` command to connect to the docker container. More details can be found in [Create a development container](https://code.visualstudio.com/docs/remote/create-dev-container).

