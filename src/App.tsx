import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./redux/modules";
import { setvideoCollectionFromDB } from "./redux/modules/videoCollection";
import { makeStyles } from "@material-ui/core/styles";
import "./App.css";
import NoteCollection from "./note-collection";
import { Drawer, IconButton } from "@material-ui/core";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";
import Video from "./Video";
import { VideoElementProvider } from "./VideoElementContext";

const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
  },
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
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  content: {
    paddingLeft: "24px",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  viewNotes: {
    position: "fixed",
    right: "18px",
    margin: "auto",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    // position: "fixed",
    top: "20%",
    width: "70px",
    height: "250px",
    float: "left",
    fontSize: "1em",
  },
}));

interface AppProps {
  history?: any;
  match?: any;
}

const App: React.FC<AppProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>("");

  useEffect(() => {
    auth?.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  });

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

  const videoid = props.match.params.videoid;
  var videoSrc = "";
  videoCollection.forEach((video: any) => {
    if (video.id === videoid) videoSrc = video.src;
  });

  return (
    <VideoElementProvider>
      <div className="appbody">
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <Video src={videoSrc} videoid={videoid} userid={user.id} />
        </div>
        <div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            className={clsx(!open && classes.open, open && classes.hide)}
          >
            <div className={clsx(classes.viewNotes)}>View Notes</div>
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
};

export default App;
