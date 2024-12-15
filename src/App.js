import {useEffect, useState} from "react";

function App() {

    const [size, setSize] = useState(20);
    const [grid, setGrid] = useState([]);
    const [error, setError] = useState("");
    const [searchPair, setSearchPair] = useState([]);
    const [isLeftClickDown, setIsLeftClickDown] = useState(false);

    const updateGrid = (e) => {
        let rawVal = e.currentTarget.value;
        let val = parseInt(rawVal);

        if(val > 20) {
            val = 20;
        }

        if(val <= 0 || rawVal === "") {
            val = 1;
        }

        setSize(val);
        setSearchPair([]);
    };

    const visualize = () => {
        if (searchPair.length !== 2) {
            console.error("Points not set");
            setError("Set two points for pathfinding!");
            return;
        }

        setError("");
        djikstra(searchPair[0], searchPair[1], size);
    };

    const handleClickHold = (e, buttonI, reset) => {
        if (reset) {
            setIsLeftClickDown(false);
            return;
        }

        setIsLeftClickDown(!isLeftClickDown);
    };

    const toggleWallPoints = (e, isMouseDownEvent) => {

        if (!isLeftClickDown && !isMouseDownEvent) {
            return;
        }

        let elem = e.currentTarget;
        let px = parseInt(elem.dataset.x);
        let py = parseInt(elem.dataset.y);
        let pstate = parseInt(elem.dataset.state);

        if (isNaN(px) || isNaN(py) || isNaN(pstate)) {
            setError(`Failed to parse search point [${e.currentTarget.dataset}]`);
        }

        setError("");
        let newGrid = [...grid];
        newGrid[px][py].state = newGrid[px][py].state === 0 ? 1 : 0;
        setGrid(newGrid);
    };

    const clearSpotPropRec = (arr, prop, onMatch, newVal) => {
        if (!Array.isArray(arr)) {
            console.log(`Clearing spot matching ${onMatch} to ${newVal}`);

            if (onMatch.length > 0 && arr && typeof arr === 'object' && prop in arr) {
                arr[prop] = onMatch.includes(arr[prop]) ? newVal : arr[prop];
                return;
            }

            if (arr && typeof arr === 'object' && prop in arr) {
                arr[prop] = newVal;
                return;
            }
        }

        for (let i = 0; i < arr.length; i++) {
            clearSpotPropRec(arr[i], prop, onMatch, newVal);
        }
    };

    const clearSpotProp = (prop, onMatch, val) => {
        let newGrid = [...grid];
        clearSpotPropRec(newGrid, prop, onMatch, val);
        setGrid(newGrid);
    };

    const randomizeWaypoints = () => {
        if (grid.length === 0) return;

        clearSpotProp("state", [1], 0);
        clearSpotProp("state", [2, 3], 0);

        let newGrid = [...grid];
        let state = 2;

        for (let i = 0; i < 2; i++) {
            let x = Math.floor(Math.random() * size);
            let y = Math.floor(Math.random() * size);

            console.log(newGrid);
            console.log(x, y);
            newGrid[y][x].state = state++;
        }

        setGrid(newGrid);
    };

    const djikstra = (p1, p2, size) => {

    };

    useEffect(() => {
        let arr = [];
        let row = [];

        for (let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                row.push({x: i, y: j, state: 0});
            }

            arr.push(row);
            row = [];
        }

        setGrid(arr);
        randomizeWaypoints();
    }, [size]);

    return (
        <div className="mount">
            <div className="sidebar">
                <h3 className="title">Settings</h3>
                <hr/>

                <p>Grid</p>
                <input type="number" value={size} onChange={(e) => updateGrid(e)}/>

                <button onClick={randomizeWaypoints}>Randomize Waypoints</button>
                <button onClick={() => clearSpotProp("state", [1], 0)}>Clear Walls</button>
                <button onClick={visualize}>Visualize</button>
            </div>
            <div className="app">
                <h3 className="title">Path Finding Visualizer</h3>
                <hr/>

                {error && <p className="error">{error}</p>}

                <div className="inner">
                    <div className="wrapper"
                         onMouseDown={e => handleClickHold(e, 0, false)}
                         onMouseUp={e => handleClickHold(e, 0, false)}
                         onMouseLeave={e => handleClickHold(e, 0, true)}
                    >
                        {grid.map((row, rowIdx) => (
                            <div key={"row_" + rowIdx} className="row">
                                {row.map((spot, spotIdx) =>
                                    <div
                                        key={"spot_" + (rowIdx * spotIdx) + spotIdx}
                                        className={`spot 
                                        ${spot.state === 1 && "wall"} 
                                        ${spot.state === 2 && "target"} 
                                        ${spot.state === 3 && "destination"} 
                                        `}
                                        data-x={spot.x}
                                        data-y={spot.y}
                                        data-state={spot.state}
                                        onMouseEnter={e => toggleWallPoints(e, false)}
                                        onMouseDown={e => toggleWallPoints(e, true)}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;