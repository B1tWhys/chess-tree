import {Box} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import chessTreePlaceholder from "../assets/ChessTreePlaceholder.png";
import GameTree from "../types/GameTree";
import {select, hierarchy, tree, linkVertical} from "d3";

interface Props {
    gameTree: GameTree
}
export function AnalysisTree({gameTree}: Props) {
    const containerRef = useRef()
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        const element = containerRef.current;
        const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            if (!Array.isArray(entries)) return
            if (!entries.length) return
            const rect = entries[0].contentRect

            console.log(`width: ${rect.width} height: ${rect.height}`)
            setWidth(rect.width)
            setHeight(rect.height)
        })
        resizeObserver.observe(element)

        return () => resizeObserver.unobserve(element)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const svgRef = useRef()

    useEffect(() => {
        const svgElement = select(svgRef.current)
        const root = hierarchy(gameTree.firstMoves[0])
        root.sort()
        const [dx, dy] = [80, 120];
        tree().nodeSize([dx, dy])(root)

        svgElement.select('g').remove()

        console.log("d3 appending...")
        const treeGroup = svgElement.append('g')
            .attr('transform', 'translate(200, 50)')
        treeGroup.selectAll('path')
            .data(root.links())
            .join('path')
            .attr('d', linkVertical()
                .x(d => d.x)
                .y(d => d.y))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', '3')
        treeGroup.selectAll('circle')
            .data(root.descendants())
            .join('circle')
                .attr('r', 30)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('fill', '#fff')
    }, [gameTree, width, height])

    return <Box sx={{flexGrow: 1}} ref={containerRef}>
        <svg ref={svgRef} width={width} height={height}/>
    </Box>
}