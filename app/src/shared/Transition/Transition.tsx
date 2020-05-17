import React from "react";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

interface TransitionProps {
  children: any;
  grid: RegExp[][];
  timeout: number;
  classExtension: string;
  animate?: boolean;
}

interface Location {
  location: any; // This is the location object from react-router {i.e. the object you get from useLocation()} but i couldnt find the type annotation for it
  className: string;
}

const empty: Location[] = [];

/**
 * Tranistion is a very basic animation wrapper that has a very specific use case.
 *
 * It allows you to have different routes within react-router places as if in a grid and provide customized transitions based
 * on the direction.
 *
 * @param grid Which is a RegExp 2D array which is used to match against the route to determine the direction
 *
 * @param timeout The time after previous component is unmounted.
 *
 * @param classExtension Gives the base name for each class.
 *
 * There are three 'classStates' - `enter`, `done`, `leave`.
 *   `enter`- When the component, as well as the previous component, are mounted.
 *   `done`- When the previous component is unmounted.
 *   `leave`- When this component is going to be unmounted.
 *
 * There are four directions - `top`, `bottom`, `left` and `right`, as well as `same-forward` and `same-backward`
 * These all refer to the direction the next component is in where same means same position in the grid, and
 * forward means further down the url tree
 *
 * The classes are of the form `classExtension-direction-classState`
 * eg. pages-left-done
 *  `pages` The name supplied to the Transition component
 *  `left` The current component was to the left of the previous component
 *  `done` The previous component has been unmounted and backward means behind in the url tree
 */
function Transition({ children, grid, timeout, classExtension, animate = true }: TransitionProps) {
  const [locations, setLocations] = useState(empty);

  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((location) => {
      setLocations((locations) => {
        const dir = getDir(location.pathname, locations[locations.length - 1].location.pathname, grid);

        // if (dir === "nothing") return locations;

        const className = `${classExtension}-${dir}`;

        locations[locations.length - 1].className = className + "-leave";

        setTimeout(() => {
          setLocations((locations) => {
            locations[1].className = classExtension + "-done";

            return locations.slice(1);
          });
        }, timeout);

        return [...locations, { location, className: className + "-enter" }];
      });
    });

    setLocations([
      {
        location: history.location,
        className: "",
      },
    ]);

    return unlisten;
  }, []);

  if (!animate) {
    return children(history.location);
  }

  return (
    <div>
      {locations.map(({ location, className }) => (
        <div className={`${className} transition-group ${classExtension}`} key={location.key}>
          {children(location)}
        </div>
      ))}
    </div>
  );
}

export default Transition;

const getDir = (pathname: string, prevpath: string, grid: RegExp[][]) => {
  let pathnameIndex: number[];
  let prevpathIndex: number[];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j].test(pathname)) {
        pathnameIndex = [j, i];
      }
      if (grid[i][j].test(prevpath)) {
        prevpathIndex = [j, i];
      }
    }
  }

  if (!pathnameIndex || !prevpathIndex || pathnameIndex === prevpathIndex) {
    return "nothing";
  }

  if (pathnameIndex[1] < prevpathIndex[1]) return "top";
  if (pathnameIndex[1] > prevpathIndex[1]) return "bottom";
  if (pathnameIndex[0] < prevpathIndex[0]) return "left";
  if (pathnameIndex[0] > prevpathIndex[0]) return "right";

  if (pathname.split("/").length > prevpath.split("/").length) return "same-forward";
  if (pathname.split("/").length < prevpath.split("/").length) return "same-backward";

  return "same";
};
