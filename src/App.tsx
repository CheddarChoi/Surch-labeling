import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/modules";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import NoteCollection from "./note-collection";
import { Drawer, IconButton } from "@material-ui/core";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import Video from "./Video";
import { VideoElementProvider } from "./VideoElementContext";
import { Alert, Button } from "antd";

import "./App.css";

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  open: {
    position: "fixed",
    right: "-25px",
    margin: "auto",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    top: "20%",
    width: "70px",
    height: "250px",
    float: "left",
    fontSize: "1.5em",
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

interface AppProps {
  history?: any;
  match?: any;
  user: any;
  registerNum: string;
}

const App: React.FC<AppProps> = ({ history, match, user, registerNum }) => {
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const videoCollection = useSelector(
    (state: RootState) => state.setVideoCollection.videoCollection
  );

  const videoid = match.params.videoid;
  var videoSrc = "";
  videoCollection.forEach((video: any) => {
    if (video.id === videoid) videoSrc = video.src;
  });

  if (videoSrc !== "")
    return (
      <VideoElementProvider>
        <div className="appbody">
          <div
            className={clsx({
              [classes.contentShift]: open,
            })}
            style={{ paddingLeft: "24px" }}
          >
            <Video
              src={videoSrc}
              videoid={videoid}
              user={user}
              registerNum={registerNum}
            />
          </div>
          <div>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              className={clsx(!open && classes.open, open && classes.hide)}
            >
              <div className="viewNotes">View Notes</div>
              <ChevronLeft style={{ fontSize: 40 }} />
            </IconButton>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="right"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className="closebutton">
                <IconButton onClick={handleDrawerClose}>
                  <ChevronRight />
                </IconButton>
              </div>
              <NoteCollection videoid={videoid} />
            </Drawer>
          </div>
        </div>
      </VideoElementProvider>
    );
  else
    return (
      <div style={{ width: "100%", textAlign: "center", padding: "50px" }}>
        <Alert
          message="Wrong approach"
          style={{ marginTop: "24px" }}
          type="error"
        />
        <Button>
          <Link to="/">Go back to video list</Link>
        </Button>
      </div>
    );
};

export default App;
