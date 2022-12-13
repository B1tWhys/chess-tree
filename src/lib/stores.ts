import { writable } from 'svelte/store';
import GameTree from './core/GameTree';
import type { MoveNode } from './core/MoveNode';

export const selectedMoveNode = writable<MoveNode>();
export const gameTree = writable<GameTree>(GameTree.fromPgnStr('1. e4'));
