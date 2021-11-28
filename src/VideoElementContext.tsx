import React from "react";

const VideoElementContext = React.createContext<
  VideoElementContextType | undefined
>(undefined);
type VideoElementContextType = {
  videoElement: HTMLVideoElement | any;
  setVideoElement: (value: HTMLVideoElement | any) => void;
};

export const useVideoElement = () => React.useContext(VideoElementContext);
export const VideoElementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoElement, setVideoElement] = React.useState(null);
  React.useEffect(() => {
    setVideoElement(null);
  }, []);

  return (
    <VideoElementContext.Provider value={{ videoElement, setVideoElement }}>
      {children}
    </VideoElementContext.Provider>
  );
};
