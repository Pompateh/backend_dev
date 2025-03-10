import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Drawer variant="permanent">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/brands">
          <ListItemText primary="Brands" />
        </ListItem>
        <ListItem button component={Link} to="/illustrations">
          <ListItemText primary="Illustrations" />
        </ListItem>
        <ListItem button component={Link} to="/products">
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button component={Link} to="/typefaces">
          <ListItemText primary="Typefaces" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
