import React, { useState, useEffect } from "react";
import {
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
  AiOutlineSetting,
} from "react-icons/ai";
import { ISettings } from "../Playground";
import SettingsModal from "@/components/Modals/SettingsModal";

type PreferenceNavProps = {
  settings: ISettings;
  setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({
  setSettings,
  settings,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }
    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
    }
  }, []);

  return (
    <div className="flex items-center justify-between bg-dark-layer-2 h-11 w-full">
      <div className="flex items-center text-white">
        <button className="flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium">
          <div className="flex items-center px-1">
            <div className="text-xs text-label-2 dark:text-dark-label-2">
              Javascript
            </div>
          </div>
        </button>
      </div>

      <div className="flex items-center m-2">
        <button
          className="relative rounded px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex ml-auto p-1 mr-2 hover:bg-dark-fill-3 group"
          onClick={() => setSettings({ ...settings, settingsModalsOpen: true })}
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            <AiOutlineSetting />
          </div>
          <div className="absolute w-auto text-sm m-2 min-w-max translate-x-3 right-0 top-7 z-10 py-1.5 px-2 rounded-md shadow-md text-dark-layer-2 bg-gray-200 origin-center scale-0 transition-all duration-100 ease-linear group-hover:scale-100">
            Settings
          </div>
        </button>

        <button
          className="relative rounded px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex ml-auto p-1 mr-2 hover:bg-dark-fill-3 group"
          onClick={handleFullScreen}
        >
          <div className="h-4 w-4 text-dark-gray-6 font-bold text-lg">
            {!isFullScreen ? (
              <AiOutlineFullscreen />
            ) : (
              <AiOutlineFullscreenExit />
            )}
          </div>
          <div className="absolute w-auto text-sm m-2 min-w-max translate-x-3 right-0 top-7 z-10 py-1.5 px-2 rounded-md shadow-md text-dark-layer-2 bg-gray-200 origin-center scale-0 transition-all duration-100 ease-linear group-hover:scale-100">
            Full Screen
          </div>
        </button>
      </div>
      {settings.settingsModalsOpen && (
        <SettingsModal settings={settings} setSettings={setSettings} />
      )}
    </div>
  );
};
export default PreferenceNav;
