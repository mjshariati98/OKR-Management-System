/** @jsxImportSource @emotion/react */
import axios, { AxiosError } from 'axios';
import { Redirect, Route, Switch } from 'react-router-dom';
import 'twin.macro';
import Authentication from './authentication';
import HomePage from './home-page';
import OkrPage from './okr-page';

axios.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status === 401) {
        //
    }
});

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Authentication} />

            <Route exact path="/company/" component={HomePage} />
            <Route exact path="/company/round/:roundId" component={OkrPage} />

            <Route
                exact
                path="/company/:childTargetType(user|team)/:childTargetId/"
                component={HomePage}
            />
            <Route
                exact
                path="/company/:childTargetType(user|team)/:childTargetId/round/:roundId"
                component={OkrPage}
            />

            <Redirect to="/" />
        </Switch>
    );
};

export default App;
