import {
  AppBar,
  Tabs,
  Theme,
  Toolbar,
  Typography,
  Grid,
  makeStyles,
  createStyles
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router";
import { TabLink } from "../../components/Adapters/Links";
import { ROUTES } from "../../config/routes";
import Index from "../Index/Index";
import Create from "../Create/Create";
import Update from "../Update/Update";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    tabs: {
      flexGrow: 1
    },
    wrapperRoot: {
      margin: "0 auto",
      minHeight: "auto",
      maxWidth: theme.breakpoints.width("lg"),
      minWidth: theme.breakpoints.width("md"),
      width: "100%"
    },
    content: {
      marginTop: theme.spacing(4)
    }
  })
);

export default () => {
  const classes = useStyles();

  const history = useHistory();
  const { pathname } = useLocation();
  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="sticky">
        <Toolbar className={classes.wrapperRoot}>
          <Tabs
            indicatorColor="primary"
            value={pathname}
            className={classes.tabs}
          >
            <TabLink label="Index" to={ROUTES.index} value={ROUTES.index} />
            <TabLink label="Create" to={ROUTES.create} value={ROUTES.create} />
            <TabLink label="Update" to={ROUTES.update} value={ROUTES.update} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <div className={clsx(classes.wrapperRoot, classes.content)}>
        <Typography variant="h5">Role the Credits!</Typography>
        <Grid container direction="column" spacing={10}>
          <Grid item>
            <Switch>
              <Route exact path={ROUTES.index} component={Index} />
              <Route path={ROUTES.create} component={Create} />
              <Route path={`${ROUTES.update}`} component={Update} />
              <Redirect to={ROUTES.index} />
            </Switch>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
