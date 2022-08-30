import {Box, useTheme} from "@mui/material";
import {useEffect, useMemo, useRef, useState} from "react";
import GameTree from "../types/GameTree";
import {hierarchy, linkVertical, tree} from "d3";
import "@fontsource/roboto-mono/600.css"
import panzoom from "panzoom";

interface Props {
    gameTree: GameTree
}

const genLinkPath = linkVertical()
    .x(d => d.x)
    .y(d => d.y);

export function AnalysisTree({gameTree}: Props) {
    const containerRef = useRef()
    const treeRef = useRef()
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        panzoom(treeRef.current)
    }, [])

    const theme = useTheme();
    const nodeTree = useMemo(() => {
        const treeRoot = hierarchy(gameTree.firstMoves[0])
        treeRoot.sort()
        const [dx, dy] = [100, 155];
        tree().nodeSize([dx, dy])(treeRoot)
        return treeRoot;
    }, [gameTree])

    function generateLinks() {
        return nodeTree.links().map((n, i) => {
            return <path key={i} d={genLinkPath(n)}
                         fill={"none"}
                         stroke={"gray"}
                         strokeWidth={3}/>
        });
    }

    function generateNodes() {
        return nodeTree.descendants().map((n, i) => {
            const isWhiteTurn = n.data.isWhiteTurn
            return <g key={i} transform={`translate(${n.x}, ${n.y})`}>
                <circle r={40}
                        fill={isWhiteTurn ? theme.squares.light : theme.squares.dark}
                        stroke={isWhiteTurn ? theme.squares.dark : theme.squares.light}
                        strokeWidth={3}/>
                <text textAnchor="middle"
                      fontFamily={"Roboto Mono, monospace"}
                      fontWeight={600}
                      fontSize={35}
                      fill={isWhiteTurn ? theme.squares.dark : theme.squares.light}
                      dy=".35em">{n.data.name}</text>
            </g>
        });
    }

    return <Box sx={{flexGrow: 1}} ref={containerRef}>
        <svg width={width} height={height} ref={treeRef}>
            <g transform={`translate(${width / 2}, 50)`}>
                {generateLinks()}
                {generateNodes()}
            </g>
        </svg>
    </Box>
}