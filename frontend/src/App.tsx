/** @jsxImportSource @emotion/react */
import { Redirect, Switch } from 'react-router-dom';
import AdvanceRoute from 'src/components/AdvanceRoute';
import 'twin.macro';
import Authentication from './pages/authentication';
import HomePage from './pages/home-page';
import OkrPage from './pages/okr-page';
import Teams from './pages/teams';
import Users from './pages/users';

const App = () => {
    return (
        <Switch>
            <AdvanceRoute
                exact
                path="/authentication"
                mode="unauthorized"
                component={Authentication}
            />

            <AdvanceRoute exact path="/users/" component={Users} />

            <AdvanceRoute exact path="/teams/" component={Teams}/>

            <AdvanceRoute exact path="/company/" component={HomePage} />
            <AdvanceRoute exact path="/company/round/:roundId" component={OkrPage} />

            <AdvanceRoute
                exact
                path="/company/:childTargetType(user|team)/:childTargetId/"
                component={HomePage}
            />
            <AdvanceRoute
                exact
                path="/company/:childTargetType(user|team)/:childTargetId/round/:roundId"
                component={OkrPage}
            />

            <Redirect to="/company/" />
        </Switch>
    );
};

export default App;
