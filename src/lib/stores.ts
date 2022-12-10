import { writable } from 'svelte/store';
import type { MoveNode } from './core/MoveNode';

export const selectedMoveNode = writable<MoveNode>();
