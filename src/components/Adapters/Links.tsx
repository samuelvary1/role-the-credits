import clsx from "clsx";
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { Tab, makeStyles } from "@material-ui/core";
import { TabProps as MUITabProps } from "@material-ui/core/Tab";

const useStyles = makeStyles({
  tab: {
    opacity: 1
  }
});

export function TabLink(props: MUITabProps & Pick<LinkProps, "to">) {
  const { className, to, label, ...rest } = props;
  const classes = useStyles();

  const renderLink = React.forwardRef<Link>((itemProps, ref) => (
    <Link to={to} {...itemProps} ref={ref} />
  ));

  const mergedCls = clsx(className, classes.tab);

  return (
    // @ts-ignore - ignoring missing `component` in TS definition.
    <Tab
      {...rest}
      value={to}
      component={renderLink}
      label={label}
      className={mergedCls}
    />
  );
}
