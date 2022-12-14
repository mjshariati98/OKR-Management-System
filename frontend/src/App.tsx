/** @jsxImportSource @emotion/react */
import { Redirect, Switch } from 'react-router-dom';
import AdvanceRoute from 'src/components/AdvanceRoute';
import 'twin.macro';
import Authentication from './pages/authentication';
import HomePage from './pages/home-page';
import OkrPage from './pages/okr-page';
import Teams from './pages/teams';
import OkrsByTypePage from './pages/okrs-by-type-page';
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

            <AdvanceRoute exact path="/okr/:okrId" component={OkrPage}/>

            <AdvanceRoute exact path="/" component={HomePage} />
            <AdvanceRoute
                exact
                path="/okrs/:by(round|team)/:id/"
                component={OkrsByTypePage}
            />

            <Redirect to="/" />
        </Switch>
    );
};

export default App;
