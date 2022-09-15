import {Box, useTheme} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import GameTree from "../types/GameTree";
import {hierarchy, linkVertical, tree} from "d3";
import "@fontsource/roboto-mono/600.css"
import panzoom from "panzoom";
import {MoveNode} from "../types/MoveNode";
import {MouseEvent} from "react";

interface Props {
    gameTree: GameTree
    selectedNodeIdx: number
    onMoveMouseover?: (MoveNode) => void
}

const genLinkPath = linkVertical()
    .x(d => d.x)
    .y(d => d.y);

export function AnalysisTree({gameTree, selectedNodeIdx, onMoveMouseover}: Props) {
    const containerRef = useRef()
    const treeRef = useRef()
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)
    const selectedNode = gameTree.moveArray[selectedNodeIdx]

    useEffect(() => {
        const element = containerRef.current;
        const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            if (!Array.isArray(entries)) return
            if (!entries.length) return
            const rect = entries[0].contentRect

            setWidth(rect.width)
            setHeight(rect.height)
        })
        resizeObserver.observe(element)

        return () => resizeObserver.unobserve(element)
    }, [width, height])

    useEffect(() => {
        panzoom(treeRef.current)
    }, [])

    const theme = useTheme();
    const nodeTree = useMemo(() => {
        const treeRoot = hierarchy(gameTree.rootMoves[0])
        treeRoot.sort()
        const [dx, dy] = [100, 155];
        tree().nodeSize([dx, dy])(treeRoot)
        return treeRoot;
    }, [gameTree])

    function generateLinks() {
        return (<g key={"links"}>{
            nodeTree.links().map((n, i) => {
                return <path key={i} d={genLinkPath(n)}
                      fill={"none"}
                      stroke={"gray"}
                      strokeWidth={3}/>
            })
        }
        </g>);
    }

    function handleNodeMouseover(mouseEvent: MouseEvent<SVGCircleElement>, moveNode: MoveNode) {
        mouseEvent.stopPropagation()
        if (onMoveMouseover) {
            onMoveMouseover(moveNode)
        }
    }

    function generateNodes() {
        return <g key={'nodes'}> {
            nodeTree.descendants().map((n, i) => {
                const isWhiteTurn = n.data.isWhiteTurn
                return <g key={i} transform={`translate(${n.x}, ${n.y})`}>
                    <circle r={40}
                            onMouseOver={(e) => handleNodeMouseover(e, n.data)}
                            fill={isWhiteTurn ? theme.squares.light : theme.squares.dark}
                            stroke={isWhiteTurn ? theme.squares.dark : theme.squares.light}
                            strokeWidth={n.data === selectedNode ? 7 : 3}/>
                    <text textAnchor="middle"
                          fontFamily={"Roboto Mono, monospace"}
                          fontWeight={600}
                          fontSize={35}
                          fill={isWhiteTurn ? theme.squares.dark : theme.squares.light}
                          dy=".35em">{n.data.name}</text>
                </g>
            })
        }
        </g>;
    }

    return <Box sx={{flexGrow: 1}} ref={containerRef}>
        <svg width={width} height={height} ref={treeRef}>
            <g transform={`translate(${width / 3}, 100)`}>
                {generateLinks()}
                {generateNodes()}
            </g>
        </svg>
    </Box>
}