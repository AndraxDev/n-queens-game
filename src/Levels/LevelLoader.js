// import {level1} from "./Levels.js";
import {generateLevel} from "../GameLevelGenerator/GameLevelGenerator.js";

export const loadLevel = () => {
    return generateLevel();
    // return level1;
}