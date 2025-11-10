// import {level1} from "./Levels.js";
import {generateLevel} from "../GameLogic/GameLevelGenerator.js";

export const loadLevel = () => {
    return generateLevel();
    // return level1;
}